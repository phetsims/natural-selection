// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionSprites renders sprites for all organisms (living things) in the environment.
 * It uses scenery's high-performance Sprites feature, which uses renderer:'webgl', with a fallback of 'canvas'.
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

    // {ShrubSpriteInstance[]}
    const shrubSpriteInstances = _.map( food.shrubs, shrub => new ShrubSpriteInstance( shrub ) );

    // {SpriteInstances[]}
    const spriteInstances = [ ...shrubSpriteInstances ];

    super( {
      sprites: sprites,
      spriteInstances: spriteInstances,
      canvasBounds: canvasBounds, //TODO #128 constrained to these bounds only with canvas, and it's a little off
      hitTestSprites: true,  //TODO #128 how to hit test only bunny sprites?
      cursor: 'pointer', //TODO #128 how to show cursor for only bunny sprites?

      // Mix in SpriteListenable, so we have access to the SpriteInstance, and will only interact when there is one.
      inputListeners: [
        new ( SpriteListenable( PressListener ) )( {
          applyOffset: false, //TODO #128 what is this?

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

    // When a bunny is created...
    bunnyCollection.bunnyCreatedEmitter.addListener( bunny => {

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
    } );

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
    //TODO #128 delete Shrub.isToughProperty
    //TODO #128 handle 'B' and 'C' shrub images
    food.isToughProperty.link( isTough => {
      shrubSpriteInstances.forEach( shrubSpriteInstance => {
        shrubSpriteInstance.sprite = isTough ? ShrubSpriteInstance.SHRUB_TOUGH_SPRITE : ShrubSpriteInstance.SHRUB_TENDER_SPRITE;
      } );
      this.invalidatePaint();
    } );

    // @private
    this.spriteInstances = spriteInstances;

    this.update();
  }

  /**
   * Sorts the SpriteInstances based on z coordinate of their associated organism. Then repaints.
   * @public
   */
  update() {

    // Sort by z coordinate, from back to front.
    // Use splice instead of assignment because super has a reference to this.spriteInstances.
    //TODO #128 change Sprites API to make spriteInstances mutable, so we can use assignment?
    //TODO #128 how fast is _.sortBy ?
    const sortedSpriteInstances = _.sortBy( this.spriteInstances, spriteInstance => spriteInstance.organism.positionProperty.value.z ).reverse();
    this.spriteInstances.splice( 0, this.spriteInstances.length, ...sortedSpriteInstances );

    //TODO #128 move selected bunny and selection rectangle to front

    // Repaint.
    this.invalidatePaint();
  }
}

naturalSelection.register( 'OrganismSprites', OrganismSprites );
export default OrganismSprites;