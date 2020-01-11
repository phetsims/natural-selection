// Copyright 2020, University of Colorado Boulder

//TODO temporary model of one item of food
/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Vector3 = require( 'DOT/Vector3' );

  class Food {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        position: Vector3.ZERO,
        exists: true,
        isTough: false
      }, options );

      // @public (read-only)
      this.position = options.position;
      phet.log && phet.log( `Food position=${this.position}` );

      // @public
      this.existsProperty = new BooleanProperty( options.exists );

      // @public
      this.isToughProperty = new BooleanProperty( options.isTough );
    }

    /**
     * @public
     */
    reset() {
      this.existsProperty.reset();
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