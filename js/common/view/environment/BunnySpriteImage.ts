// Copyright 2020-2022, University of Colorado Boulder

/**
 * BunnySpriteImage is a specialization of OrganismSpriteImage for bunnies that adds hit testing.
 * Hit testing based on pixels in the associated image, instead of the image bounds, makes it easier
 * to select a specific bunny in a large group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../../naturalSelection.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';

export default class BunnySpriteImage extends OrganismSpriteImage {

  public constructor( image: HTMLImageElement ) {
    super( image, {
      pickable: true,
      hitTestPixels: true
    } );
  }
}

naturalSelection.register( 'BunnySpriteImage', BunnySpriteImage );