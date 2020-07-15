// Copyright 2020, University of Colorado Boulder

/**
 * OrganismSpriteImage is a specialization of SpriteImage for Organisms (bunnies, wolves, food).
 * All organism images have their origin at the bottom-center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import SpriteImage from '../../../../../scenery/js/util/SpriteImage.js';
import naturalSelection from '../../../naturalSelection.js';

class OrganismSpriteImage extends SpriteImage {

  /**
   * @param {HTMLImageElement} image
   * @param {Object} [options]
   */
  constructor( image, options ) {

    assert && assert( image instanceof HTMLImageElement, 'invalid image' );

    options = merge( {
      pickable: false
    }, options );

    //TODO #128 offset is wrong, image does not have valid dimensions yet
    super( image, new Vector2( image.width / 2, image.height ), options );
  }
}

naturalSelection.register( 'OrganismSpriteImage', OrganismSpriteImage );
export default OrganismSpriteImage;