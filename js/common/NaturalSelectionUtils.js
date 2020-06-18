// Copyright 2019-2020, University of Colorado Boulder

//TODO should any of these be migrated to common?
/**
 * NaturalSelectionUtils defines utility functions that are specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../scenery/js/util/Color.js';
import naturalSelection from '../naturalSelection.js';

const NaturalSelectionUtils = {

  /**
   * Gets the luminance of a color, per ITU-R recommendation BT.709, https://en.wikipedia.org/wiki/Rec._709.
   * Green contributes the most to the intensity perceived by humans, and blue the least.
   * This algorithm works correctly with a grayscale color because the RGB coefficients sum to 1.
   * @param {Color|string} color
   * @returns {number} - a value in the range [0,255]
   * @public
   */
  getLuminance( color ) {
    assert && assert( color instanceof Color || typeof color === 'string', 'invalid color' );
    const sceneryColor = Color.toColor( color );
    const luminance = ( sceneryColor.red * 0.2126 + sceneryColor.green * 0.7152 + sceneryColor.blue * 0.0722 );
    assert && assert( luminance >= 0 && luminance <= 255, `unexpected luminance: ${luminance}` );
    return luminance;
  },

  /**
   * Converts a color to grayscale.
   * @param {Color|string} color
   * @returns {Color}
   * @public
   */
  toGrayscale( color ) {
    const luminance = NaturalSelectionUtils.getLuminance( color );
    return new Color( luminance, luminance, luminance );
  },

  /**
   * Determines whether a color is 'dark'.
   * @param {Color|string} color
   * @param {number} [luminanceThreshold] - colors with luminance < this value are dark, range [0,255], default 186
   * @returns {boolean}
   * @public
   */
  isDarkColor( color, luminanceThreshold = 186 ) {
    assert && assert( typeof luminanceThreshold === 'number' && luminanceThreshold >= 0 && luminanceThreshold <= 255,
      'invalid luminanceThreshold' );
    return ( NaturalSelectionUtils.getLuminance( color ) < luminanceThreshold );
  },

  /**
   * Determines whether a color is 'light'.
   * @param {Color|string} color
   * @param {number} [luminanceThreshold] - colors with luminance >= this value are light, range [0,255], default 186
   * @returns {boolean}
   * @public
   */
  isLightColor( color, luminanceThreshold ) {
    return !NaturalSelectionUtils.isDarkColor( color, luminanceThreshold );
  },

  /**
   * Determines the time that it takes to execute a specified function.
   * @param {function} someFunction - a function with no parameters and no return value
   * @returns {number} the time to complete someFunction, in ms
   * @public
   */
  time( someFunction ) {
    const tBefore = performance.now();
    someFunction();
    return performance.now() - tBefore;
  },

  /**
   * Logs the time that it takes to execute a specified function.
   * For example, if you want to time this:
   *   this.step( dt );
   * Wrap it like this:
   *   logTime( 'step', () => this.step( dt ) );
   * Console output will look like this:
   *   step took 56.68500000001586 ms
   *
   * @param {string} name
   * @param {function} someFunction - a function with no parameters and no return value
   * @public
   */
  logTime( name, someFunction ) {
    console.log( `${name} took ${NaturalSelectionUtils.time( someFunction )} ms` );
  },

  /**
   * Determines whether an array is sorted in ascending order.
   * @param {number[]} array
   * @returns {boolean}
   * @public
   */
  isSorted( array ) {
    assert && assert( Array.isArray( array ), 'invalid array' );
    let isSorted = true;
    for ( let i = 1; i < array.length && isSorted; i++ ) {
      const item = array[ i ];
      assert && assert( typeof item === 'number', `item is not a number: ${item}` );
      isSorted = ( item >= array[ i - 1 ] );
    }
    return isSorted;
  },

  /**
   * Determines whether a value is a positive number.
   * @param {*} value
   * @returns {boolean}
   * @public
   */
  isPositive( value ) {
    return ( typeof value === 'number' && value > 0 );
  },

  /**
   * Determines whether a value is a non-negative number.
   * @param {*} value
   * @returns {boolean}
   * @public
   */
  isNonNegative( value ) {
    return ( typeof value === 'number' ) && ( value >= 0 );
  },

  //TODO cannot use Utils.isInteger because it fails assert for non-numbers
  /**
   * Determines what a value is an integer.
   * @param {*} value
   * @returns {boolean}
   */
  isInteger( value ) {
    return ( typeof value === 'number' ) && ( value % 1 === 0 );
  },

  /**
   * Determines whether a value is a positive integer.
   * @param {*} value
   * @returns {boolean}
   * @public
   */
  isPositiveInteger( value ) {
    return NaturalSelectionUtils.isPositive( value ) && NaturalSelectionUtils.isInteger( value );
  },

  /**
   * Determines whether a value is a non-negative integer.
   * @param {*} value
   * @returns {boolean}
   */
  isNonNegativeInteger( value ) {
    return NaturalSelectionUtils.isNonNegative( value ) && NaturalSelectionUtils.isInteger( value );
  },

  /**
   * Gets the next random double in a Range.
   * For min < max, the return value is between min (inclusive) and max (exclusive).
   * For min === max, the return value is min.
   * @param {Range} range
   * @returns {number}
   * @public
   */
  nextInRange( range ) {
    if ( range.min < range.max ) {
      return phet.joist.random.nextDoubleBetween( range.min, range.max );
    }
    else {
      // because random.nextDoubleBetween requires min < max
      return range.min;
    }
  }
};

naturalSelection.register( 'NaturalSelectionUtils', NaturalSelectionUtils );
export default NaturalSelectionUtils;