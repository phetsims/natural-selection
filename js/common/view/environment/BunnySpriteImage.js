// Copyright 2020, University of Colorado Boulder

/**
 * BunnySpriteImage is a specialization of OrganismSpriteImage for bunnies that adds hit testing.
 * Hit testing based on pixels in the associated image, instead of the image bounds, makes it easier
 * to select a specific bunny in a large group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../../naturalSelection.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';

class BunnySpriteImage extends OrganismSpriteImage {

  /**
   * @param {HTMLImageElement} image
   */
  constructor( image ) {
    super( image, {
      pickable: true,
      hitTestPixels: true
    } );
  }
}

naturalSelection.register( 'BunnySpriteImage', BunnySpriteImage );
export default BunnySpriteImage;