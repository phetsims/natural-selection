// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationClock is the clock that completes one full cycle per generation.
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

    // @public (read-only)
    this.timeProperty = new NumberProperty( 0, {
      isValidValue: time => ( time >= 0 ),
      tandem: options.tandem.createTandem( 'timeProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'time that the generation clock has been running, in seconds',
      phetioHighFrequency: true
    } );

    // @public dispose is not necessary
    this.generationsProperty = new DerivedProperty(
      [ this.timeProperty ],
      time => timeToGenerations( time ), {
        phetioType: DerivedPropertyIO( NumberIO ),
        tandem: options.tandem.createTandem( 'generationsProperty' ),
        phetioDocumentation: 'decimal number of generations that the generation clock has been running',
        phetioHighFrequency: true
      } );

    // @public dispose is not necessary
    this.currentGenerationProperty = new DerivedProperty(
      [ this.generationsProperty ],
      generations => Math.floor( generations ), {
        phetioType: DerivedPropertyIO( NumberIO ),
        isValidValue: currentGeneration => Utils.isInteger( currentGeneration ),
        tandem: options.tandem.createTandem( 'currentGenerationProperty' ),
        phetioDocumentation: 'integer generation number for the current cycle of the generation clock'
      }
    );
    assert && this.currentGenerationProperty.lazyLink( ( currentGeneration, previousGeneration ) => {

      // Skip this when restoring PhET-iO state, because the initial state might be restored to any generation.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        assert && assert( currentGeneration === 0 || currentGeneration === previousGeneration + 1,
          `skipped a generation, currentGeneration=${currentGeneration}, previousGeneration=${previousGeneration}` );
      }
    } );

    // @public percent of the current clock cycle that has been completed. dispose is not necessary.
    this.percentTimeProperty = new DerivedProperty(
      [ this.timeProperty ],
      time => ( time % SECONDS_PER_GENERATION ) / SECONDS_PER_GENERATION, {
        isValidValue: percentTime => ( percentTime >= 0 && percentTime <= 1 )
      } );
  }

  /**
   * @public
   */
  reset() {
    this.isRunningProperty.reset();
    this.timeProperty.reset();
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
   * Sets timeProperty, the time that the generation clock has been running, in seconds. As time passes through the
   * 12:00 position, it will always snap to the 12:00 position, which is when bunnies mate and die of old age.
   * @param {number} dt - the time step, in seconds
   * @private
   */
  stepTime( dt ) {

    const nextTime = this.timeProperty.value + dt;
    const nextGeneration = timeToGenerations( nextTime );

    if ( nextGeneration > this.currentGenerationProperty.value ) {
      // snap to 12:00
      this.timeProperty.value = nextGeneration * SECONDS_PER_GENERATION;
    }
    else {
      this.timeProperty.value = nextTime;
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
 * Converts elapsed time in seconds to a decimal number of generations. We need to add a small value here to
 * compensate for floating-point error in division. For example 8.6 seconds / 0.2 secondsPerGeneration should be
 * 43 generations, but JavaScript evaluates to 42.99999999999999.
 * See https://github.com/phetsims/natural-selection/issues/165
 * @param {number} time - elapsed time, in seconds
 * @returns {number} decimal number of generations that corresponds to the elapsed time
 */
function timeToGenerations( time ) {
  return ( time / SECONDS_PER_GENERATION ) + 0.0001;
}

naturalSelection.register( 'GenerationClock', GenerationClock );
export default GenerationClock;