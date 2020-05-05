// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentModel is the sub-model that encapsulates the environment.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import BunnyCollection from './BunnyCollection.js';
import BunnyIO from './BunnyIO.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Environments from './Environments.js';
import FoodSupply from './FoodSupply.js';
import GenePool from './GenePool.js';
import GenerationClock from './GenerationClock.js';
import Wolves from './Wolves.js';

class EnvironmentModel extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false, // to prevent serialization, because there is no associated IO Type
      phetioDocumentation: 'portion of the model that deals with the environment'
    }, options );

    super( options );

    // @public (read-only)
    this.generationClock = new GenerationClock( {
      tandem: options.tandem.createTandem( 'generationClock' )
    } );

    // @public
    this.modelViewTransform = new EnvironmentModelViewTransform();

    // @public
    this.environmentProperty = new EnumerationProperty( Environments, Environments.EQUATOR, {
      tandem: options.tandem.createTandem( 'environmentProperty' )
    } );

    // @public (read-only)
    this.wolves = new Wolves( this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'wolves' )
    } );

    // @public (read-only)
    this.foodSupply = new FoodSupply( this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'foodSupply' )
    } );

    // @public whether any environmental factor is enabled
    this.environmentalFactorEnabledProperty = new DerivedProperty(
      [ this.wolves.enabledProperty, this.foodSupply.isToughProperty, this.foodSupply.isLimitedProperty ],
      ( wolvesEnabled, foodIsTough, foodIsLimited ) => ( wolvesEnabled || foodIsTough || foodIsLimited )
    );

    // @pubic (read-only) pool of genes for the bunny population
    this.genePool = new GenePool( {
      tandem: options.tandem.createTandem( 'genePool' )
    } );

    // @public (read-only) the collection of Bunny instances
    this.bunnyCollection = new BunnyCollection( this.modelViewTransform, this.genePool, {
      tandem: options.tandem.createTandem( 'bunnyCollection' )
    } );

    // @public {Property.<Bunny|null>} a reference to a Bunny instance in BunnyCollection, null if no selection
    this.selectedBunnyProperty = new Property( null, {
      tandem: options.tandem.createTandem( 'selectedBunnyProperty' ),
      phetioType: PropertyIO( NullableIO( ReferenceIO( BunnyIO ) ) ),
      phetioDocumentation: 'bunny selected in environmentNode, whose pedigree is displayed by pedigreeNode'
    } );
    phet.log && this.selectedBunnyProperty.link( selectedBunny => {
      phet.log( `selectedBunny=${selectedBunny}` );
    } );

    this.initializeBunnyPopulation();

    // When the generation changes...
    this.generationClock.currentGenerationProperty.lazyLink( currentGeneration => {
      if ( currentGeneration !== 0 ) {
        this.bunnyCollection.stepGeneration( currentGeneration );
      }
    } );
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
    this.selectedBunnyProperty.reset();

    this.genePool.reset();

    // dispose of all bunnies and reinitialize
    this.bunnyCollection.reset();
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

    // move the bunnies
    this.bunnyCollection.moveBunnies( dt );
  }

  //TODO read query parameters and create initial population
  /**
   * Initializes the 'generation 0' bunny population.
   * @private
   */
  initializeBunnyPopulation() {
    phet.log && phet.log( 'EnvironmentModel.initializeBunnyPopulation' );
    assert && assert( this.bunnyCollection.liveBunnies.length === 0, 'bunnies already exist' );
    assert && assert( this.generationClock.currentGenerationProperty.value === 0, 'unexpected generation' );

    for ( let i = 0; i < NaturalSelectionConstants.INITIAL_POPULATION; i++ ) {
      this.bunnyCollection.createBunnyZero();
    }
  }

  /**
   * Adds a mate for a lone bunny.
   * @private
   */
  addAMate() {
    assert && assert( this.bunnyCollection.liveBunnies.length === 1, 'there should only be 1 live bunny' );
    assert && assert( this.generationClock.currentGenerationProperty.value === 0, 'unexpected generation' );

    this.bunnyCollection.createBunnyZero();
  }
}

naturalSelection.register( 'EnvironmentModel', EnvironmentModel );
export default EnvironmentModel;