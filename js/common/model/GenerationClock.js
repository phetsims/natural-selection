// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationClock is the clock that completes one full cycle per generation.  In the user-interface, time is
 * presented in terms of 'generations'. Various events are described as times relative to the "wall clock" time
 * on the generation clock. For example, "bunnies reproduce at 12:00", or "wolves eat at 4:00".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';

// const
const SECONDS_PER_GENERATION = NaturalSelectionQueryParameters.secondsPerGeneration;
const MIN_STEPS_PER_GENERATION = 10;
const MAX_DT = SECONDS_PER_GENERATION / MIN_STEPS_PER_GENERATION;

class GenerationClock extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'the clock that marks the duration of a generation'
    }, options );

    super( options );

    // @public
    this.isRunningProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isRunningProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether the generation clock is running'
    } );

    // @private
    this.timeInSecondsProperty = new NumberProperty( 0, {
      isValidValue: time => ( time >= 0 ),
      tandem: options.tandem.createTandem( 'timeInSecondsProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'time that the generation clock has been running, in seconds (decimal)',
      phetioHighFrequency: true
    } );

    // @public percent of the current clock cycle that has been completed. dispose is not necessary.
    this.timeInPercentProperty = new DerivedProperty(
      [ this.timeInSecondsProperty ],
      timeInSeconds => ( timeInSeconds % SECONDS_PER_GENERATION ) / SECONDS_PER_GENERATION, {
        isValidValue: timeInPercent => ( timeInPercent >= 0 && timeInPercent <= 1 )
      }, {
        tandem: Tandem.OPT_OUT
      } );

    // @public dispose is not necessary
    this.timeInGenerationsProperty = new DerivedProperty(
      [ this.timeInSecondsProperty ],
      timeInSeconds => secondsToGenerations( timeInSeconds ), {
        tandem: options.tandem.createTandem( 'timeInGenerationsProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'time that the generation clock has been running, in generations (decimal)',
        phetioHighFrequency: true
      } );

    // @public dispose is not necessary
    // Named clockGenerationProperty to distinguish it from the other 'generation' Properties in this sim.
    // See https://github.com/phetsims/natural-selection/issues/187
    this.clockGenerationProperty = new DerivedProperty(
      [ this.timeInGenerationsProperty ],
      timeInGenerations => Math.floor( timeInGenerations ), {
        isValidValue: clockGeneration => Utils.isInteger( clockGeneration ),
        tandem: options.tandem.createTandem( 'clockGenerationProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'generation number of the current cycle of the generation clock (integer)'
      }
    );
    assert && this.clockGenerationProperty.lazyLink( ( currentClockGeneration, previousClockGeneration ) => {

      // Skip this when restoring PhET-iO state, because the initial state might be restored to any generation.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        assert && assert( currentClockGeneration === 0 || currentClockGeneration === previousClockGeneration + 1,
          `skipped a generation, currentClockGeneration=${currentClockGeneration}, previousClockGeneration=${previousClockGeneration}` );
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    this.isRunningProperty.reset();
    this.timeInSecondsProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * @param {number} dt - the time step, in seconds
   * @public
   */
  step( dt ) {
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
   * @param {number} dt - the time step, in seconds
   * @private
   */
  stepTime( dt ) {

    const nextTime = this.timeInSecondsProperty.value + dt;
    const nextGeneration = secondsToGenerations( nextTime );

    if ( nextGeneration > this.clockGenerationProperty.value ) {
      // snap to 12:00
      this.timeInSecondsProperty.value = nextGeneration * SECONDS_PER_GENERATION;
    }
    else {
      this.timeInSecondsProperty.value = nextTime;
    }
  }

  /**
   * Constrains dt so that the clock doesn't run so fast that we skip over generations. It's possible to run the
   * clock ridiculously fast using ?secondsPerGeneration, especially if combined with the fast-forward button.
   * See https://github.com/phetsims/natural-selection/issues/165.
   * @param {number} dt - time step, in seconds
   * @static
   * @public
   */
  static constrainDt( dt ) {
    return Math.min( dt, MAX_DT );
  }
}

/**
 * Converts time from seconds to generations.
 * @param {number} seconds - time, in seconds
 * @returns {number} time, in decimal number of generations
 */
function secondsToGenerations( seconds ) {
  if ( seconds === 0 ) {
    return 0;
  }
  else {

    // Add a small value here to compensate for floating-point error in division. For example
    // 8.6 seconds / 0.2 secondsPerGeneration should be 43 generations, but JavaScript evaluates
    // to 42.99999999999999. See https://github.com/phetsims/natural-selection/issues/165
    return ( seconds / SECONDS_PER_GENERATION ) + 0.0001;
  }
}

naturalSelection.register( 'GenerationClock', GenerationClock );
export default GenerationClock;