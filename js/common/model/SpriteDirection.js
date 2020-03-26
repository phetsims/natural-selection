// Copyright 2020, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

/**
 * SpriteDirection is the direction that a Sprite is facing.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const SpriteDirection = Enumeration.byKeys( [ 'LEFT', 'RIGHT' ] );

naturalSelection.register( 'SpriteDirection', SpriteDirection );
export default SpriteDirection;