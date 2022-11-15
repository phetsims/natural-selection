// Copyright 2019-2022, University of Colorado Boulder

/**
 * GenerationClock is the clock that completes one full cycle per generation.  In the user-interface, time is
 * presented in terms of 'generations'. Various events are described as times relative to the "wall clock" time
 * on the generation clock. For example, "bunnies reproduce at 12:00", or "wolves eat at 4:00".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';

// const
const SECONDS_PER_GENERATION = NaturalSelectionQueryParameters.secondsPerGeneration;
const MIN_STEPS_PER_GENERATION = 10;
const MAX_DT = SECONDS_PER_GENERATION / MIN_STEPS_PER_GENERATION;

type SelfOptions = EmptySelfOptions;

type GenerationClockOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GenerationClock extends PhetioObject {

  public readonly isRunningProperty: Property<boolean>;
  private readonly timeInSecondsProperty: Property<number>;
  public readonly timeInPercentProperty: TReadOnlyProperty<number>;
  public readonly timeInGenerationsProperty: TReadOnlyProperty<number>;
  public readonly clockGenerationProperty: TReadOnlyProperty<number>;

  public constructor( providedOptions: GenerationClockOptions ) {

    const options = optionize<GenerationClockOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false, // to prevent serialization, because we don't have an IO Type
      phetioDocumentation: 'the clock that marks the duration of a generation'
    }, providedOptions );

    super( options );

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isRunningProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether the generation clock is running'
    } );

    this.timeInSecondsProperty = new NumberProperty( 0, {
      isValidValue: time => ( time >= 0 ),
      tandem: options.tandem.createTandem( 'timeInSecondsProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'time that the generation clock has been running, in seconds (decimal)',
      phetioHighFrequency: true
    } );

    // Percent of the current clock cycle that has been completed.
    this.timeInPercentProperty = new DerivedProperty(
      [ this.timeInSecondsProperty ],
      timeInSeconds => ( timeInSeconds % SECONDS_PER_GENERATION ) / SECONDS_PER_GENERATION, {
        isValidValue: timeInPercent => ( timeInPercent >= 0 && timeInPercent <= 1 ),
        tandem: Tandem.OPT_OUT
      } );

    this.timeInGenerationsProperty = new DerivedProperty(
      [ this.timeInSecondsProperty ],
      timeInSeconds => secondsToGenerations( timeInSeconds ), {
        tandem: options.tandem.createTandem( 'timeInGenerationsProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'time that the generation clock has been running, in generations (decimal)',
        phetioHighFrequency: true
      } );

    // Named clockGenerationProperty to distinguish it from the other 'generation' Properties in this sim.
    // See https://github.com/phetsims/natural-selection/issues/187
    this.clockGenerationProperty = new DerivedProperty(
      [ this.timeInGenerationsProperty ],
      timeInGenerations => Math.floor( timeInGenerations ), {
        isValidValue: clockGeneration => NaturalSelectionUtils.isNonNegativeInteger( clockGeneration ),
        tandem: options.tandem.createTandem( 'clockGenerationProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'generation number of the current cycle of the generation clock (integer)'
      }
    );

    // unlink is not necessary.
    assert && this.clockGenerationProperty.lazyLink( ( currentClockGeneration, previousClockGeneration ) => {

      // Skip this when restoring PhET-iO state, because the initial state might be restored to any generation.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        assert && assert( currentClockGeneration === 0 || currentClockGeneration === previousClockGeneration + 1,
          `skipped a generation, currentClockGeneration=${currentClockGeneration}, previousClockGeneration=${previousClockGeneration}` );
      }
    } );
  }

  public reset(): void {
    this.isRunningProperty.reset();
    this.timeInSecondsProperty.reset();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * @param dt - the time step, in seconds
   */
  public step( dt: number ): void {
    assert && assert( dt < SECONDS_PER_GENERATION,
      `dt=${dt} exceeded secondsPerGeneration=${SECONDS_PER_GENERATION}` );
    if ( this.isRunningProperty.value ) {
      this.stepTime( dt );
    }
  }

  /**
   * Sets timeInSecondsProperty, the time (in seconds) that the generation clock has been running, in seconds.
   * As time passes through the 12:00 position, it will always snap to the 12:00 position, which is when bunnies
   * die of old age and mate.
   * @param dt - the time step, in seconds
   */
  private stepTime( dt: number ): void {

    const nextTime = this.timeInSecondsProperty.value + dt;
    const nextGeneration = Math.floor( secondsToGenerations( nextTime ) ); // integer

    if ( nextGeneration > this.clockGenerationProperty.value ) {
      // snap to 12:00
      this.timeInSecondsProperty.value = nextGeneration * SECONDS_PER_GENERATION;
    }
    else {
      this.timeInSecondsProperty.value = nextTime;
    }
  }

  /**
   * Constrains dt to a maximum value, which results in a minimum number of steps per generation. This prevents us
   * from skipping over important transitions (like applying environmental factors) or even entire generations.
   * It's possible to run the clock ridiculously fast using ?secondsPerGeneration, especially if combined with the
   * fast-forward button. Running the clock fast became as habit of testers, and this constraint protects us from
   * that type of 'run it fast' abuse. See https://github.com/phetsims/natural-selection/issues/165.
   * @param dt - time step, in seconds
   */
  public static constrainDt( dt: number ): number {
    return Math.min( dt, MAX_DT );
  }
}

/**
 * Converts time from seconds to generations.
 * @param seconds - time, in seconds
 * @returns time, in decimal number of generations
 */
function secondsToGenerations( seconds: number ): number {
  let generations = 0;
  if ( seconds > 0 ) {

    generations = ( seconds / SECONDS_PER_GENERATION );

    // If generations is not an integer, add a small value here to compensate for floating-point error in division.
    // This ensures that we move forward and don't get stuck at certain generation values.
    // For example 8.6 seconds / 0.2 secondsPerGeneration should be 43 generations, but JavaScript evaluates
    // to 42.99999999999999. See https://github.com/phetsims/natural-selection/issues/165 and
    // https://github.com/phetsims/natural-selection/issues/230.
    if ( generations % 1 !== 0 ) {
      generations += 0.0001;
    }
  }
  return generations;
}

naturalSelection.register( 'GenerationClock', GenerationClock );