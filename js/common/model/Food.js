// Copyright 2020, University of Colorado Boulder

/**
 * Food is the model of one item of food.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const Movable3 = require( 'NATURAL_SELECTION/common/model/Movable3' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Vector3 = require( 'DOT/Vector3' );

  class Food extends Movable3 {

    /**
     * @param {string} debugLabel
     * @param {HTMLImageElement} toughImage
     * @param {HTMLImageElement} tenderImage
     * @param {Object} [options]
     */
    constructor( debugLabel, toughImage, tenderImage, options ) {

      options = merge( {
        position: Vector3.ZERO,
        isMovingRight: true
      }, options );

      assert && assert( !options.tandem, 'Food instances should not be instrumented' );

      super( options );

      // @public (read-only)
      this.debugLabel = debugLabel;
      this.toughImage = toughImage;
      this.tenderImage = tenderImage;

      // @public
      this.isToughProperty = new BooleanProperty( false );

      // @public whether the food is visible, used to hide food when the food supply is limited
      this.visibleProperty = new BooleanProperty( true );
    }

    /**
     * @public
     */
    reset() {
      super.reset();
      this.visibleProperty.reset();
      this.isToughProperty.reset();
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'Food does not support dispose' );
    }
  }

  return naturalSelection.register( 'Food', Food );
} );