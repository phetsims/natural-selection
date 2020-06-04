// Copyright 2020, University of Colorado Boulder

//TODO https://github.com/phetsims/natural-selection/issues/96 migrate to common?
/**
 * AssertUtils is a collection of utility functions for common assertions. Many of these assertions are related to
 * type-checking, useful in a weakly-typed language like JavaScript.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import naturalSelection from '../naturalSelection.js';

const AssertUtils = {

  /**
   * Asserts that a value is a Property, whose value satisfies an optional predicate.
   * @param {Property} property
   * @param {function(value:*):boolean} [predicate]
   * @public
   */
  assertPropertyPredicate( property, predicate ) {
    assert( property instanceof Property, 'property is not a Property' );
    if ( predicate ) {
      assert( predicate( property.value ), 'Property.value failed predicate' );
    }
  },

  /**
   * Asserts that a value is a Property, whose value is a specified primitive type.
   * @param {Property} property
   * @param {string} primitiveType
   * @public
   */
  assertPropertyTypeof( property, primitiveType ) {
    AssertUtils.assertPropertyPredicate( property, value => typeof value === primitiveType );
  },

  /**
   * Asserts that a value is a Property, whose value is an instance of a specified Object type.
   * @param {Property} property
   * @param {constructor} objectType
   * @public
   */
  assertPropertyInstanceof( property, objectType ) {
    AssertUtils.assertPropertyPredicate( property, value => value instanceof objectType );
  },

  /**
   * Asserts that a value is an integer that satisfies an optional predicate.
   * @param {number} value
   * @param {function(number):boolean} [predicate]
   * @returns {boolean}
   * @public
   */
  assertInteger( value, predicate ) {
    assert && assert( typeof value === 'number' && Utils.isInteger( value ), 'invalid value' );
    if ( predicate ) {
      assert && assert( predicate( value ), `value does not satisfy predicate: ${value}` );
    }
  },

  /**
   * Asserts that a value is a positive integer.
   * @param {number} value
   * @returns {boolean}
   * @public
   */
  assertPositiveInteger( value ) {
    AssertUtils.assertInteger( value, value => value > 0 );
  },

  /**
   * Asserts that a value is a Range, whose value is between min and max, inclusive.
   * @param {Range} range
   * @param {number} min
   * @param {number} max
   * @public
   */
  assertRangeBetween( range, min, max ) {
    assert && assert( range instanceof Range, 'invalid range' );
    assert && assert( range.min >= min && range.max <= max, `invalid range: ${range}` );
  }
};

naturalSelection.register( 'AssertUtils', AssertUtils );
export default AssertUtils;