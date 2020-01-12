// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationClock is the clock that completes one full cycle per generation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const Range = require( 'DOT/Range' );
  const Utils = require( 'DOT/Utils' );

  class GenerationClock extends PhetioObject {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super( {
        tandem: tandem,
        phetioState: false // to prevent serialization, because we don't have an IO type
      } );

      // @public (read-only)
      this.timeProperty = new NumberProperty( 0, {
        isValidValue: time => ( time >= 0 ),
        tandem: tandem.createTandem( 'timeProperty' ),
        phetioReadOnly: true,
        phetioDocumentation: 'time that the generation clock has been running, in seconds',
        phetioHighFrequency: true
      } );

      // @public
      this.generationsProperty = new DerivedProperty(
        [ this.timeProperty ],
        time => time / NaturalSelectionConstants.SECONDS_PER_GENERATION, {
          phetioType: DerivedPropertyIO( NumberIO ),
          tandem: tandem.createTandem( 'generationsProperty' ),
          phetioDocumentation: 'decimal number of generations that the generation clock has been running',
          phetioHighFrequency: true
        } );

      // @public
      this.currentGenerationProperty = new DerivedProperty(
        [ this.generationsProperty ],
        generations => Math.floor( generations ), {
          phetioType: DerivedPropertyIO( NumberIO ),
          isValidValue: currentGeneration => Utils.isInteger( currentGeneration ),
          tandem: tandem.createTandem( 'currentGenerationProperty' ),
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
      this.timeProperty.reset();
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'GenerationClock does not support dispose' );
    }

    /**
     * @param {number} dt - the time step, in seconds
     * @public
     */
    step( dt ) {
      this.timeProperty.value += dt;
    }
  }

  return naturalSelection.register( 'GenerationClock', GenerationClock );
} );