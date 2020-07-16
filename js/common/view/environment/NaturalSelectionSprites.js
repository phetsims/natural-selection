// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionSprites renders all sprites that appear in the environment. It uses scenery's high-performance
 * Sprites feature, which uses renderer:'webgl', with a fallback of 'canvas'. While each sprite instance stays
 * synchronized with its associated model element, update() must be explicitly called to render this Node correctly.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
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
import Shrub from '../../model/Shrub.js';
import Wolf from '../../model/Wolf.js';
import WolfCollection from '../../model/WolfCollection.js';
import BunnySelectionRectangleSprite from './BunnySelectionRectangleSprite.js';
import BunnySelectionRectangleSpriteInstance from './BunnySelectionRectangleSpriteInstance.js';
import BunnySpriteImage from './BunnySpriteImage.js';
import BunnySpriteInstance from './BunnySpriteInstance.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';
import ShrubSpriteInstance from './ShrubSpriteInstance.js';
import WolfSpriteInstance from './WolfSpriteInstance.js';

class NaturalSelectionSprites extends Sprites {

  /**
   * @param {BunnyCollection} bunnyCollection
   * @param {WolfCollection} wolfCollection
   * @param {Food} food
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Bounds2} canvasBounds
   * @param {Object} [options]
   */
  constructor( bunnyCollection, wolfCollection, food, isPlayingProperty, canvasBounds, options ) {

    assert && assert( bunnyCollection instanceof BunnyCollection, 'invalid bunnyCollection' );
    assert && assert( wolfCollection instanceof WolfCollection, 'invalid wolfCollection' );
    assert && assert( food instanceof Food, 'invalid food' );
    assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );
    assert && assert( canvasBounds instanceof Bounds2, 'invalid canvasBounds' );

    options = merge( {

      // Sprites options
      hitTestSprites: true,
      cursor: 'pointer',

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true,
      phetioDocumentation: 'bunnies, wolves, and shrubs that appear in the environment'
    }, options );

    assert && assert( !options.canvasBounds, 'NaturalSelectionSprites sets canvasBounds' );
    options.canvasBounds = canvasBounds;

