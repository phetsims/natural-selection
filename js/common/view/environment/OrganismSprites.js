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
import Sprite from '../../../../../scenery/js/util/Sprite.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import bunnyBrownFurFloppyEarsLongTeethImage from '../../../../images/bunny-brownFur-floppyEars-longTeeth_png.js';
import bunnyBrownFurFloppyEarsShortTeethImage from '../../../../images/bunny-brownFur-floppyEars-shortTeeth_png.js';
import bunnyBrownFurStraightEarsLongTeethImage from '../../../../images/bunny-brownFur-straightEars-longTeeth_png.js';
import bunnyBrownFurStraightEarsShortTeethImage from '../../../../images/bunny-brownFur-straightEars-shortTeeth_png.js';
import bunnyWhiteFurFloppyEarsLongTeethImage from '../../../../images/bunny-whiteFur-floppyEars-longTeeth_png.js';
import bunnyWhiteFurFloppyEarsShortTeethImage from '../../../../images/bunny-whiteFur-floppyEars-shortTeeth_png.js';
import bunnyWhiteFurStraightEarsLongTeethImage from '../../../../images/bunny-whiteFur-straightEars-longTeeth_png.js';
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import shrubTenderAImage from '../../../../images/shrub-tender-A_png.js';
import shrubTenderBImage from '../../../../images/shrub-tender-B_png.js';
import shrubTenderCImage from '../../../../images/shrub-tender-C_png.js';
import shrubToughAImage from '../../../../images/shrub-tough-A_png.js';
import shrubToughBImage from '../../../../images/shrub-tough-B_png.js';
import shrubToughCImage from '../../../../images/shrub-tough-C_png.js';
import wolfImage from '../../../../images/wolf_png.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import BunnyCollection from '../../model/BunnyCollection.js';
import Food from '../../model/Food.js';
import WolfCollection from '../../model/WolfCollection.js';
import BunnySpriteImage from './BunnySpriteImage.js';
import BunnySpriteInstance from './BunnySpriteInstance.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';
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

    // Sprites for each possible bunny phenotype. The cache is a map, which maps phenotype key to an Image
    // instance. The phenotype key pattern is '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}', where the value
    // for each placeholder is 'true' or 'false'. See getBunnySprite for how the key is assembled.
    const bunnySpritesMap = {
      'true-true-true': new Sprite( new BunnySpriteImage( bunnyWhiteFurStraightEarsShortTeethImage ) ),
      'true-true-false': new Sprite( new BunnySpriteImage( bunnyWhiteFurStraightEarsLongTeethImage ) ),
      'true-false-true': new Sprite( new BunnySpriteImage( bunnyWhiteFurFloppyEarsShortTeethImage ) ),
      'true-false-false': new Sprite( new BunnySpriteImage( bunnyWhiteFurFloppyEarsLongTeethImage ) ),
      'false-true-true': new Sprite( new BunnySpriteImage( bunnyBrownFurStraightEarsShortTeethImage ) ),
      'false-true-false': new Sprite( new BunnySpriteImage( bunnyBrownFurStraightEarsLongTeethImage ) ),
      'false-false-true': new Sprite( new BunnySpriteImage( bunnyBrownFurFloppyEarsShortTeethImage ) ),
      'false-false-false': new Sprite( new BunnySpriteImage( bunnyBrownFurFloppyEarsLongTeethImage ) )
    };

    // The sprite that is used for all wolves.
    const wolfSprite = new Sprite( new OrganismSpriteImage( wolfImage ) );

    // Sprites for all categories of shrubs.
    // The key is Shrub.category, as specified in https://github.com/phetsims/natural-selection/issues/17
    const shrubSpritesMap = {
      'A': {
        tenderSprite: new Sprite( new OrganismSpriteImage( shrubTenderAImage ) ),
        toughSprite: new Sprite( new OrganismSpriteImage( shrubToughAImage ) )
      },
      'B': {
        tenderSprite: new Sprite( new OrganismSpriteImage( shrubTenderBImage ) ),
        toughSprite: new Sprite( new OrganismSpriteImage( shrubToughBImage ) )
      },
      'C': {
        tenderSprite: new Sprite( new OrganismSpriteImage( shrubTenderCImage ) ),
        toughSprite: new Sprite( new OrganismSpriteImage( shrubToughCImage ) )
      }
    };

    // {Sprite[]} sprites for all organisms
    const sprites = [];
    for ( const property in bunnySpritesMap ) {
      sprites.push( bunnySpritesMap[ property ] );
    }
    sprites.push( wolfSprite );
    for ( const property in shrubSpritesMap ) {
      sprites.push( shrubSpritesMap[ property ].tenderSprite );
      sprites.push( shrubSpritesMap[ property ].toughSprite );
    }

    // {ShrubSpriteInstance[]} sprite instances for shrubs
    const shrubSpriteInstances = _.map( food.shrubs, shrub =>
      new ShrubSpriteInstance( shrub, food.isToughProperty.value,
        shrubSpritesMap[ shrub.category ].tenderSprite, shrubSpritesMap[ shrub.category ].toughSprite )
    );

    // {SpriteInstances[]} sprite instances for all organisms
    const spriteInstances = [ ...shrubSpriteInstances ];

    super( {
      sprites: sprites,
      spriteInstances: spriteInstances,
      canvasBounds: canvasBounds,
      hitTestSprites: true,
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
    this.bunnySpritesMap = bunnySpritesMap;
    this.spriteInstances = spriteInstances;

    // Creates a sprite instance of a bunny
    const createBunnySpriteInstance = bunny => {

      // PhET-iO state will restore both live and dead bunnies. Create SpriteInstances only for the live ones.
      if ( bunny.isAlive ) {

        // Create a SpriteInstance for the bunny.
        const bunnySpriteInstance = new BunnySpriteInstance( bunny, this.getBunnySprite( bunny ) );
        spriteInstances.push( bunnySpriteInstance );

        // If the bunny dies or is disposed, dispose of bunnySpriteInstance.
        const disposeBunnySpriteInstance = () => {
          bunny.diedEmitter.removeListener( disposeBunnySpriteInstance );
          bunny.disposedEmitter.removeListener( disposeBunnySpriteInstance );
          spriteInstances.splice( spriteInstances.indexOf( bunnySpriteInstance ), 1 );
          bunnySpriteInstance.dispose();
        };
        bunny.diedEmitter.addListener( disposeBunnySpriteInstance );
        bunny.disposedEmitter.addListener( disposeBunnySpriteInstance );
      }
    };

    // Create a BunnyNode for each Bunny in the initial population.
    bunnyCollection.liveBunnies.forEach( createBunnySpriteInstance );

    // When a bunny is created... removeListener is not necessary.
    bunnyCollection.bunnyCreatedEmitter.addListener( createBunnySpriteInstance );

    // When a wolf is created... removeListener is not necessary.
    wolfCollection.wolfCreatedEmitter.addListener( wolf => {

      // Create a SpriteInstance for the wolf.
      const wolfSpriteInstance = new WolfSpriteInstance( wolf, wolfSprite );
      spriteInstances.push( wolfSpriteInstance );

      // When the wolf is disposed, remove wolfSpriteInstance.
      // removeListener is not necessary, because wolf.disposeEmitter is disposed.
      wolf.disposedEmitter.addListener( () => {
        spriteInstances.splice( spriteInstances.indexOf( wolfSpriteInstance ), 1 );
      } );
    } );

    // Change sprites for shrubs depending on whether food is tough or tender. unlink is not necessary.
    food.isToughProperty.link( isTough => {
      shrubSpriteInstances.forEach( shrubSpriteInstance => {
        shrubSpriteInstance.setTough( isTough );
      } );
      this.invalidatePaint();
    } );

    // Hide half of the shrubs (hide odd-indexed Shrubs) when food is limited. unlink is not necessary.
    food.isLimitedProperty.link( isLimited => {

      // Start by removing all shrubs
      shrubSpriteInstances.forEach( shrubSpriteInstance => {
        const index = spriteInstances.indexOf( shrubSpriteInstance );
        if ( index !== -1 ) {
          spriteInstances.splice( index, 1 );
        }
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
    this.sort();

    //TODO #128 move selected bunny and selection rectangle to front

    // Repaint.
    this.invalidatePaint();
  }

  //TODO #128 if sort is a performance issue, then sort when each organism moves if its z changed
  /**
   * Sorts sprite instances by z coordinate of their associated organism, from back to front.
   * +z is away from the camera. Sorts in place, because super has a reference to this.spriteInstances.
   * @private
   */
  sort() {
    this.spriteInstances.sort( ( spriteInstance1, spriteInstance2 ) => {
      const z1 = spriteInstance1.organism.positionProperty.value.z;
      const z2 = spriteInstance2.organism.positionProperty.value.z;
      return Math.sign( z2 - z1 );
    } );
  }

  /**
   * Gets the Sprite that matches a bunny's phenotype. Instead of a big if-then-else statement for each permutation
   * of gene type, this implementation converts the phenotype to a string key, and maps that key to a Sprite.
   * @param {Bunny} bunny
   * @returns {Sprite}
   * @private
   */
  getBunnySprite( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    // create the key by inspecting the phenotype
    const key = `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;

    // look up the image in the map
    const sprite = this.bunnySpritesMap[ key ];
    assert && assert( sprite, `no sprite found for key ${key}` );

    return sprite;
  }
}

naturalSelection.register( 'OrganismSprites', OrganismSprites );
export default OrganismSprites;