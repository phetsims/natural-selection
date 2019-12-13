// Copyright 2019, University of Colorado Boulder

/**
 * EnvironmentalFactor is the base class for all environmental factors. These are things that affect the fertility
 * or mortality of bunnies, and are also known as 'selection agents' or 'selecting agents'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class EnvironmentalFactor {

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
     * @override
     */
    dispose() {
      assert && assert( false, 'EnvironmentalFactor does not support dispose' );
    }
  }

  return naturalSelection.register( 'EnvironmentalFactor', EnvironmentalFactor );
} );