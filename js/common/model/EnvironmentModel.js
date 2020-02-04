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
  const NaturalSelectionQueryParameters = require( 'NATURAL_SELECTION/common/NaturalSelectionQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
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

        // phet-io
        tandem: tandem,
        phetioState: false, // to prevent serialization, because we don't have an IO type
        phetioDocumentation: 'portion of the model that deals with the environment'
      } );

      // @public (read-only)
      this.generationClock = new GenerationClock( {
        tandem: tandem.createTandem( 'generationClock' )
      } );

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

      // @public (read-only) {Bunny[]} use only addBunny and removeBunny to modify this array!
      this.bunnies = [];

      // @public (read-only) use only addBunny and removeBunny to modify this Property!
      this.numberOfBunniesProperty = new NumberProperty( this.bunnies.length, {
        numberType: 'Integer',
        tandem: tandem.createTandem( 'numberOfBunniesProperty' ),
        phetioReadOnly: true,
        phetioDocumentation: 'the number of bunnies that exist, living and dead'
      } );

      // @public (read-only) emit(Bunny) when a bunny is added
      this.bunnyAddedEmitter = new Emitter( {
        parameters: [ { valueType: Bunny } ]
      } );

      // @public (read-only) emit(Bunny) when a bunny is removed
      this.bunnyRemovedEmitter = new Emitter( {
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
      for ( let i = this.bunnies.length - 1; i >= 0; i-- ) {
        const bunny = this.bunnies[ i ];
        this.removeBunny( bunny );
        bunny.dispose();
      }
      //TODO? Bunny.resetStatic();
    }

    /**
     * Initializes the bunny population.
     * @private
     */
    initializeBunnyPopulation() {
      phet.log && phet.log( 'EnvironmentModel.initializeBunnyPopulation' );
      assert && assert( this.bunnies.length === 0, 'bunnies exist' );

      //TODO read query parameters and create initial population
      for ( let i = 0; i < NaturalSelectionQueryParameters.population; i++ ) {
        this.addRandomBunny();
      }
    }

    /**
     * Adds a bunny at a random position.
     * @public
     */
    addRandomBunny() {
      this.addBunny( new Bunny( this.modelViewTransform, {
        position: this.modelViewTransform.getRandomGroundPosition(),
        xDirection: phet.joist.random.nextBoolean() ? 1 : -1
      } ) );
    }

    /**
     * Adds a bunny to the collection.
     * @param {Bunny} bunny
     * @private
     */
    addBunny( bunny ) {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );
      this.bunnies.push( bunny );
      this.numberOfBunniesProperty.value++;
      this.bunnyAddedEmitter.emit( bunny );
    }

    /**
     * Removes a bunny from the collection.
     * @param {Bunny} bunny
     * @private
     */
    removeBunny( bunny ) {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );
      const index = this.bunnies.indexOf( bunny );
      assert && assert( index !== -1, `bunny not found: ${bunny}` );
      this.bunnies.splice( index, 1 );
      this.numberOfBunniesProperty.value--;
      this.bunnyRemovedEmitter.emit( bunny );
    }
  }

  return naturalSelection.register( 'EnvironmentModel', EnvironmentModel );
} );