// Copyright 2020, University of Colorado Boulder

/**
 * Movable3 is the base class for a model element that exists in 3D space.  It can be positioned, and it has
 * a direction along the x axis.
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
        position: Vector3.ZERO, // initial position
        isMovingRight: true // initial direction along the x axis, true=right, false=left
      }, options );

      // @public position in 3D space
      this.positionProperty = new Property( options.position, {
        valueType: Vector3
      } );

      // @public direction along the x axis, true=right, false=left
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