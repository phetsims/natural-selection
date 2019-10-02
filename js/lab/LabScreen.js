// Copyright 2019, University of Colorado Boulder

/**
 * LabScreen is the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const LabModel = require( 'NATURAL_SELECTION/lab/model/LabModel' );
  const LabScreenView = require( 'NATURAL_SELECTION/lab/view/LabScreenView' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenLabString = require( 'string!NATURAL_SELECTION/screen.lab' );

  class LabScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenLabString,
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new LabModel( tandem.createTandem( 'model' ) ),
        model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return naturalSelection.register( 'LabScreen', LabScreen );
} );