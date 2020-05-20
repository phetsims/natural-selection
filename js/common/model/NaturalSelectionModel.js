// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCollection from './BunnyCollection.js';
import BunnyIO from './BunnyIO.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Food from './Food.js';
import GenePool from './GenePool.js';
import GenerationClock from './GenerationClock.js';
import parsePopulation from './parsePopulation.js';
import PedigreeModel from './PedigreeModel.js';
import PopulationModel from './PopulationModel.js';
import ProportionsModel from './ProportionsModel.js';
import SimulationMode from './SimulationMode.js';
import Wolves from './Wolves.js';

class NaturalSelectionModel {

  /**
   * @param {string} mutationsQueryParameterName
   * @param {string} populationQueryParameterName
   * @param {Object} [options]
   */
  constructor( mutationsQueryParameterName, populationQueryParameterName, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.modelViewTransform = new EnvironmentModelViewTransform();

    // @public
    this.simulationModeProperty = new EnumerationProperty( SimulationMode, SimulationMode.STAGED, {
      tandem: options.tandem.createTandem( 'simulationModeProperty' ),
      phetioDocumentation: 'for internal PhET use only', // see https://github.com/phetsims/phet-io/issues/1660
      phetioReadOnly: true
    } );

    // @public whether the sim is playing
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' )
    } );

    // @public (read-only)
    this.generationClock = new GenerationClock( {
      tandem: options.tandem.createTandem( 'generationClock' )
    } );

    // @pubic (read-only) pool of genes for the bunny population
    this.genePool = new GenePool( {
      tandem: options.tandem.createTandem( 'genePool' )
    } );

    // @private {BunnyVariety[]} describes the initial population
    this.initialBunnyVarieties = parsePopulation( this.genePool, mutationsQueryParameterName, populationQueryParameterName );

    // @public (read-only) the collection of Bunny instances
    this.bunnyCollection = new BunnyCollection( this.modelViewTransform, this.genePool, {
      tandem: options.tandem.createTandem( 'bunnyCollection' )
    } );
    this.initializeGenerationZero();

    // @public {Property.<Bunny|null>} a reference to a Bunny instance in BunnyCollection, null if no selection
    this.selectedBunnyProperty = new Property( null, {
      tandem: options.tandem.createTandem( 'selectedBunnyProperty' ),
      phetioType: PropertyIO( NullableIO( ReferenceIO( BunnyIO ) ) ),
      phetioDocumentation: 'bunny selected in environmentNode, whose pedigree is displayed by pedigreeNode'
    } );
    phet.log && this.selectedBunnyProperty.link( selectedBunny => {
      phet.log( `selectedBunny=${selectedBunny}` );
    } );

    // @public
    this.environmentProperty = new EnumerationProperty( Environment, Environment.EQUATOR, {
      tandem: options.tandem.createTandem( 'environmentProperty' )
    } );

    // @public (read-only)
    this.wolves = new Wolves( this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'wolves' )
    } );

    // @public (read-only)
    this.food = new Food( this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'food' )
    } );

    // @public whether any environmental factor is enabled
    this.environmentalFactorEnabledProperty = new DerivedProperty(
      [ this.wolves.enabledProperty, this.food.isToughProperty, this.food.isLimitedProperty ],
      ( wolvesEnabled, isTough, isLimited ) => ( wolvesEnabled || isTough || isLimited )
    );

    // @public (read-only)
    this.populationModel = new PopulationModel( this.genePool, this.generationClock.generationsProperty, this.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'populationModel' )
    } );

    // @public (read-only)
    this.proportionsModel = new ProportionsModel( this.genePool, this.generationClock.currentGenerationProperty, this.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'proportionsModel' )
    } );

    // @public (read-only)
    this.pedigreeModel = new PedigreeModel( {
      tandem: options.tandem.createTandem( 'pedigreeModel' )
    } );

    // When the generation changes...
    this.generationClock.currentGenerationProperty.lazyLink( currentGeneration => {

      // When restoring PhET-iO state, don't step the generation, as down stream elements of that call are already stateful.
      if ( currentGeneration !== 0 && !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.bunnyCollection.stepGeneration( currentGeneration );
      }
    } );

    // When the simulation state changes, adjust the model.
    this.simulationModeProperty.link( simulationMode => {
      phet.log && phet.log( `simulationMode=${simulationMode}` );

      // SimulationMode indicates which mode the simulation is in. It does not describe a full state of that mode.
      // Do nothing when PhET-iO is restoring state, or saved state will be overwritten.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        if ( simulationMode === SimulationMode.STAGED ) {
          this.isPlayingProperty.value = true;
          this.generationClock.isRunningProperty.value = false;
        }
        else if ( simulationMode === SimulationMode.ACTIVE ) {
          this.generationClock.isRunningProperty.value = true;
        }
        else if ( simulationMode === SimulationMode.COMPLETED ) {
          this.isPlayingProperty.value = false;
          this.generationClock.isRunningProperty.value = false;
        }
        else {
          throw new Error( `unsupported simulationMode: ${simulationMode}` );
        }
      }
    } );
  }

  /**
   * Resets the entire model.
   * @public
   */
  reset() {

    this.startOver();

    // environmental factors
    this.environmentProperty.reset();
    this.wolves.reset();
    this.food.reset();
  }

  /**
   * Similar to reset, but does not reset environmental factors or graphs.
   * @public
   */
  startOver() {

    this.simulationModeProperty.reset();
    this.isPlayingProperty.reset(); // see https://github.com/phetsims/natural-selection/issues/55
    this.generationClock.reset();

    this.genePool.reset();

    this.selectedBunnyProperty.reset();
    this.bunnyCollection.reset();
    this.initializeGenerationZero();

    this.populationModel.reset();
    this.proportionsModel.reset();
    this.pedigreeModel.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'NaturalSelectionModel does not support dispose' );
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   * @override
   */
  step( dt ) {
    if ( this.isPlayingProperty.value ) {
      this.stepOnce( dt );
    }
  }

  /**
   * Steps the model one time step. Used by the time controls Step button.
   * @param {number} dt - time step, in seconds
   * @public
   */
  stepOnce( dt ) {

    // step the generation clock
    this.generationClock.step( dt );

    // move the bunnies
    this.bunnyCollection.moveBunnies( dt );
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

  /**
   * Initializes the generation-zero bunny population.
   * @private
   */
  initializeGenerationZero() {

    phet.log && phet.log( 'EnvironmentModel.initializeGenerationZero' );
    assert && assert( this.bunnyCollection.liveBunnies.length === 0, 'bunnies already exist' );
    assert && assert( this.generationClock.currentGenerationProperty.value === 0, 'unexpected generation' );

    // for each {BunnyVariety} in the initial population ...
    this.initialBunnyVarieties.forEach( variety => {
      phet.log && phet.log( `creating ${variety.count} bunnies with genotype ${variety.genotypeString}` );
      for ( let i = 0; i < variety.count; i++ ) {
        this.bunnyCollection.createBunnyZero( {
          alleles: variety.alleles
        } );
      }
    } );
  }
}

naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
export default NaturalSelectionModel;