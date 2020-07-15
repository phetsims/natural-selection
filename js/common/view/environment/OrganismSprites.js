// Copyright 2020, University of Colorado Boulder

/**
 * OrganismSprites renders sprites for all organisms (living things) in the environment.
 * It uses scenery's high-performance Sprites feature, which uses renderer:'webgl', with a fallback of 'canvas'.
 * While each sprite instance stays synchronized with its associated model element, update() must be explicitly
 * called to render this Node correctly.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import PressListener from '../../../../../scenery/js/listeners/PressListener.js';
import SpriteListenable from '../../../../../scenery/js/listeners/SpriteListenable.js';
import Sprites from '../../../../../scenery/js/nodes/Sprites.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import BunnyCollection from '../../model/BunnyCollection.js';
import Food from '../../model/Food.js';
import WolfCollection from '../../model/WolfCollection.js';
import BunnySpriteInstance from './BunnySpriteInstance.js';
import ShrubSpriteInstance from './ShrubSpriteInstance.js';
import WolfSpriteInstance from './WolfSpriteInstance.js';

class OrganismSprites extends Sprites {

  /**
   * @param {BunnyCollection} bunnyCollection
   * @param {WolfCollection} wolfCollection
   * @param {Food} food
   * @param {Bounds2} canvasBounds
   * @param {Tandem} tandem
   */
  constructor( bunnyCollection, wolfCollection, food, canvasBounds, tandem ) {

    assert && assert( bunnyCollection instanceof BunnyCollection, 'invalid bunnyCollection' );
    assert && assert( wolfCollection instanceof WolfCollection, 'invalid wolfCollection' );
    assert && assert( food instanceof Food, 'invalid food' );
    assert && assert( canvasBounds instanceof Bounds2, 'invalid canvasBounds' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // {Sprite[]} sprites for all organisms
    const sprites = [
      ...BunnySpriteInstance.getSprites(),
      ...WolfSpriteInstance.getSprites(),
      ...ShrubSpriteInstance.getSprites()
    ];

    // {ShrubSpriteInstance[]} sprite instances for shrubs
    const shrubSpriteInstances = _.map( food.shrubs, shrub => new ShrubSpriteInstance( shrub, food.isToughProperty.value ) );

    // {SpriteInstances[]} sprite instances for all organisms
    const spriteInstances = [ ...shrubSpriteInstances ];

    super( {
      sprites: sprites,
      spriteInstances: spriteInstances,
      canvasBounds: canvasBounds, //TODO #128 constrained to these bounds only with canvas, and it's a little off
      hitTestSprites: true,  //TODO #128 how to hit test only bunny sprites?  add pickable to SpriteImage
      cursor: 'pointer',

      inputListeners: [

        // Mix in SpriteListenable, so we have access to the SpriteInstance.
        new ( SpriteListenable( PressListener ) )( {

          // Select a bunny, or clear the current selection.
          press: ( event, listener ) => {

            const spriteInstance = listener.spriteInstance;
            if ( spriteInstance && spriteInstance instanceof BunnySpriteInstance ) {
              bunnyCollection.selectedBunnyProperty.value = spriteInstance.bunny;
            }
            else {
              bunnyCollection.selectedBunnyProperty.value = null;
            }

            //TODO #128 move selected bunny to front
            //TODO #128 add selection rectangle behind selected bunny
          },

          tandem: tandem.createTandem( 'pressListener' )
        } )
      ],

      tandem: tandem
    } );

    // @private
    this.spriteInstances = spriteInstances;

    // Creates a sprite instance of a bunny
    const createBunnySpriteInstance = bunny => {

      // PhET-iO state will restore both live and dead bunnies. Create SpriteInstances only for the live ones.
      if ( bunny.isAlive ) {

        // Create a SpriteInstance for the bunny.
        const bunnySpriteInstance = new BunnySpriteInstance( bunny );
        spriteInstances.push( bunnySpriteInstance );

        // If the bunny dies or is disposed, dispose of bunnySpriteInstance.
        const disposeBunnySpriteInstance = () => {
          bunny.diedEmitter.removeListener( disposeBunnySpriteInstance );
          bunny.disposedEmitter.removeListener( disposeBunnySpriteInstance );
          spriteInstances.splice( spriteInstances.indexOf( bunnySpriteInstance ), 1 );
        };
        bunny.diedEmitter.addListener( disposeBunnySpriteInstance );
        bunny.disposedEmitter.addListener( disposeBunnySpriteInstance );
      }
    };

    // Create a BunnyNode for each Bunny in the initial population.
    bunnyCollection.liveBunnies.forEach( createBunnySpriteInstance );

    // When a bunny is created...
    bunnyCollection.bunnyCreatedEmitter.addListener( createBunnySpriteInstance );

    // When a wolf is created...
    wolfCollection.wolfCreatedEmitter.addListener( wolf => {

      // Create a SpriteInstance for the wolf.
      const wolfSpriteInstance = new WolfSpriteInstance( wolf );
      spriteInstances.push( wolfSpriteInstance );

      // When the wolf is disposed, remove wolfSpriteInstance.
      // removeListener is not necessary, because wolf.disposeEmitter is disposed.
      wolf.disposedEmitter.addListener( () => {
        spriteInstances.splice( spriteInstances.indexOf( wolfSpriteInstance ), 1 );
      } );
    } );

    // Change sprites for shrubs depending on whether food is tough or tender.
    food.isToughProperty.link( isTough => {
      shrubSpriteInstances.forEach( shrubSpriteInstance => {
        shrubSpriteInstance.setTough( isTough );
      } );
      this.invalidatePaint();
    } );

    // Hide half of the shrubs when food is limited.
    food.isLimitedProperty.link( isLimited => {

      // Start by removing all shrubs
      shrubSpriteInstances.forEach( shrubSpriteInstance => {
        spriteInstances.splice( spriteInstances.indexOf( shrubSpriteInstance ), 1 );
      } );

      if ( isLimited ) {

        // Food is limited, add every other shrub.
        for ( let i = 0; i < shrubSpriteInstances.length; i += 2 ) {
          spriteInstances.push( shrubSpriteInstances[ i ] );
        }
      }
      else {

        // Food is not limited, add all shrubs.
        shrubSpriteInstances.forEach( shrubSpriteInstance => {
          spriteInstances.push( shrubSpriteInstance );
        } );
      }

      this.update();
    } );

    this.update();
  }

  /**
   * Sorts the SpriteInstances based on z coordinate of their associated organism. Then repaints.
   * Operations that change visibility or appearance (e.g. hiding shrubs, changing shrubs from tender to tough)
   * should call update immediately. Animation (e.g. moving bunnies or wolves) should be handled by calling
   * update from view.step, after model.step has positioned the model elements.
   * @public
   */
  update() {

    // Sort by z coordinate, from back to front.
    // Use splice instead of assignment because super has a reference to this.spriteInstances.
    //TODO #128 order looks incorrect
    //TODO #128 use this.spriteInstances.sort( compareFunction )
    //TODO #128 if sort is a performance issue, then sort when each organism moves if its z changed
    const sortedSpriteInstances = _.sortBy( this.spriteInstances, spriteInstance => spriteInstance.organism.positionProperty.value.z ).reverse();
    this.spriteInstances.splice( 0, this.spriteInstances.length, ...sortedSpriteInstances );

    //TODO #128 move selected bunny and selection rectangle to front

    // Repaint.
    this.invalidatePaint();
  }
}

naturalSelection.register( 'OrganismSprites', OrganismSprites );
export default OrganismSprites;