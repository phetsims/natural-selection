// Copyright 2020, University of Colorado Boulder

/**
 * XDirection is the direction that an Organism (bunny, wolf) is facing along the x axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const XDirection = Enumeration.byKeys( [ 'LEFT', 'RIGHT' ], {

  // {function(Enumeration)} Called before the enumeration is frozen.
  beforeFreeze: XDirection => {

    /**
     * Gets a random enumeration value.
     * @returns {XDirection}
     * @public
     * @static
     */
    XDirection.getRandom = () => phet.joist.random.nextBoolean() ? XDirection.RIGHT : XDirection.LEFT;

    /**
     * Provides the opposite direction.
     * @param {XDirection} direction
     * @returns {XDirection}
     * @public
     * @static
     */
    XDirection.opposite = direction =>
      ( direction === XDirection.RIGHT ) ? XDirection.LEFT : XDirection.RIGHT;

    /**
     * Converts a XDirection to a sign, relative to the x axis. Used to set the sign of the x-scale, which will
     * reflect the organism about the y axis, making it appear to face in the desired direction. This assumes that the
     * default direction for all organisms is XDirection.RIGHT. For example, this means that all bunny PNG files
     * were drawn with the bunny facing right.
     * @param {XDirection} direction
     * @returns {number}
     * @public
     * @static
     */
    XDirection.toSign = direction => ( direction === XDirection.RIGHT ) ? 1 : -1;
  }
} );

naturalSelection.register( 'XDirection', XDirection );
export default XDirection;