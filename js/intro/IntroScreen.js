// Copyright 2019, University of Colorado Boulder

/**
 * IntroScreen is the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const IntroModel = require( 'NATURAL_SELECTION/intro/model/IntroModel' );
  const IntroScreenView = require( 'NATURAL_SELECTION/intro/view/IntroScreenView' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const ScreenIcon = require( 'JOIST/ScreenIcon' );

  // images
  const brownBunnyImage = require( 'image!NATURAL_SELECTION/bunny-brownFur-tallEars-shortTeeth.png' );
  const whiteBunnyImage = require( 'image!NATURAL_SELECTION/bunny-whiteFur-tallEars-shortTeeth.png' );

  // strings
  const screenIntroString = require( 'string!NATURAL_SELECTION/screen.intro' );

  class IntroScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenIntroString,
        backgroundColorProperty: new Property( NaturalSelectionColors.SCREEN_VIEW_BACKGROUND ),
        homeScreenIcon: createScreenIcon(),
        tandem: tandem
      };

      super(
        () => new IntroModel( tandem.createTandem( 'model' ) ),
        model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  /**
   * Creates the icon for this screen.
   * @returns {ScreenIcon}
   */
  function createScreenIcon() {
    return new ScreenIcon( new HBox( {
      spacing: 20,
      children: [ new Image( brownBunnyImage ), new Image( whiteBunnyImage ) ]
    } ), {
      fill: NaturalSelectionColors.SCREEN_VIEW_BACKGROUND
    } );
  }

  return naturalSelection.register( 'IntroScreen', IntroScreen );
} );