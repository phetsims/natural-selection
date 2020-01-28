// Copyright 2019-2020, University of Colorado Boulder

/**
 * TODO
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Tandem = require( 'TANDEM/Tandem' );

  class Wolves {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // @public
      this.enabledProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'enabledProperty' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.enabledProperty.reset();
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'Wolves does not support dispose' );
    }
  }

  return naturalSelection.register( 'Wolves', Wolves );
} );