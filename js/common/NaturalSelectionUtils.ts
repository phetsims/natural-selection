// Copyright 2019-2021, University of Colorado Boulder

/**
 * NaturalSelectionUtils defines utility functions that are used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import PhetioObject from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IntentionalAny from '../../../phet-core/js/types/IntentionalAny.js';
import naturalSelection from '../naturalSelection.js';

const NaturalSelectionUtils = {

  /**
   * Determines the time that it takes to execute a specified function.
   * @param f - the function to execute
   * @returns the time to complete f, in ms
   */
  time( f: () => void ): number {
    const tBefore = performance.now();
    f();
    return performance.now() - tBefore;
  },

  /**
   * Logs the time that it takes to execute a specified function.
   * Used for debugging during implementation, and should not appear in production.
   *
   * For example, if you want to time this:
   *   this.step( dt );
   * Wrap it like this:
   *   logTime( 'step', () => this.step( dt ) );
   * Console output will look like this:
   *   step took 56.68500000001586 ms
   *
   * @param name - name used to identify the function in the log message
   * @param f - the function to execute
   */
  logTime( name: string, f: () => void ): void {
    console.log( `${name} took ${NaturalSelectionUtils.time( f )} ms` );
  },

  /**
   * Determines whether an array is sorted. Duplicates are allowed, and an empty array is considered sorted.
   * @param array - the array to examine
   * @param [compare] - the comparison function, defaults to ascending numbers
   */
  isSorted<T>( array: T[], compare?: ( value: T, nextValue: T ) => boolean ): boolean {
    assert && assert( Array.isArray( array ), 'invalid array' );
    assert && assert( !compare || typeof compare === 'function', 'invalid array' );

    compare = compare || ( ( value, nextValue ) => value <= nextValue );
    let isSorted = true;
    for ( let i = 1; i < array.length - 1 && isSorted; i++ ) {
      isSorted = compare( array[ i ], array[ i + 1 ] );
    }
    return isSorted;
  },

  /**
   * Determines whether an array is sorted in descending order.
   * Duplicates are allowed, and an empty array is considered sorted.
   */
  isSortedDescending<T>( array: T[] ): boolean {
    return NaturalSelectionUtils.isSorted<T>( array, ( value, nextValue ) => value >= nextValue );
  },

  /**
   * Determines whether a value is a positive number.
   */
  isPositive( value: IntentionalAny ): boolean {
    return ( typeof value === 'number' ) && ( value > 0 );
  },

  /**
   * Determines whether a value is a non-negative number.
   */
  isNonNegative( value: IntentionalAny ): boolean {
    return ( typeof value === 'number' ) && ( value >= 0 );
  },

  /**
   * Determines whether a value is a positive integer.
   */
  isPositiveInteger( value: IntentionalAny ): boolean {
    return NaturalSelectionUtils.isPositive( value ) && Number.isInteger( value );
  },

  /**
   * Determines whether a value is a non-negative integer.
   */
  isNonNegativeInteger( value: IntentionalAny ): boolean {
    return NaturalSelectionUtils.isNonNegative( value ) && Number.isInteger( value );
  },

  /**
   * Determines whether a value is a percentage, between 0 and 1.
   */
  isPercent( value: IntentionalAny ): boolean {
    return NaturalSelectionUtils.isNonNegative( value ) && ( value >= 0 ) && ( value <= 1 );
  },

  /**
   * Determines whether a value is a Range for a percentage, between 0 and 1.
   */
  isPercentRange( value: IntentionalAny ): boolean {
    return ( value instanceof Range ) && ( value.min >= 0 ) && ( value.max <= 1 );
  },

  /**
   * Gets the PhET-iO element for a specified phetioID. This is intended to be used as a debugging tool,
   * to inspect a PhET-iO element in the console. Do not use this to access elements via code!
   *
   * Example: phet.naturalSelection.NaturalSelectionUtils.getElement( 'naturalSelection.labScreen' )
   */
  getElement( phetioID: string ): PhetioObject | undefined {
    if ( Tandem.PHET_IO_ENABLED ) {
      return phet.phetio.phetioEngine.phetioObjectMap[ phetioID ];
    }
    else {
      console.warn( 'PhET-iO is not initialized' );
      return undefined;
    }
  }
};

naturalSelection.register( 'NaturalSelectionUtils', NaturalSelectionUtils );
export default NaturalSelectionUtils;