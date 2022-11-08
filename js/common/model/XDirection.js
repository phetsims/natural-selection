// Copyright 2020-2022, University of Colorado Boulder

/**
 * XDirection is the direction that an Organism (bunny, wolf, shrub) is facing along the x axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import naturalSelection from '../../naturalSelection.js';

export default class XDirection extends EnumerationValue {

  static LEFT = new XDirection();
  static RIGHT = new XDirection();

  static enumeration = new Enumeration( XDirection );

  /**
   * Gets a random enumeration value.
   * @returns {XDirection}
   * @public
   */
  static getRandom() {
    return dotRandom.nextBoolean() ? XDirection.RIGHT : XDirection.LEFT;
  }

  /**
   * Provides the opposite direction.
   * @param {XDirection} xDirection
   * @returns {XDirection}
   * @public
   */
  static opposite( xDirection ) {
    return ( xDirection === XDirection.RIGHT ) ? XDirection.LEFT : XDirection.RIGHT;
  }

  /**
   * Converts an XDirection to a sign, relative to the x axis. Used to set the sign of the view's x scale, which will
   * reflect the organism about the y axis, making it appear to face in the desired direction. This assumes that the
   * default x direction for all organisms is XDirection.RIGHT. For example, this means that all bunny PNG files
   * were drawn with the bunny facing right.
   * @param {XDirection} xDirection
   * @returns {number}
   * @public
   */
  static toSign( xDirection ) {
    return ( xDirection === XDirection.RIGHT ) ? 1 : -1;
  }
}

naturalSelection.register( 'XDirection', XDirection );