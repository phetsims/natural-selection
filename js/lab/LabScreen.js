// Copyright 2019-2020, University of Colorado Boulder

/**
 * LabScreen is the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const LabModel = require( 'NATURAL_SELECTION/lab/model/LabModel' );
  const LabScreenView = require( 'NATURAL_SELECTION/lab/view/LabScreenView' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const ScreenIcon = require( 'JOIST/ScreenIcon' );
  const Tandem = require( 'TANDEM/Tandem' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const brownBunnyImage1 = require( 'image!NATURAL_SELECTION/bunny-brownFur-straightEars-shortTeeth.png' );
  const brownBunnyImage2 = require( 'image!NATURAL_SELECTION/bunny-brownFur-floppyEars-shortTeeth.png' );
  const brownBunnyImage3 = require( 'image!NATURAL_SELECTION/bunny-brownFur-straightEars-longTeeth.png' );
  const brownBunnyImage4 = require( 'image!NATURAL_SELECTION/bunny-brownFur-floppyEars-longTeeth.png' );
  const whiteBunnyImage1 = require( 'image!NATURAL_SELECTION/bunny-whiteFur-straightEars-shortTeeth.png' );
  const whiteBunnyImage2 = require( 'image!NATURAL_SELECTION/bunny-whiteFur-floppyEars-shortTeeth.png' );
  const whiteBunnyImage3 = require( 'image!NATURAL_SELECTION/bunny-whiteFur-straightEars-longTeeth.png' );
  const whiteBunnyImage4 = require( 'image!NATURAL_SELECTION/bunny-whiteFur-floppyEars-longTeeth.png' );

  // strings
  const screenLabString = require( 'string!NATURAL_SELECTION/screen.lab' );

  class LabScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      const options = {
        name: screenLabString,
        backgroundColorProperty: new Property( NaturalSelectionColors.SCREEN_VIEW_BACKGROUND ),
        homeScreenIcon: createScreenIcon(),
        tandem: tandem
      };

      super(
        () => new LabModel( tandem.createTandem( 'model' ) ),
        model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'LabScreen does not support dispose' );
    }
  }

  /**
   * Creates the icon for this screen.
   * @returns {ScreenIcon}
   */
  function createScreenIcon() {

    const SPACING = 20;

    return new ScreenIcon( new VBox( {
      spacing: SPACING,
      children: [
        
        // row 1
        new HBox( {
          spacing: SPACING,
          children: [
            new Image( brownBunnyImage1 ), new Image( whiteBunnyImage1 ),
            new Image( brownBunnyImage2 ), new Image( whiteBunnyImage2 )
          ]
        } ),

        // row 2
        new HBox( {
          spacing: SPACING,
          children: [
            new Image( whiteBunnyImage3 ), new Image( brownBunnyImage3 ),
            new Image( whiteBunnyImage4 ), new Image( brownBunnyImage4 )
          ]
        } )
      ]
    } ), {
      fill: NaturalSelectionColors.SCREEN_VIEW_BACKGROUND
    } );
  }

  return naturalSelection.register( 'LabScreen', LabScreen );
} );