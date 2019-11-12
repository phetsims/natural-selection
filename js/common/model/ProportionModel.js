// Copyright 2019, University of Colorado Boulder

/**
 * ProportionModel is the model used by the Proportion view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  class ProportionModel {

    constructor() {

      // @public
      this.valuesVisibleProperty = new BooleanProperty( true );
      this.generationProperty = new NumberProperty( 0, {
        numberType: 'Integer'
      } );

      //TODO these should be derived from other model state
      // @public
      this.startCountProperty = new NumberProperty( 1, {
        numberType: 'Integer'
      } );
      this.endCountProperty = new NumberProperty( 50, {
        numberType: 'Integer'
      } );
    }

    /**
     * @public
     */
    reset() {
      this.valuesVisibleProperty.reset();
      this.generationProperty.reset();
    }
  }

  return naturalSelection.register( 'ProportionModel', ProportionModel );
} );