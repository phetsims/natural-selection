// Copyright 2020, University of Colorado Boulder

/**
 * BunnySelectionRectangleSprite is the sprite for the bunny selection rectangle.
 * It looks the same as the selection rectangle in the Pedigree graph.
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
   * @param {HTMLImageElement} maxImage - the largest bunny image
   */
  constructor( maxImage ) {

    assert && assert( maxImage instanceof HTMLImageElement, 'invalid maxImage' );
    assert && assert( maxImage.width > 0 && maxImage.height > 0, 'maxImage does not have valid dimensions' );

    // Make the selection rectangle a little larger than the bunny image
    const selectionRectangleBounds = new Bounds2( 0, 0, maxImage.width, maxImage.height )
      .dilated( SELECTION_RECTANGLE_DILATION );

    const selectionRectangle = new BunnySelectionRectangle( selectionRectangleBounds, {
      lineWidth: 5 // determined empirically, to match the lineWidth in Pedigree graph
    } );

    // Convert to {HTMLCanvasElement}, as required by Sprite
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