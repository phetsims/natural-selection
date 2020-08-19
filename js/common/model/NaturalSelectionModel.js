// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
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

    // @public
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: 'whether time is advancing in the simulation, controlled by the Play/Pause button'
    } );

    // @public
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed, TimeSpeed.NORMAL, {
      tandem: options.tandem.createTandem( 'timeSpeedProperty' ),
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      phetioDocumentation: 'controls the speed of the generation clock',
      phetioReadOnly: true
    } );

    // @private
    this.timeScaleProperty = new DerivedProperty(
      [ this.timeSpeedProperty ],
      timeSpeed => ( timeSpeed === TimeSpeed.NORMAL ) ? 1 : NaturalSelectionQueryParameters.fastForwardScale, {
        // PhET-iO instrumentation is not necessary
      } );

    // @public (read-only)
    this.generationClock = new GenerationClock( {
      tandem: options.tandem.createTandem( 'generationClock' )
    } );
    phet.log && phet.log( '====== Generation 0 ======' );

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
    this.wolfCollection = new WolfCollection( this.generationClock, this.environmentProperty, this.bunnyCollection,
      this.modelViewTransform, {
        tandem: options.tandem.createTandem( 'wolfCollection' )
      } );

    // @public (read-only)
    this.food = new Food( this.generationClock, this.bunnyCollection, this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'food' )
    } );

    // Organize all graphs under this tandem
    const graphsTandem = options.tandem.createTandem( 'graphs' );

    // @public (read-only)
    this.populationModel = new PopulationModel(
      this.genePool,
      this.generationClock.timeInGenerationsProperty,
      this.isPlayingProperty, {
        tandem: graphsTandem.createTandem( 'populationModel' )
      } );

    // @public (read-only)
    this.proportionsModel = new ProportionsModel(
      this.bunnyCollection.liveBunnies.countsProperty,
      this.generationClock.clockGenerationProperty,
      this.isPlayingProperty,
      this.simulationModeProperty, {
        tandem: graphsTandem.createTandem( 'proportionsModel' )
      } );

    // @public (read-only)
    this.pedigreeModel = new PedigreeModel( {
      tandem: graphsTandem.createTandem( 'pedigreeModel' )
    } );

    // When the simulation state changes... unlink is not necessary.
    this.simulationModeProperty.link( simulationMode => {

      // SimulationMode indicates which mode the simulation is in. It does not describe a full state of that mode.
      // So do nothing when PhET-iO is restoring state, or saved state will be overwritten.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // When the simulation begins, record 'start' data for the graphs.
        if ( simulationMode === SimulationMode.ACTIVE ) {
          const clockGeneration = this.generationClock.clockGenerationProperty.value;
          const counts = this.bunnyCollection.getLiveBunnyCounts();
          this.proportionsModel.recordStartCounts( clockGeneration, counts );
          this.populationModel.recordCounts( clockGeneration, counts );
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

    //TODO https://github.com/phetsims/natural-selection/issues/60 delete this Property
    this.timeToMateProperty = new NumberProperty( 0 );

    //TODO https://github.com/phetsims/natural-selection/issues/140 delete this Property
    this.timeToStartOverProperty = new NumberProperty( 0 );

    // All of the stuff that happens at 12:00 on the generation clock.
    // unlink is not necessary.
    this.generationClock.clockGenerationProperty.lazyLink( clockGeneration => {

      // When restoring PhET-iO state, skip this code, because downstream elements are already stateful.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // Generation 0 is initialized elsewhere, this code is for subsequent generations.
        if ( clockGeneration !== 0 ) {

          phet.log && phet.log( `====== Generation ${clockGeneration} ======` );

          // Before bunnies are aged or mated, Record 'End of Generation' counts for the Proportions graph.
          this.proportionsModel.recordEndCounts( clockGeneration - 1, this.bunnyCollection.getLiveBunnyCounts() );

          phet.log && phet.log( `live bunnies = ${this.bunnyCollection.getNumberOfLiveBunnies()}` );
          phet.log && phet.log( `dead bunnies = ${this.bunnyCollection.getNumberOfDeadBunnies()}` );
          phet.log && phet.log( `recessive mutants = ${this.bunnyCollection.getNumberOfRecessiveMutants()}` );

          // Age bunnies, some may die of old age.
          this.bunnyCollection.ageBunnies();

          this.bunnyCollection.pruneDeadBunnies( clockGeneration );

          // Mate bunnies
          //TODO https://github.com/phetsims/natural-selection/issues/60 delete NaturalSelectionUtils.time
          // this.bunnyCollection.mateBunnies( clockGeneration );
          this.timeToMateProperty.value = NaturalSelectionUtils.time( () => this.bunnyCollection.mateBunnies( clockGeneration ) );

          // After bunnies are aged and mated, record counts for graphs.
          const counts = this.bunnyCollection.getLiveBunnyCounts();
          this.proportionsModel.recordStartCounts( clockGeneration, counts );
          this.populationModel.recordCounts( clockGeneration, counts );
        }
      }
    } );

    // Record data for the Population graph when the population is changed by environmental factors.
    const recordCounts = timeInGenerations => {
      const counts = this.bunnyCollection.getLiveBunnyCounts();
      this.populationModel.recordCounts( timeInGenerations, counts );
    };
    this.wolfCollection.bunniesEatenEmitter.addListener( recordCounts ); // removeListener is not necessary.
    this.food.bunniesStarvedEmitter.addListener( recordCounts ); // removeListener is not necessary.
  }

  /**
   * Resets the entire model when the 'Reset All' button is pressed.
   * @public
   */
  reset() {

    this.startOver();

    this.timeSpeedProperty.reset();

    // environmental factors
    this.environmentProperty.reset();
  }

  /**
   * Resets part of the model when the 'Start Over' button is pressed.
   * @public
   */
  startOver() {

    phet.log && phet.log( '====== Generation 0 ======' );

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
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    if ( this.isPlayingProperty.value ) {

      // So we can't make the sim run so fast that it skips generations,
      dt = GenerationClock.constrainDt( dt );

      // step the generation clock
      this.generationClock.step( dt * this.timeScaleProperty.value );

      // move the bunnies
      this.bunnyCollection.moveBunnies( dt );

      // move the wolves
      this.wolfCollection.moveWolves( dt );
    }
  }

  /**
   * Adds a mate for a lone bunny.
   * @public
   */
  addAMate() {
    assert && assert( this.bunnyCollection.getNumberOfLiveBunnies() === 1, 'there should only be 1 live bunny' );
    assert && assert( this.generationClock.clockGenerationProperty.value === 0, 'unexpected clockGeneration' );

    this.bunnyCollection.createBunnyZero();
  }

  /**
   * Initializes the generation-zero bunny population.
   * @private
   */
  initializeGenerationZero() {

    phet.log && phet.log( 'NaturalSelectionModel.initializeGenerationZero' );
    assert && assert( this.bunnyCollection.getNumberOfLiveBunnies() === 0, 'bunnies already exist' );
    assert && assert( this.generationClock.clockGenerationProperty.value === 0, 'unexpected clockGeneration' );

    // For each {BunnyVariety} in the initial population, create bunnies of that variety.
    this.initialBunnyVarieties.forEach( variety => {
      phet.log && phet.log( `creating ${variety.count} bunnies with genotype '${variety.genotypeString}'` );
      for ( let i = 0; i < variety.count; i++ ) {
        this.bunnyCollection.createBunnyZero( {
          genotypeOptions: {
            fatherFurAllele: variety.fatherFurAllele,
            motherFurAllele: variety.motherFurAllele,
            fatherEarsAllele: variety.fatherEarsAllele,
            motherEarsAllele: variety.motherEarsAllele,
            fatherTeethAllele: variety.fatherTeethAllele,
            motherTeethAllele: variety.motherTeethAllele
          }
        } );
      }
    } );
  }
}

naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
export default NaturalSelectionModel;