    // Sprites for each possible bunny phenotype. Maps a phenotype key to an Image instance. The phenotype key pattern
    // is '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}', where the value for each placeholder is 'true' or
    // 'false'. See getBunnySprite for how the key is assembled.
    const bunnySpritesMap = {

      // key: value
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

    // Sprites for all categories of shrubs. Maps a shrub category to a pair of sprites, for tough and tender versions
    // of the shrub. Keys are from Shrub.CATEGORIES.
    const shrubSpritesMap = {

      // key: value
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
    assert && assert( _.every( _.keys( shrubSpritesMap ), key => Shrub.CATEGORIES.includes( key ) ),
      'invalid key in shrubSpritesMap' );

    // Sprite for the bunny selection rectangle, sized to fit the largest bunny image.
    const selectionRectangleSprite = new BunnySelectionRectangleSprite( bunnyWhiteFurStraightEarsShortTeethImage );

    // {Sprite[]} the complete unique set of sprites
    assert && assert( !options.sprites, 'NaturalSelectionSprites sets sprites' );
    options.sprites = [ wolfSprite, selectionRectangleSprite ];
    for ( const key in bunnySpritesMap ) {
      options.sprites.push( bunnySpritesMap[ key ] );
    }
    for ( const key in shrubSpritesMap ) {
      options.sprites.push( shrubSpritesMap[ key ].tenderSprite );
      options.sprites.push( shrubSpritesMap[ key ].toughSprite );
    }

    // {ShrubSpriteInstance[]} sprite instances for shrubs
    const shrubSpriteInstances = _.map( food.shrubs, shrub =>
      new ShrubSpriteInstance( shrub, food.isToughProperty.value,
        shrubSpritesMap[ shrub.category ].tenderSprite, shrubSpritesMap[ shrub.category ].toughSprite )
    );

    // {SpriteInstances[]} all sprite instances to be rendered, must be modified in place because super has a reference
    assert && assert( !options.spriteInstances, 'NaturalSelectionSprites sets spriteInstances' );
    options.spriteInstances = [ ...shrubSpriteInstances ];

    super( options );

    // @private {BunnySpriteInstance|null} reference to the sprite instance for the selected bunny, null if no selection
    this.selectedBunnySpriteInstance = null;

    // @private {BunnySelectionRectangleSpriteInstance|null} the selection rectangle, recreated for each selected bunny
    this.selectionRectangleSpriteInstance = null;

    // @private references to constructor arguments and local variables needed by methods
    this.bunnyCollection = bunnyCollection;
    this.isPlayingProperty = isPlayingProperty;
    this.bunnySpritesMap = bunnySpritesMap;
    this.selectionRectangleSprite = selectionRectangleSprite;
    this.shrubSpriteInstances = shrubSpriteInstances;
    this.spriteInstances = options.spriteInstances;

    // Create a sprite instance for each bunny in the initial population.
    bunnyCollection.liveBunnies.forEach( bunny => this.createBunnySpriteInstance( bunny ) );

    // Create a sprite instance for each bunny this is created. removeListener is not necessary.
    bunnyCollection.bunnyCreatedEmitter.addListener( bunny => this.createBunnySpriteInstance( bunny ) );

    // Create a sprite instance for each wolf that is created. removeListener is not necessary.
    wolfCollection.wolfCreatedEmitter.addListener( wolf => this.createWolfSpriteInstance( wolf, wolfSprite ) );

    // Show sprites for tender vs tough food. unlink is not necessary.
    food.isToughProperty.link( isTough => this.setToughFood( isTough ) );

    // Show sprites for limited vs plentiful food. unlink is not necessary.
    food.isLimitedProperty.link( isLimited => this.setLimitedFood( isLimited ) );

    // Put a selection rectangle around the selected bunny.
    bunnyCollection.selectedBunnyProperty.link( selectedBunny => this.setSelectedBunny( selectedBunny ) );

    // PressListener for selecting a bunny. Mix in SpriteListenable, so we have access to the pressed SpriteInstance.
    this.addInputListener( new ( SpriteListenable( PressListener ) )( {

      // Select a bunny. This is called only when we click on a SpriteInstance that has a pickable SpriteImage.
      press: ( event, listener ) => {
        assert && assert( listener.spriteInstance, 'expected a sprite instance' );
        if ( listener.spriteInstance instanceof BunnySpriteInstance ) {
          this.bunnyCollection.selectedBunnyProperty.value = listener.spriteInstance.organism;
        }
      },

      tandem: options.tandem.createTandem( 'bunnyPressListener' )
    } ) );

    this.update();
  }

  /**
   * Updates the display to reflect the current state of the model. While each sprite instance stays synchronized with
   * its associated model element, update() must be explicitly called to render this Node correctly.
   * @public
   */
  update() {

    // Sort sprite instances in back-to-front rendering order.
    //TODO #128 if sort impacts performance, then sort as each organism changes z
    this.sort();

    // Repaint.
    this.invalidatePaint();
  }

  /**
   * Creates a sprite instance for a bunny, and the scaffolding to remove it when the bunny dies or is disposed.
   * @param {Bunny} bunny
   * @private
   */
  createBunnySpriteInstance( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    // PhET-iO state will restore both live and dead bunnies. Create SpriteInstances only for the live ones.
    if ( bunny.isAlive ) {

      // Create a SpriteInstance for the bunny.
      const bunnySpriteInstance = new BunnySpriteInstance( bunny, this.getBunnySprite( bunny ) );
      this.spriteInstances.push( bunnySpriteInstance );

      // If the bunny dies or is disposed, dispose of bunnySpriteInstance.
      const disposeBunnySpriteInstance = () => {
        bunny.diedEmitter.removeListener( disposeBunnySpriteInstance );
        bunny.disposedEmitter.removeListener( disposeBunnySpriteInstance );
        this.spriteInstances.splice( this.spriteInstances.indexOf( bunnySpriteInstance ), 1 );
        bunnySpriteInstance.dispose();
      };
      bunny.diedEmitter.addListener( disposeBunnySpriteInstance );
      bunny.disposedEmitter.addListener( disposeBunnySpriteInstance );
    }
  }

  /**
   * Creates a sprite instance for a bunny, and the scaffolding to remove it when the wolf is disposed.
   * @param {Wolf} wolf
   * @param {Sprite} wolfSprite
   * @private
   */
  createWolfSpriteInstance( wolf, wolfSprite ) {
    assert && assert( wolf instanceof Wolf, 'invalid wolf' );
    assert && assert( wolfSprite instanceof Sprite, 'invalid wolfSprite' );

    // Create a SpriteInstance for the wolf.
    const wolfSpriteInstance = new WolfSpriteInstance( wolf, wolfSprite );
    this.spriteInstances.push( wolfSpriteInstance );

    // When the wolf is disposed, remove wolfSpriteInstance.
    // removeListener is not necessary, because wolf.disposeEmitter is disposed.
    wolf.disposedEmitter.addListener( () => {
      this.spriteInstances.splice( this.spriteInstances.indexOf( wolfSpriteInstance ), 1 );
    } );
  }

  /**
   * Sets food to be tough or tender.
   * @param {boolean} isTough - true=tough, false=tender
   * @private
   */
  setToughFood( isTough ) {
    assert && assert( typeof isTough === 'boolean', 'invalid isTough' );

    this.shrubSpriteInstances.forEach( shrubSpriteInstance => {
      shrubSpriteInstance.setTough( isTough );
    } );

    // No change in sorting or bunny selection, so no need to call update, invalidatePaint suffices.
    this.invalidatePaint();
  }

  /**
   * Sets food to be limited or plentiful.
   * @param {boolean} isLimited - true=limited, false=plentiful
   * @private
   */
  setLimitedFood( isLimited ) {
    assert && assert( typeof isLimited === 'boolean', 'invalid isLimited' );

    // Start by removing all shrubs.
    this.shrubSpriteInstances.forEach( shrubSpriteInstance => {
      const index = this.spriteInstances.indexOf( shrubSpriteInstance );
      if ( index !== -1 ) {
        this.spriteInstances.splice( index, 1 );
      }
    } );

    if ( isLimited ) {

      // Food is limited, add every other shrub.
      for ( let i = 0; i < this.shrubSpriteInstances.length; i += 2 ) {
        this.spriteInstances.push( this.shrubSpriteInstances[ i ] );
      }
    }
    else {

      // Food is plentiful, add all shrubs.
      this.shrubSpriteInstances.forEach( shrubSpriteInstance => {
        this.spriteInstances.push( shrubSpriteInstance );
      } );
    }

    // No change in sorting or bunny selection, so no need to call update, invalidatePaint suffices.
    this.invalidatePaint();
  }

  /**
   * Configures a sprite instance and the selection rectangle to correspond to a selected bunny.
   * @param {Bunny|null} selectedBunny
   * @private
   */
  setSelectedBunny( selectedBunny ) {

    assert && assert( selectedBunny instanceof Bunny || selectedBunny === null, 'invalid bunny' );

    // Clear the reference to any previously-selected sprite instance.
    this.selectedBunnySpriteInstance = null;

    // Dispose of the selection rectangle.
    if ( this.selectionRectangleSpriteInstance ) {
      const selectionRectangleIndex = this.spriteInstances.indexOf( this.selectionRectangleSpriteInstance );
      assert && assert( selectionRectangleIndex !== -1, 'expected selectionRectangleSpriteInstance in spriteInstances' );
      this.spriteInstances.splice( selectionRectangleIndex, 1 );
      this.selectionRectangleSpriteInstance.dispose();
      this.selectionRectangleSpriteInstance = null;
    }

    if ( selectedBunny ) {

      // Find the sprite instance that is associated with the selected bunny.
      //TODO #128 performance?
      let selectedBunnySpriteInstance = null;
      for ( let i = 0; i < this.spriteInstances.length && !selectedBunnySpriteInstance; i++ ) {
        if ( this.spriteInstances[ i ].organism === selectedBunny ) {
          selectedBunnySpriteInstance = this.spriteInstances[ i ];
        }
      }
      assert && assert( selectedBunnySpriteInstance, 'sprite instance not found for selected bunny' );
      this.selectedBunnySpriteInstance = selectedBunnySpriteInstance;

      // Create the selection rectangle for the selected bunny.
      this.selectionRectangleSpriteInstance = new BunnySelectionRectangleSpriteInstance( selectedBunny, this.selectionRectangleSprite );
      this.spriteInstances.unshift( this.selectionRectangleSpriteInstance ); // prepend, so it's behind the selected bunny
    }

    // If the sim is paused, update.
    if ( !this.isPlayingProperty.value ) {
      this.update();
    }
  }

  /**
   * Sorts the sprite instances in back-to-front rendering order. Instances are first sorted by z coordinate of their
   * associated organism, from back to front, where +z is away from the camera. If there is a selected bunny,
   * then the bunny and its selection rectangle are adjusted, depending on whether the sim is playing or paused.
   * Sorting is done in place, because super has a reference to this.spriteInstances.
   * @private
   */
  sort() {

    // Sort by descending z coordinate.
    this.spriteInstances.sort( ( spriteInstance1, spriteInstance2 ) => {
      const z1 = spriteInstance1.organism.positionProperty.value.z;
      const z2 = spriteInstance2.organism.positionProperty.value.z;
      return Math.sign( z2 - z1 );
    } );

    // If a bunny is selected...
    if ( this.bunnyCollection.selectedBunnyProperty.value ) {
      assert && assert( this.selectedBunnySpriteInstance, 'expected selectedBunnySpriteInstance to be set' );
      assert && assert( this.selectionRectangleSpriteInstance, 'expected selectionRectangleSpriteInstance to be set' );

      // Gets the indices of the selected bunny and selection rectangle
      const selectedBunnyIndex  = this.spriteInstances.indexOf( this.selectedBunnySpriteInstance );
      assert && assert( selectedBunnyIndex !== -1, 'expected selectedBunnySpriteInstance to be in spriteInstances' );

      const selectionRectangleIndex  = this.spriteInstances.indexOf( this.selectionRectangleSpriteInstance );
      assert && assert( selectionRectangleIndex !== -1, 'expected selectionRectangleSpriteInstance to be in spriteInstances' );

      // When the sim is paused, move the selected bunny and the selection rectangle to the front.
      if ( !this.isPlayingProperty.value ) {
        this.spriteInstances.splice( selectionRectangleIndex, 1 );
        this.spriteInstances.splice( selectedBunnyIndex, 1 );
        this.spriteInstances.push( this.selectionRectangleSpriteInstance );
        this.spriteInstances.push( this.selectedBunnySpriteInstance );
      }
    }
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

    // Create the key by inspecting the phenotype.
    const key = `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;

    // Look up the image in the map.
    const sprite = this.bunnySpritesMap[ key ];
    assert && assert( sprite, `no sprite found for key ${key}` );

    return sprite;
  }
}

naturalSelection.register( 'NaturalSelectionSprites', NaturalSelectionSprites );
export default NaturalSelectionSprites;