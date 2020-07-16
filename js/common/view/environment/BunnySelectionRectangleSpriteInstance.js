// Copyright 2020, University of Colorado Boulder

/**
 * BunnySelectionRectangleSpriteInstance is the sprite instance for the selection rectangle that surrounds the
 * selected bunny. It's associated with the selected bunny so that it tracks its position and direction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import BunnySelectionRectangleSprite from './BunnySelectionRectangleSprite.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

class BunnySelectionRectangleSpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Bunny} bunny
   * @param {BunnySelectionRectangleSprite} sprite
   */
  constructor( bunny, sprite ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( sprite instanceof BunnySelectionRectangleSprite, 'invalid sprite' );

    super( bunny, sprite, {
      baseScale: NaturalSelectionConstants.BUNNY_IMAGE_SCALE
    } );
  }
}

naturalSelection.register( 'BunnySelectionRectangleSpriteInstance', BunnySelectionRectangleSpriteInstance );
export default BunnySelectionRectangleSpriteInstance;