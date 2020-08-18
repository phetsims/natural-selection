// Copyright 2020, University of Colorado Boulder

/**
 * OrganismSprites displays all of the Organism model elements (bunnies, wolves, shrubs) that appear in the environment.
 * It uses scenery's high-performance Sprites feature, which uses renderer:'webgl', with a fallback of 'canvas'.
 *
 * While each sprite instance stays synchronized with its associated model element, update() must be explicitly
 * called to render this Node correctly. Internally, call update() for changes that affect the rendering order;
 * otherwise call invalidatePaint().
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
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import wolfImage from '../../../../images/wolf_png.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import BunnyCollection from '../../model/BunnyCollection.js';
import Food from '../../model/Food.js';
import Wolf from '../../model/Wolf.js';
import WolfCollection from '../../model/WolfCollection.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import BunnySpritesMap from '../BunnySpritesMap.js';
import BunnySelectionRectangleSprite from './BunnySelectionRectangleSprite.js';
import BunnySelectionRectangleSpriteInstance from './BunnySelectionRectangleSpriteInstance.js';
import BunnySpriteInstance from './BunnySpriteInstance.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';
import ShrubSpriteInstance from './ShrubSpriteInstance.js';
import ShrubSpritesMap from './ShrubSpritesMap.js';
import WolfSpriteInstance from './WolfSpriteInstance.js';

class OrganismSprites extends Sprites {

  /**
   * @param {BunnyCollection} bunnyCollection
   * @param {WolfCollection} wolfCollection
   * @param {Food} food
   * @param {Property.<boolean>} isPlayingProperty
   * @param {BunnySpritesMap} bunnySpritesMap - Sprites for all bunny phenotypes
   * @param {Bounds2} canvasBounds
   * @param {Object} [options]
   */
  constructor( bunnyCollection, wolfCollection, food, isPlayingProperty, bunnySpritesMap, canvasBounds, options ) {

    assert && assert( bunnyCollection instanceof BunnyCollection, 'invalid bunnyCollection' );
    assert && assert( wolfCollection instanceof WolfCollection, 'invalid wolfCollection' );
    assert && assert( food instanceof Food, 'invalid food' );
    assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );
    assert && assert( bunnySpritesMap instanceof BunnySpritesMap, 'invalid bunnySpritesMap' );
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

    assert && assert( !options.canvasBounds, 'OrganismSprites sets canvasBounds' );
    options.canvasBounds = canvasBounds;

    // Sprites for all categories of shrubs
    const shrubSpritesMap = new ShrubSpritesMap();

    // The sprite that is used for all wolves
    const wolfSprite = new Sprite( new OrganismSpriteImage( wolfImage ) );

    // Sprite for the bunny selection rectangle, sized to fit the largest bunny image
    const selectionRectangleSprite = new BunnySelectionRectangleSprite( bunnyWhiteFurStraightEarsShortTeethImage );

    // {OrganismSprite[]} the complete set of sprites
    assert && assert( !options.sprites, 'OrganismSprites sets sprites' );
    options.sprites = [ wolfSprite, selectionRectangleSprite ];
    options.sprites.push( ...bunnySpritesMap.getSprites() );
    options.sprites.push( ...shrubSpritesMap.getSprites() );

    // {ShrubSpriteInstance[]} sprite instances for shrubs
    const shrubSpriteInstances = _.map( food.shrubs, shrub =>
      new ShrubSpriteInstance( shrub, food.isToughProperty.value,
        shrubSpritesMap.getNextTenderSprite(), shrubSpritesMap.getNextToughSprite() )
    );

    // {SpriteInstances[]} all sprite instances to be rendered, must be modified in place because super has a reference
    assert && assert( !options.spriteInstances, 'OrganismSprites sets spriteInstances' );
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
    bunnyCollection.liveBunnies.addItemAddedListener( bunny => this.createBunnySpriteInstance( bunny ) );

    // Create a sprite instance for each wolf that is created. removeListener is not necessary.
    wolfCollection.wolfCreatedEmitter.addListener( wolf => this.createWolfSpriteInstance( wolf, wolfSprite ) );

    // Show sprites for tender vs tough food. unlink is not necessary.
    food.isToughProperty.link( isTough => this.setToughFood( isTough ) );

    // Show sprites for limited vs plentiful food. unlink is not necessary.
    food.isLimitedProperty.link( isLimited => this.setLimitedFood( isLimited ) );

    // Put a selection rectangle around the selected bunny. unlink is not necessary.
    bunnyCollection.selectedBunnyProperty.link( bunny => this.setSelectedBunny( bunny ) );

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
   * Puts the sprite instances in the correct order (back-to-front), and then repaints.
   * If your change does not involve z position (rendering order), skip sort by calling invalidatePaint directly.
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
    assert && assert( bunny.isAlive, 'expected a live bunny' );

    // Create a SpriteInstance for the bunny.
    const bunnySpriteInstance = new BunnySpriteInstance( bunny, this.bunnySpritesMap.getSprite( bunny ) );
    this.spriteInstances.push( bunnySpriteInstance );
    if ( !this.isPlayingProperty.value ) {
      this.update();
    }

    // If the bunny dies or is disposed...
    const bunnyDiedOrDisposedListener = () => {

      // If this was the selected bunny, clear the selection.
      if ( this.bunnyCollection.selectedBunnyProperty.value === bunny ) {
        this.clearSelectedBunny();
      }

      // Dispose of the associated sprite instance
      const bunnySpriteInstanceIndex = this.spriteInstances.indexOf( bunnySpriteInstance );
      assert && assert( bunnySpriteInstanceIndex !== -1, 'bunnySpriteInstance missing from spriteInstances' );
      this.spriteInstances.splice( bunnySpriteInstanceIndex, 1 );
      if ( !this.isPlayingProperty.value ) {
        this.invalidatePaint();
      }
      bunnySpriteInstance.dispose();

      // Remove this listener
      bunny.diedEmitter.removeListener( bunnyDiedOrDisposedListener );
      bunny.disposedEmitter.removeListener( bunnyDiedOrDisposedListener );
    };
    bunny.diedEmitter.addListener( bunnyDiedOrDisposedListener ); // removeListener is performed by callback
    bunny.disposedEmitter.addListener( bunnyDiedOrDisposedListener ); // removeListener is performed by callback

    // PhET-iO state engine may restore bunnyCollection.selectedBunnyProperty before firing
    // bunnyCollection.liveBunnies.addItemAddedListener, the callback that creates BunnySpriteInstances.
    // If that happens, then createBunnySpriteInstance is responsible for calling setSelectedBunny.
    // See https://github.com/phetsims/natural-selection/issues/138
    if ( phet.joist.sim.isSettingPhetioStateProperty.value && this.bunnyCollection.selectedBunnyProperty.value === bunny  ) {
      this.setSelectedBunny( bunny );
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
    if ( !this.isPlayingProperty.value ) {
      this.update();
    }

    // When the wolf is disposed...
    const wolfDisposedListener = () => {

      // Dispose of the associated sprite instance
      const wolfSpriteInstanceIndex = this.spriteInstances.indexOf( wolfSpriteInstance );
      assert && assert( wolfSpriteInstanceIndex !== -1, 'wolfSpriteInstanceIndex missing from spriteInstances' );
      this.spriteInstances.splice( wolfSpriteInstanceIndex, 1 );
      if ( !this.isPlayingProperty.value ) {
        this.invalidatePaint();
      }
      wolfSpriteInstance.dispose();

      // Remove this listener
      wolf.disposedEmitter.removeListener( wolfDisposedListener );
    };
    wolf.disposedEmitter.addListener( wolfDisposedListener ); // removeListener is performed by callback
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

      // Food is limited, show some of the shrubs.
      for ( let i = 0; i < NaturalSelectionQueryParameters.shrubsRange.min; i++ ) {
        this.spriteInstances.push( this.shrubSpriteInstances[ i ] );
      }
    }
    else {

      // Food is abundant, show all shrubs.
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

    // This view only displays live bunnies, and selectedBunnyProperty may contain a dead bunny, for display in the
    // Pedigree graph.  So only if there's a live bunny selected...
    if ( bunny && bunny.isAlive ) {

      // Get the BunnySpriteInstance that is associated with the selected bunny.
      const selectedBunnyIndex = this.getBunnySpriteInstanceIndex( bunny );

      if ( phet.joist.sim.isSettingPhetioStateProperty.value && selectedBunnyIndex === -1 ) {

        // PhET-iO state engine may restore bunnyCollection.selectedBunnyProperty before firing
        // bunnyCollection.liveBunnies.addItemAddedListener, the callback that creates BunnySpriteInstances.
        // If that happens, then rely on createBunnySpriteInstance to call setSelectedBunny.
        // See https://github.com/phetsims/natural-selection/issues/138
      }
      else {

        assert && assert( selectedBunnyIndex !== -1, 'sprite instance not found for selected bunny' );
        this.selectedBunnySpriteInstance = this.spriteInstances[ selectedBunnyIndex ];
        assert && assert( this.selectedBunnySpriteInstance instanceof BunnySpriteInstance, 'invalid selectedBunnySpriteInstance' );

        // Create the selection rectangle and put it immediately behind the selected bunny.
        this.selectionRectangleSpriteInstance = new BunnySelectionRectangleSpriteInstance( bunny, this.selectionRectangleSprite );
        this.spriteInstances.splice( selectedBunnyIndex, 0, this.selectionRectangleSpriteInstance );
        if ( !this.isPlayingProperty.value ) {
          this.update();
        }
      }
    }
  }

  /**
   * Gets the index of the BunnySpriteInstance that is associated with a specific bunny.
   * @param {Bunny} bunny
   * @returns {number} -1 if not found
   * @private
   */
  getBunnySpriteInstanceIndex( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    // Performance: For a maximum population, this brute-force approach takes < 1ms on a 2019 MacBook Pro.
    let selectedBunnyIndex = -1;
    for ( let i = 0; i < this.spriteInstances.length && selectedBunnyIndex ===  -1; i++ ) {
      const spriteInstance = this.spriteInstances[ i ];
      if ( spriteInstance instanceof BunnySpriteInstance && spriteInstance.organism === bunny ) {
        selectedBunnyIndex = i;
      }
    }
    return selectedBunnyIndex;
  }

  /**
   * Clears the sprites for the bunny selection, if there is one.
   * @private
   */
  clearSelectedBunny() {

    if ( this.selectedBunnySpriteInstance ) {

      // clear the selected bunny
      this.selectedBunnySpriteInstance = null;

      // clear the selection rectangle
      assert && assert( this.selectionRectangleSpriteInstance, 'expected selectionRectangleSpriteInstance to be set' );
      const selectionRectangleIndex = this.spriteInstances.indexOf( this.selectionRectangleSpriteInstance );
      assert && assert( selectionRectangleIndex !== -1, 'selectionRectangleSpriteInstance is missing from spriteInstances' );
      this.spriteInstances.splice( selectionRectangleIndex, 1 );
      if ( !this.isPlayingProperty.value ) {
        this.invalidatePaint();
      }
      this.selectionRectangleSpriteInstance.dispose();
      this.selectionRectangleSpriteInstance = null;
    }

    assert && assert( this.selectedBunnySpriteInstance === null, 'selectedBunnySpriteInstance should be null' );
    assert && assert( this.selectionRectangleSpriteInstance === null, 'selectionRectangleSpriteInstance should be null' );
  }

  /**
   * Sorts the sprite instances in back-to-front rendering order. Instances are first sorted by z coordinate of their
   * associated organism, from back to front, where +z is away from the camera. If there is a selected bunny and
   * the sim is paused, the bunny and its selection rectangle are moved to the front.
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

    // If a selected bunny is visible and the sim is paused, move the bunny and selection rectangle to the front.
    if ( this.selectedBunnySpriteInstance && !this.isPlayingProperty.value ) {
      assert && assert( this.bunnyCollection.selectedBunnyProperty.value,
        'selectedBunnySpriteInstance should not exist when there is no selected bunny' );
      assert && assert( this.selectionRectangleSpriteInstance, 'expected selectionRectangleSpriteInstance to be set' );

      // Remove the selected bunny
      const selectedBunnyIndex = this.spriteInstances.indexOf( this.selectedBunnySpriteInstance );
      assert && assert( selectedBunnyIndex !== -1, 'selectedBunnySpriteInstance missing from spriteInstances' );
      this.spriteInstances.splice( selectedBunnyIndex, 1 );

      // Remove the selection rectangle
      const selectionRectangleIndex = this.spriteInstances.indexOf( this.selectionRectangleSpriteInstance );
      assert && assert( selectionRectangleIndex !== -1, 'selectionRectangleSpriteInstance missing from spriteInstances' );
      this.spriteInstances.splice( selectionRectangleIndex, 1 );

      // Append the selected bunny and the selection rectangle to the front.
      this.spriteInstances.push( this.selectionRectangleSpriteInstance ); // rectangle behind bunny
      this.spriteInstances.push( this.selectedBunnySpriteInstance );

      this.invalidatePaint();
    }
  }
}

naturalSelection.register( 'OrganismSprites', OrganismSprites );
export default OrganismSprites;