// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCollection from './BunnyCollection.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Food from './Food.js';
import GenePool from './GenePool.js';
import GenerationClock from './GenerationClock.js';
import parseInitialPopulation from './parseInitialPopulation.js';
import PedigreeModel from './PedigreeModel.js';
import PopulationModel from './PopulationModel.js';
import ProportionsModel from './ProportionsModel.js';
import SimulationMode from './SimulationMode.js';
import WolfCollection from './WolfCollection.js';

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

    // @public the transform between 3D model coordinates and 2D view coordinates
    this.modelViewTransform = new EnvironmentModelViewTransform();

    // @public see SimulationMode
    this.simulationModeProperty = new EnumerationProperty( SimulationMode, SimulationMode.STAGED, {
      tandem: options.tandem.createTandem( 'simulationModeProperty' ),
      phetioDocumentation: 'for internal PhET use only', // see https://github.com/phetsims/phet-io/issues/1660
      phetioReadOnly: true
    } );

    // @public whether the sim is playing
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: 'whether time is advancing in the simulation, controlled by the Play/Pause buttons'
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
    this.initialBunnyVarieties =
      parseInitialPopulation( this.genePool, mutationsQueryParameterName, populationQueryParameterName );

    // @public (read-only) the collection of Bunny instances
    this.bunnyCollection = new BunnyCollection( this.modelViewTransform, this.genePool, {
      tandem: options.tandem.createTandem( 'bunnyCollection' )
    } );
    this.initializeGenerationZero();

    // @public
    this.environmentProperty = new EnumerationProperty( Environment, Environment.EQUATOR, {
      tandem: options.tandem.createTandem( 'environmentProperty' )
    } );

    // @public (read-only)
    this.wolfCollection = new WolfCollection( this.bunnyCollection.liveBunnies, this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'wolfCollection' )
    } );

    // @public (read-only)
    this.food = new Food( this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'food' )
    } );

    // @public whether any environmental factor is enabled
    this.environmentalFactorEnabledProperty = new DerivedProperty(
      [ this.wolfCollection.enabledProperty, this.food.isToughProperty, this.food.isLimitedProperty ],
      ( wolvesEnabled, isTough, isLimited ) => ( wolvesEnabled || isTough || isLimited )
    );

    // @public (read-only)
    this.populationModel = new PopulationModel(
      this.genePool,
      this.generationClock.generationsProperty,
      this.isPlayingProperty, {
        tandem: options.tandem.createTandem( 'populationModel' )
      } );

    // @public (read-only)
    this.proportionsModel = new ProportionsModel(
      this.bunnyCollection.liveBunnies.countsProperty,
      this.generationClock.currentGenerationProperty,
      this.isPlayingProperty,
      this.simulationModeProperty, {
        tandem: options.tandem.createTandem( 'proportionsModel' )
      } );

    // @public (read-only)
    this.pedigreeModel = new PedigreeModel( {
      tandem: options.tandem.createTandem( 'pedigreeModel' )
    } );

    // When the simulation state changes...
    this.simulationModeProperty.link( simulationMode => {
      phet.log && phet.log( `simulationMode=${simulationMode}` );

      // SimulationMode indicates which mode the simulation is in. It does not describe a full state of that mode.
      // So do nothing when PhET-iO is restoring state, or saved state will be overwritten.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // When the simulation begins, record the first 'start of generation' data for the Proportions graph.
        if ( simulationMode === SimulationMode.ACTIVE ) {
          const currentGeneration = this.generationClock.currentGenerationProperty.value;
          this.proportionsModel.recordStartCounts( currentGeneration, this.bunnyCollection.getLiveBunnyCounts() );
        }

        // Adjust the sim playback and generation clock
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

    // When the generation changes...
    this.generationClock.currentGenerationProperty.lazyLink( currentGeneration => {

      // When restoring PhET-iO state, skip this code, because downstream elements are already stateful.
      if ( currentGeneration !== 0 && !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        phet.log && phet.log( `generation=${currentGeneration}` );

        // Record 'end of generation' counts for the previous generation before bunnies are aged or mate.
        this.proportionsModel.recordEndCounts( currentGeneration - 1, this.bunnyCollection.getLiveBunnyCounts() );

        // Age bunnies, some may die of old age.
        this.bunnyCollection.ageBunnies();

        // Mate bunnies
        this.bunnyCollection.mateBunnies( currentGeneration );

        // Record 'start of generation' counts for the current generation after bunnies mate. The delta between
        // 'End of generation N' and 'Start of generation N+1' will be the population change due to births + deaths.
        this.proportionsModel.recordStartCounts( currentGeneration, this.bunnyCollection.getLiveBunnyCounts() );
      }
    } );

    // Apply environmental factors.
    this.generationClock.percentTimeProperty.lazyLink( ( currentPercentTime, previousPercentTime ) => {

      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        //TODO Temporarily apply environmental factors all at once, rather then spread out over 3:00-9:00.
        // Apply wolves and food at different times, so we can see them separately on the Population graph.
        const foodPercentTime = 1 / 3;
        const wolvesPercentTime = 2 / 3;

        if ( previousPercentTime < foodPercentTime && currentPercentTime >= foodPercentTime ) {
          this.food.apply( this.bunnyCollection.liveBunnies.getArray() );
        }

        if ( previousPercentTime < wolvesPercentTime && currentPercentTime >= wolvesPercentTime ) {
          this.wolfCollection.apply( this.environmentProperty.value );
        }
      }
    } );
  }

  /**
   * Resets the entire model when the 'Reset All' button is pressed.
   * @public
   */
  reset() {

    this.startOver();

    // environmental factors
    this.environmentProperty.reset();
  }

  /**
   * Resets part of the model when the 'Start Over' button is pressed.
   * @public
   */
  startOver() {

    this.simulationModeProperty.reset();
    this.isPlayingProperty.reset(); // see https://github.com/phetsims/natural-selection/issues/55
    this.generationClock.reset();

    this.genePool.reset();

    this.bunnyCollection.reset();
    this.initializeGenerationZero();

    // See https://github.com/phetsims/natural-selection/issues/91
    this.wolfCollection.reset();
    this.food.reset();

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

  //TODO do I need to do something for dt=0 here?
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
    this.bunnyCollection.moveBunnies();

    // move the wolves
    this.wolfCollection.moveWolves();
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

    // For each {BunnyVariety} in the initial population, create bunnies of that variety.
    this.initialBunnyVarieties.forEach( variety => {
      phet.log && phet.log( `creating ${variety.count} bunnies with genotype '${variety.genotypeString}'` );
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