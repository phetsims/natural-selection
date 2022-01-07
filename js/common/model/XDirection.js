// Copyright 2020-2022, University of Colorado Boulder

/**
 * XDirection is the direction that an Organism (bunny, wolf, shrub) is facing along the x axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import naturalSelection from '../../naturalSelection.js';

const XDirection = EnumerationDeprecated.byKeys( [ 'LEFT', 'RIGHT' ], {

  // {function(Enumeration)} Called before the enumeration is frozen.
  beforeFreeze: XDirection => {

    /**
     * Gets a random enumeration value.
     * @returns {XDirection}
     * @public
     * @static
     */
    XDirection.getRandom = () => dotRandom.nextBoolean() ? XDirection.RIGHT : XDirection.LEFT;

    /**
     * Provides the opposite direction.
     * @param {XDirection} xDirection
     * @returns {XDirection}
     * @public
     * @static
     */
    XDirection.opposite = xDirection =>
      ( xDirection === XDirection.RIGHT ) ? XDirection.LEFT : XDirection.RIGHT;

    /**
     * Converts an XDirection to a sign, relative to the x axis. Used to set the sign of the view's x scale, which will
     * reflect the organism about the y axis, making it appear to face in the desired direction. This assumes that the
     * default x direction for all organisms is XDirection.RIGHT. For example, this means that all bunny PNG files
     * were drawn with the bunny facing right.
     * @param {XDirection} xDirection
     * @returns {number}
     * @public
     * @static
     */
    XDirection.toSign = xDirection => ( xDirection === XDirection.RIGHT ) ? 1 : -1;
  }
} );

naturalSelection.register( 'XDirection', XDirection );
export default XDirection;