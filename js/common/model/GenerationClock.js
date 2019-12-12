// Copyright 2019, University of Colorado Boulder

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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );

  // constant
  const SECONDS_PER_GENERATION = 10;

  class GenerationClock {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public (read-only)
      this.timeProperty = new NumberProperty( 0, {
        isValidValue: value => value >= 0,
        tandem: tandem.createTandem( 'timeProperty' ),
        phetioReadOnly: true,
        phetioDocumentation: 'time that the generation clock has been running, in seconds'
      } );

      // @public percent of the current clock cycle that has been completed
      this.percentTimeProperty = new DerivedProperty(
        [ this.timeProperty ],
        time => ( time % SECONDS_PER_GENERATION ) / SECONDS_PER_GENERATION, {
          isValidValue: value => ( value >= 0 && value <= 1 )
        } );

      // @public
      this.generationProperty = new DerivedProperty(
        [ this.timeProperty ],
        time => Math.floor( time / NaturalSelectionConstants.SECONDS_PER_GENERATION ), {
          isValidValue: value => Util.isInteger( value ),
          phetioType: DerivedPropertyIO( NumberIO ),
          tandem: tandem.createTandem( 'generationProperty' ),
          phetioDocumentation: 'generation number for the current clock cycle of the generation clock'
        } );

      // @public (read-only) the portion of the clock cycle when environmental factors are active
      this.environmentalFactorPercentRange = new Range( 0.25, 0.75 );
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'Generation is not intended to be disposed' );
    }

    /**
     * @public
     */
    reset() {
      this.timeProperty.reset();
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