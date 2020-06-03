// Copyright 2020, University of Colorado Boulder

//TODO https://github.com/phetsims/natural-selection/issues/96 migrate to common?
/**
 * AssertUtils defines utility functions that are specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
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
   */
  assertRangeInclusive( range, min, max ) {
    assert && assert( range.min >= min && range.max <= max, `invalid range: ${range}` );
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
  }
};

naturalSelection.register( 'AssertUtils', AssertUtils );
export default AssertUtils;