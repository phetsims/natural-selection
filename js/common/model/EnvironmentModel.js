// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentModel is the sub-model that encapsulates the environment.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bunny = require( 'NATURAL_SELECTION/common/model/Bunny' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EnvironmentModelViewTransform = require( 'NATURAL_SELECTION/common/model/EnvironmentModelViewTransform' );
  const Environments = require( 'NATURAL_SELECTION/common/model/Environments' );
  const FoodSupply = require( 'NATURAL_SELECTION/common/model/FoodSupply' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const Wolves = require( 'NATURAL_SELECTION/common/model/Wolves' );

  class EnvironmentModel extends PhetioObject {

    /**
     * @param {GenerationClock} generationClock
     * @param {Tandem} tandem
     */
    constructor( generationClock, tandem ) {

      super( {
        tandem: tandem,
        phetioState: false // to prevent serialization, because we don't have an IO type
      } );

      // @public (read-only)
      this.generationClock = generationClock;

      // @public
      this.modelViewTransform = new EnvironmentModelViewTransform();

      // @public
      this.environmentProperty = new EnumerationProperty( Environments, Environments.EQUATOR, {
        tandem: tandem.createTandem( 'environmentProperty' )
      } );

      // @public (read-only)
      this.wolves = new Wolves( tandem.createTandem( 'wolves' ) );

      // @public (read-only)
      this.foodSupply = new FoodSupply( this.modelViewTransform, {
        tandem: tandem.createTandem( 'foodSupply' )
      } );

      // @public (read-only) {Bunny[]}
      this.bunnies = [ Bunny.createDefault() ];

      //TODO this should be an Emitter
      // @public whether a mate was added to the lone bunny that appears at startup
      this.mateWasAddedProperty = new BooleanProperty( this.bunnies.length > 1 );

      // @public whether any environmental factor is enabled
      this.environmentalFactorEnabledProperty = new DerivedProperty(
        [ this.wolves.enabledProperty, this.foodSupply.isToughProperty, this.foodSupply.isLimitedProperty ],
        ( wolvesEnabled, foodIsTough, foodIsLimited ) => ( wolvesEnabled || foodIsTough || foodIsLimited )
      );
    }

    /**
     * @public
     */
    reset() {
      this.environmentProperty.reset();
      this.wolves.reset();
      this.foodSupply.reset();
      this.mateWasAddedProperty.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'EnvironmentModel does not support dispose' );
    }

    /**
     * Resets the initial bunny population. Other settings are preserved.
     * @public
     */
    playAgain() {

      // dispose of all bunnies
      for ( let i = 0; i < this.bunnies.length; i++ ) {
        this.bunnies[ i ].dispose();
      }

      //TODO create the same initial population
      // create a lone bunny
      this.bunnies = [ Bunny.createDefault() ];

      this.mateWasAddedProperty.reset();
    }

    /**
     * Steps the model.
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {

      // step the bunnies
      for ( let i = 0; i < this.bunnies.length; i++ ) {
        this.bunnies[ i ].step( dt );
      }
    }
  }

  return naturalSelection.register( 'EnvironmentModel', EnvironmentModel );
} );