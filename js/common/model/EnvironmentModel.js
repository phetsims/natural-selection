// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentModel is the sub-model that encapsulates the environment.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bunny = require( 'NATURAL_SELECTION/common/model/Bunny' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EnvironmentModelViewTransform = require( 'NATURAL_SELECTION/common/model/EnvironmentModelViewTransform' );
  const Environments = require( 'NATURAL_SELECTION/common/model/Environments' );
  const FoodSupply = require( 'NATURAL_SELECTION/common/model/FoodSupply' );
  const GenerationClock = require( 'NATURAL_SELECTION/common/model/GenerationClock' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Wolves = require( 'NATURAL_SELECTION/common/model/Wolves' );

  class EnvironmentModel extends PhetioObject {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      super( {
        tandem: tandem,
        phetioState: false // to prevent serialization, because we don't have an IO type
      } );

      // @public (read-only)
      this.generationClock = new GenerationClock( tandem.createTandem( 'generationClock' ) );

      // @public
      this.modelViewTransform = new EnvironmentModelViewTransform();

      // @public
      this.environmentProperty = new EnumerationProperty( Environments, Environments.EQUATOR, {
        tandem: tandem.createTandem( 'environmentProperty' )
      } );

      // @public (read-only)
      this.wolves = new Wolves( {
        tandem: tandem.createTandem( 'wolves' )
      } );

      // @public (read-only)
      this.foodSupply = new FoodSupply( this.modelViewTransform, {
        tandem: tandem.createTandem( 'foodSupply' )
      } );

      // @public whether any environmental factor is enabled
      this.environmentalFactorEnabledProperty = new DerivedProperty(
        [ this.wolves.enabledProperty, this.foodSupply.isToughProperty, this.foodSupply.isLimitedProperty ],
        ( wolvesEnabled, foodIsTough, foodIsLimited ) => ( wolvesEnabled || foodIsTough || foodIsLimited )
      );

      // @public (read-only) {Bunny[]}
      this.bunnies = [];

      // @public (read-only) emits when a bunny is born
      this.bunnyBornEmitter = new Emitter( {
        parameters: [ { valueType: Bunny } ]
      } );

      this.initializeBunnyPopulation();
    }

    /**
     * @public
     */
    reset() {
      phet.log && phet.log( 'EnvironmentModel.reset' );

      this.generationClock.reset();

      // reset Properties
      this.environmentProperty.reset();
      this.wolves.reset();
      this.foodSupply.reset();

      // dispose of all bunnies and reinitialize
      this.disposeBunnies();
      this.initializeBunnyPopulation();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'EnvironmentModel does not support dispose' );
    }

    /**
     * Steps the model.
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {

      // step the generation clock
      this.generationClock.step( dt );

      // step the bunnies
      for ( let i = 0; i < this.bunnies.length; i++ ) {
        this.bunnies[ i ].step( dt );
      }
    }

    /**
     * Resets the initial bunny population. Other settings are preserved.
     * @public
     */
    playAgain() {
      phet.log && phet.log( 'EnvironmentModel.playAgain' );

      // dispose of all bunnies and reinitialize
      this.disposeBunnies();
      this.initializeBunnyPopulation();
    }

    /**
     * Disposes of all bunnies.
     * @private
     */
    disposeBunnies() {
      phet.log && phet.log( 'EnvironmentModel.disposeBunnies' );
      for ( let i = 0; i < this.bunnies.length; i++ ) {
        this.bunnies[ i ].dispose();
      }
      this.bunnies = [];
      //TODO? Bunny.resetStatic();
    }

    /**
     * Initializes the bunny population.
     * @private
     */
    initializeBunnyPopulation() {
      phet.log && phet.log( 'EnvironmentModel.initializeBunnyPopulation' );
      assert && assert( this.bunnies.length === 0, 'bunnies exist' );

      const bunny = new Bunny( this.modelViewTransform.getRandomGroundPosition() );
      this.bunnies.push( bunny );
      this.bunnyBornEmitter.emit( bunny );
    }
  }

  return naturalSelection.register( 'EnvironmentModel', EnvironmentModel );
} );