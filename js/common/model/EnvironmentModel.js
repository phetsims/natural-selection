// Copyright 2019, University of Colorado Boulder

/**
 * EnvironmentModel is the sub-model that encapsulates the environment.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Environments = require( 'NATURAL_SELECTION/common/model/Environments' );
  const LimitedFood = require( 'NATURAL_SELECTION/common/model/LimitedFood' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const ToughFood = require( 'NATURAL_SELECTION/common/model/ToughFood' );
  const Wolves = require( 'NATURAL_SELECTION/common/model/Wolves' );

  class EnvironmentModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public the abiotic (physical, rather than biological) environment
      this.environmentProperty = new EnumerationProperty( Environments, Environments.EQUATOR, {
        tandem: tandem.createTandem( 'environmentProperty' )
      } );

      // @public (read-only) the biotic (biological, rather than physical) environmental factors
      this.wolves = new Wolves( tandem.createTandem( 'wolves' ) );
      this.toughFood = new ToughFood( tandem.createTandem( 'toughFood' ) );
      this.limitedFood = new LimitedFood( tandem.createTandem( 'limitedFood' ) );

      // @public whether any environmental factor is enabled
      this.environmentalFactorEnabledProperty = new DerivedProperty(
        [ this.wolves.enabledProperty, this.toughFood.enabledProperty, this.limitedFood.enabledProperty ],
        ( wolvesEnabled, touchFooEnabled, limitedFoodEnabled ) =>
          ( wolvesEnabled || touchFooEnabled || limitedFoodEnabled )
      );
    }

    /**
     * @public
     */
    reset() {
      this.environmentProperty.reset();
      this.wolves.reset();
      this.toughFood.reset();
      this.limitedFood.reset();
    }
  }

  return naturalSelection.register( 'EnvironmentModel', EnvironmentModel );
} );