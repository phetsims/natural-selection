// Copyright 2020, University of Colorado Boulder

/**
 * OrganismSpriteImage is a specialization of SpriteImage for Organisms (bunnies, wolves, shrubs).
 * All organism images have their origin at the bottom-center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import { SpriteImage } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';

class OrganismSpriteImage extends SpriteImage {

  /**
   * @param {HTMLImageElement} image
   * @param {Object} [options]
   */
  constructor( image, options ) {

    assert && assert( image instanceof HTMLImageElement, 'invalid image' );
    assert && assert( image.width > 0 && image.height > 0, 'image does not have valid dimensions' );

    options = merge( {
      pickable: false,
      mipmap: true
    }, options );

    // Origin at bottom-center
    const offset = new Vector2( image.width / 2, image.height );

    super( image, offset, options );
  }
}

naturalSelection.register( 'OrganismSpriteImage', OrganismSpriteImage );
export default OrganismSpriteImage;