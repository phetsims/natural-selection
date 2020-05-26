// Copyright 2019-2020, University of Colorado Boulder

//TODO should any of these be migrated to common?
/**
 * NaturalSelectionUtils defines utility functions that are specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Utils from '../../../dot/js/Utils.js';
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
   */
  logTime( name, someFunction ) {
    console.log( `${name} took ${NaturalSelectionUtils.time( someFunction )} ms` );
  },

  /**
   * Determines whether an array is sorted in ascending order.
   * @param {number[]} array
   * @returns {boolean}
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
   * Determines whether a value is a positive integer.
   * @param {*} value
   * @returns {boolean}
   */
  isPositiveInteger( value ) {
    return ( typeof value === 'number' && Utils.isInteger( value ) && value > 0 );
  },

  /**
   * Asserts that an object is a Property whose value satisfies a specified predicate.
   * Used for type-checking of method arguments.
   * @param {*} object
   * @param {function(value:*):boolean} predicate
   * @public
   */
  assertPropertyPredicate( object, predicate ) {
    assert( object instanceof Property, 'object is not a Property' );
    assert( predicate( object.value ), 'Property.value failed predicate' );
  },

  /**
   * Asserts that an object is a Property whose value is a specified primitive type.
   * Used for type-checking of method arguments.
   * @param {*} object
   * @param {string} type
   * @public
   */
  assertPropertyTypeof( object, type ) {
    NaturalSelectionUtils.assertPropertyPredicate( object, value => typeof value === type );
  },

  /**
   * Asserts that an object is a Property whose value is an instance of a specific class.
   * Used for type-checking of method arguments.
   * @param {*} object
   * @param {constructor} type
   * @public
   */
  assertPropertyInstanceof( object, type ) {
    NaturalSelectionUtils.assertPropertyPredicate( object, value => value instanceof type );
  },

  /**
   * Asserts that a value is a valid generation number.
   * @param {*} value
   * @public
   */
  assertGeneration( value ) {
    assert && assert( typeof value === 'number' && Utils.isInteger( value ) && value >= 0, `invalid generation: ${value}` );
  },

  /**
   * Asserts that a value is a valid count of bunnies.
   * @param {*} value
   * @public
   */
  assertCount( value ) {
    assert && assert( typeof value === 'number' && Utils.isInteger( value ) && value >= 0, `invalid count: ${value}` );
  },

  /**
   * Gets the next random double in a Range.
   * @param {Range} range
   * @returns {number}
   */
  nextInRange( range ) {
    if ( range.min === range.max ) {
      return range.max;
    }
    else {
      return phet.joist.random.nextDoubleBetween( range.min, range.max );
    }
  }
};

naturalSelection.register( 'NaturalSelectionUtils', NaturalSelectionUtils );
export default NaturalSelectionUtils;