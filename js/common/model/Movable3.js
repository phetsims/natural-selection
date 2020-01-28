// Copyright 2020, University of Colorado Boulder

/**
 * Movable3 is the base class for something that can be moved and positioned in 3D space.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Property = require( 'AXON/Property' );
  const Vector3 = require( 'DOT/Vector3' );

  class Movable3  {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        position: Vector3.ZERO,
        isMovingRight: true
      }, options );

      // @public
      this.positionProperty = new Property( options.position, {
        valueType: Vector3
      } );

      // @public
      this.isMovingRightProperty = new BooleanProperty( options.isMovingRight );
    }

    /**
     * @public
     */
    reset() {
      this.positionProperty.reset();
      this.isMovingRightProperty.reset();
    }
  }

  return naturalSelection.register( 'Movable3', Movable3 );
} );