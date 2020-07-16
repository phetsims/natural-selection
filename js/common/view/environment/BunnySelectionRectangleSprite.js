// Copyright 2020, University of Colorado Boulder

/**
 * BunnySelectionRectangleSprite is the sprite for the bunny selection rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Sprite from '../../../../../scenery/js/util/Sprite.js';
import SpriteImage from '../../../../../scenery/js/util/SpriteImage.js';
import naturalSelection from '../../../naturalSelection.js';
import BunnySelectionRectangle from '../BunnySelectionRectangle.js';

// constants
const SELECTION_RECTANGLE_DILATION = 8;

class BunnySelectionRectangleSprite extends Sprite {

  /**
   * @param {Bounds2} maxBunnyBounds
   * @param {Object} [options]
   */
  constructor( maxBunnyBounds, options ) {

    assert && assert( maxBunnyBounds instanceof Bounds2, 'invalid maxBunnyBounds' );

    const selectionRectangleBounds = maxBunnyBounds.dilated( SELECTION_RECTANGLE_DILATION );
    const selectionRectangle = new BunnySelectionRectangle( selectionRectangleBounds, {
      lineWidth: 5
    } );
    let selectionRectangleSpriteImage = null;
    selectionRectangle.toCanvas( canvas => {
      const offset = new Vector2( selectionRectangleBounds.width / 2, selectionRectangleBounds.height - SELECTION_RECTANGLE_DILATION );
      selectionRectangleSpriteImage = new SpriteImage( canvas, offset, { pickable: false } );
    } );

    super( selectionRectangleSpriteImage );
  }
}

naturalSelection.register( 'BunnySelectionRectangleSprite', BunnySelectionRectangleSprite );
export default BunnySelectionRectangleSprite;