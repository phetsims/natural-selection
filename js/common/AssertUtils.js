// Copyright 2020, University of Colorado Boulder

//TODO https://github.com/phetsims/natural-selection/issues/96 migrate to common?
/**
 * AssertUtils defines utility functions that are specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import naturalSelection from '../naturalSelection.js';

const AssertUtils = {

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
    AssertUtils.assertPropertyPredicate( object, value => typeof value === type );
  },

  /**
   * Asserts that an object is a Property whose value is an instance of a specific class.
   * Used for type-checking of method arguments.
   * @param {*} object
   * @param {constructor} type
   * @public
   */
  assertPropertyInstanceof( object, type ) {
    AssertUtils.assertPropertyPredicate( object, value => value instanceof type );
  },

  /**
   * Asserts that a range meets min/max criteria.
   * @param {Range} range
   * @param {number} min
   * @param {number} max
   * @public
   */
  assertRangeInclusive( range, min, max ) {
    assert && assert( range instanceof Range, 'invalid range' );
    assert && assert( range.min >= min && range.max <= max, `invalid range: ${range}` );
  },

  /**
   * Asserts that a value is an integer that satisfies an optional predicate.
   * @param {*} value
   * @param {function(number):boolean} [predicate]
   * @returns {boolean}
   * @public
   */
  assertInteger( value, predicate ) {
    assert && assert( typeof value === 'number' && Utils.isInteger( value ) );
    if ( assert && predicate ) {
      assert( predicate( value ), `value does not satisfy predicate: ${value}` );
    }
  },

  /**
   * Asserts that a value is a positive integer.
   * @param {*} value
   * @returns {boolean}
   * @public
   */
  assertPositiveInteger( value ) {
    AssertUtils.assertInteger( value, value => value > 0 );
  }
};

naturalSelection.register( 'AssertUtils', AssertUtils );
export default AssertUtils;