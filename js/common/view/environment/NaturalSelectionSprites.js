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
    // of the shrub. Keys are described at Shrub.CATEGORIES.
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

    // {OrganismSprite[]} the complete unique set of sprites
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
    this.wolfCollection = wolfCollection;
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

    // Put a selection rectangle around the selected bunny. unlink is not necessary.
    bunnyCollection.selectedBunnyProperty.link( bunny => this.setSelectedBunny( bunny ) );

    // @private
    this.clearSelectedBunnyBound = this.clearSelectedBunny.bind( this );

    // PressListener for selecting a bunny. Mix in SpriteListenable, so we have access to the pressed SpriteInstance.
    // removeInputListener is not necessary.
    this.addInputListener( new ( SpriteListenable( PressListener ) )( {

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
   * Puts the sprite instances in the correct order (back-to-front), and then repaints. While each sprite instance
   * stays synchronized with its associated model element, update() must be explicitly called to render this Node
   * correctly.
   * @public
   */
  update() {

    // Sort sprite instances in back-to-front rendering order.
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
      assert && this.assertBunniesCount();

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
    assert && this.assertWolvesCount();

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

    // There was no change to spriteInstances, so no need to call update, invalidatePaint suffices.
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

    this.update();
  }

  /**
   * Configures a sprite instance and the selection rectangle to correspond to a selected bunny.
   * @param {Bunny|null} bunny
   * @private
   */
  setSelectedBunny( bunny ) {

    assert && assert( bunny instanceof Bunny || bunny === null, 'invalid bunny' );

    // Clear any previous selection.
    this.clearSelectedBunny();

    // If there's a live bunny selected...
    if ( bunny && bunny.isAlive ) {

      // Find the sprite instance that is associated with the selected bunny.
      // Performance: For a maximum population, this brute-force approach takes < 1ms on a 2019 MacBook Pro.
      let selectedBunnyIndex = -1;
      for ( let i = 0; i < this.spriteInstances.length && selectedBunnyIndex ===  -1; i++ ) {
        if ( this.spriteInstances[ i ].organism === bunny ) {
          selectedBunnyIndex = i;
        }
      }
      assert && assert( selectedBunnyIndex !== -1, 'sprite instance not found for selected bunny' );
      this.selectedBunnySpriteInstance = this.spriteInstances[ selectedBunnyIndex ];

      // Create the selection rectangle and put it immediately behind the selected bunny.
      this.selectionRectangleSpriteInstance = new BunnySelectionRectangleSpriteInstance( bunny, this.selectionRectangleSprite );
      this.spriteInstances.splice( selectedBunnyIndex, 0, this.selectionRectangleSpriteInstance );

      // Clear the selection if the selected bunny dies.
      bunny.diedEmitter.addListener( this.clearSelectedBunnyBound );

      assert && this.assertBunniesCount();
    }

    this.update();
  }

  /**
   * Clears the sprites for the bunny selection, if there is one.
   * @private
   */
  clearSelectedBunny() {

    if ( this.selectedBunnySpriteInstance ) {
      assert && assert( this.selectionRectangleSpriteInstance, 'expected selectionRectangleSpriteInstance to be set' );

      // clear the selected bunny
      const bunny = this.selectedBunnySpriteInstance.organism;
      if ( bunny.diedEmitter.hasListener( this.clearSelectedBunnyBound ) ) {
        bunny.diedEmitter.removeListener( this.clearSelectedBunnyBound );
      }
      this.selectedBunnySpriteInstance = null;

      // clear the selection rectangle
      const selectionRectangleIndex = this.spriteInstances.indexOf( this.selectionRectangleSpriteInstance );
      assert && assert( selectionRectangleIndex !== -1, 'expected selectionRectangleSpriteInstance in spriteInstances' );
      this.spriteInstances.splice( selectionRectangleIndex, 1 );
      this.selectionRectangleSpriteInstance.dispose();
      this.selectionRectangleSpriteInstance = null;
    }
  }

  /**
   * Sorts the sprite instances in back-to-front rendering order. Instances are first sorted by z coordinate of their
   * associated organism, from back to front, where +z is away from the camera. If there is a selected bunny,
   * then the bunny and its selection rectangle are adjusted, depending on whether the sim is playing or paused.
   * @private
   */
  sort() {

    // Sort by descending z coordinate. Sorting is done in place, because super has a reference to this.spriteInstances.
    // Performance: For a maximum population, this takes < 1ms on a 2019 MacBook Pro.
    this.spriteInstances.sort( ( spriteInstance1, spriteInstance2 ) => {
      const z1 = spriteInstance1.organism.positionProperty.value.z;
      const z2 = spriteInstance2.organism.positionProperty.value.z;
      return Math.sign( z2 - z1 );
    } );

    // If a selected bunny is visible and the sim is paused...
    if ( this.selectedBunnySpriteInstance && !this.isPlayingProperty.value ) {
      assert && assert( this.selectedBunnySpriteInstance, 'expected selectedBunnySpriteInstance to be set' );
      assert && assert( this.selectionRectangleSpriteInstance, 'expected selectionRectangleSpriteInstance to be set' );

      // Get the indices of the selection rectangle and selected bunny
      const selectionRectangleIndex = this.spriteInstances.indexOf( this.selectionRectangleSpriteInstance );
      assert && assert( selectionRectangleIndex !== -1, 'expected selectionRectangleSpriteInstance to be in spriteInstances' );
      const selectedBunnyIndex = this.spriteInstances.indexOf( this.selectedBunnySpriteInstance );
      assert && assert( selectedBunnyIndex !== -1, 'expected selectedBunnySpriteInstance to be in spriteInstances' );

      // Move the selected bunny and the selection rectangle to the front.
      this.spriteInstances.splice( selectionRectangleIndex, 1 );
      this.spriteInstances.splice( selectedBunnyIndex, 1 );
      this.spriteInstances.push( this.selectionRectangleSpriteInstance ); // rectangle behind bunny
      this.spriteInstances.push( this.selectedBunnySpriteInstance );
      assert && this.assertBunniesCount();
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

  /**
   * Asserts that the number of sprite instances for bunnies matches the number of live bunnies in the model.
   * @private
   */
  assertBunniesCount() {
    const numberOfSprites = _.filter( this.spriteInstances, spriteInstance => spriteInstance instanceof BunnySpriteInstance ).length;
    const numberOfBunnies = this.bunnyCollection.liveBunnies.lengthProperty.value;
    assert && assert( numberOfSprites === numberOfBunnies,
      `number of bunny sprites ${numberOfSprites} is out of sync with number of bunnies ${numberOfBunnies}` );
  }

  /**
   * Asserts that the number of sprite instances for wolves matches the number of wolves in the model.
   * @private
   */
  assertWolvesCount() {
    const numberOfSprites = _.filter( this.spriteInstances, spriteInstance => spriteInstance instanceof WolfSpriteInstance ).length;
    const numberOfWolves = this.wolfCollection.count;
    assert && assert( numberOfSprites === numberOfWolves,
      `number of wolf sprites ${numberOfSprites} is out of sync with number of wolves ${numberOfWolves}` );
  }
}

naturalSelection.register( 'NaturalSelectionSprites', NaturalSelectionSprites );
export default NaturalSelectionSprites;