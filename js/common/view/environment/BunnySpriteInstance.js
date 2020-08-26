// Copyright 2020, University of Colorado Boulder

/**
 * BunnySpriteInstance is a specialization of OrganismSpriteInstance for bunnies.
 * Each instance corresponds to a bunny in the model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sprite from '../../../../../scenery/js/util/Sprite.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

class BunnySpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Bunny} bunny
   * @param {Sprite} sprite
   */
  constructor( bunny, sprite ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( sprite instanceof Sprite, 'invalid sprite' );

    super( bunny, sprite, NaturalSelectionConstants.BUNNY_IMAGE_SCALE );
  }
}

naturalSelection.register( 'BunnySpriteInstance', BunnySpriteInstance );
export default BunnySpriteInstance;