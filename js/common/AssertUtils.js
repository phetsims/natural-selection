// Copyright 2020, University of Colorado Boulder

//TODO https://github.com/phetsims/natural-selection/issues/96 migrate to common?
/**
 * AssertUtils is a collection of utility functions for common assertions. Many of these assertions are related to
 * type-checking, useful in a weakly-typed language like JavaScript.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArray from '../../../axon/js/ObservableArray.js';
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
  assertProperty( property, predicate ) {
    assert( property instanceof Property, 'property is not a Property' );
    if ( predicate ) {
      assert( predicate( property.value ), 'Property.value failed predicate' );
    }
  },

  /**
   * Asserts that a value is a Property, whose value is a specified primitive type.
   * @param {Property} property
   * @param {constructor|string} type
   * @public
   */
  assertPropertyOf( property, type ) {
    if ( typeof type === 'string' ) {
      AssertUtils.assertProperty( property, value => typeof value === type );
    }
    else {
      AssertUtils.assertProperty( property, value => value instanceof type );
    }
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
  },

  /**
   * Asserts that a value is an Array, with elements of a specific type.
   * @param {Array} array
   * @param {constructor|string} type
   */
  assertArrayOf( array, type ) {
    assert && assert( Array.isArray( array ), 'array is not an Array' );
    if ( assert ) {
      if ( typeof type === 'string' ) {
        assert && assert( _.every( array, element => typeof element === type ), 'array contains an invalid element' );
      }
      else {
        assert && assert( _.every( array, element => element instanceof type ), 'array contains an invalid element' );
      }
    }
  },

  /**
   * Asserts that a value is an ObservableArray, with elements of a specific type.
   * @param {ObservableArray} observableArray
   * @param {constructor|string} type
   */
  assertObservableArrayOf( observableArray, type ) {
    assert && assert( observableArray instanceof ObservableArray, 'array is not an ObservableArray' );
    assert && AssertUtils.assertArrayOf( observableArray.getArray(), type );
  }
};

naturalSelection.register( 'AssertUtils', AssertUtils );
export default AssertUtils;