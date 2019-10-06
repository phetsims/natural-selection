// Copyright 2019, University of Colorado Boulder

/**
 * IntroScreen is the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const IntroModel = require( 'NATURAL_SELECTION/intro/model/IntroModel' );
  const IntroScreenView = require( 'NATURAL_SELECTION/intro/view/IntroScreenView' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

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
        tandem: tandem
      };

      super(
        () => new IntroModel( tandem.createTandem( 'model' ) ),
        model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return naturalSelection.register( 'IntroScreen', IntroScreen );
} );