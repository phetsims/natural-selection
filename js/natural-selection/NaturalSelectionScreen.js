// Copyright 2019, University of Colorado Boulder

/**
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionModel = require( 'NATURAL_SELECTION/natural-selection/model/NaturalSelectionModel' );
  const NaturalSelectionScreenView = require( 'NATURAL_SELECTION/natural-selection/view/NaturalSelectionScreenView' );

  class NaturalSelectionScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new NaturalSelectionModel( tandem.createTandem( 'model' ) ),
        ( model ) => new NaturalSelectionScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreen', NaturalSelectionScreen );
} );