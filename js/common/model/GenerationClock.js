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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  // constant
  const SECONDS_PER_GENERATION = 10;

  class GenerationClock {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public (read-only)
      this.timeProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 && value <= SECONDS_PER_GENERATION ),
        tandem: tandem.createTandem( 'timeProperty' ),
        phetioReadOnly: true
      } );

      // @public
      this.percentTimeProperty = new DerivedProperty(
        [ this.timeProperty ], time => time / SECONDS_PER_GENERATION, {
          isValidValue: value => ( value >= 0 && value <= 1 )
        } );

      // @public (read-only) the portion of the clock cycle when selection agents are active
      this.selectionAgentPercentRange = new Range( 0.25, 0.75 );
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
      this.timeProperty.value = ( this.timeProperty.value + dt ) % SECONDS_PER_GENERATION;
    }
  }

  return naturalSelection.register( 'GenerationClock', GenerationClock );
} );