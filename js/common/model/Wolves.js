// Copyright 2019-2020, University of Colorado Boulder

/**
 * TODO
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class Wolves {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public
      this.enabledProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'enabledProperty' )
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