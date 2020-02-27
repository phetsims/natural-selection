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
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class GenerationClock extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false // to prevent serialization, because we don't have an IO type
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

    // @public
    this.generationsProperty = new DerivedProperty(
      [ this.timeProperty ],
      time => time / NaturalSelectionConstants.SECONDS_PER_GENERATION, {
        phetioType: DerivedPropertyIO( NumberIO ),
        tandem: options.tandem.createTandem( 'generationsProperty' ),
        phetioDocumentation: 'decimal number of generations that the generation clock has been running',
        phetioHighFrequency: true
      } );

    // @public
    this.currentGenerationProperty = new DerivedProperty(
      [ this.generationsProperty ],
      generations => Math.floor( generations ), {
        phetioType: DerivedPropertyIO( NumberIO ),
        isValidValue: currentGeneration => Utils.isInteger( currentGeneration ),
        tandem: options.tandem.createTandem( 'currentGenerationProperty' ),
        phetioDocumentation: 'integer generation number for the current cycle of the generation clock'
      }
    );

    // @public percent of the current clock cycle that has been completed
    this.percentTimeProperty = new DerivedProperty(
      [ this.timeProperty ],
      time => ( time % NaturalSelectionConstants.SECONDS_PER_GENERATION ) / NaturalSelectionConstants.SECONDS_PER_GENERATION, {
        isValidValue: percentTime => ( percentTime >= 0 && percentTime <= 1 )
      } );

    // @public (read-only) the portion of the clock cycle when environmental factors are active
    this.environmentalFactorPercentRange = new Range( 0.25, 0.75 );
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
    assert && assert( false, 'GenerationClock does not support dispose' );
  }

  /**
   * @param {number} dt - the time step, in seconds
   * @public
   */
  step( dt ) {
    if ( this.isRunningProperty.value ) {
      this.timeProperty.value += dt;
    }
  }
}

naturalSelection.register( 'GenerationClock', GenerationClock );
export default GenerationClock;