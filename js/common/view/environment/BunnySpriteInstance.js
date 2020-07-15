// Copyright 2020, University of Colorado Boulder

/**
 * BunnySpriteInstance is a specialization of OrganismSpriteInstance for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sprite from '../../../../../scenery/js/util/Sprite.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

class BunnySpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Bunny} bunny
   * @param {Sprite} sprite
   */
  constructor( bunny, sprite ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( sprite instanceof Sprite, 'invalid sprite' );

    super( bunny, sprite, {
      baseScale: 0.4
    } );

    // @public (read-only)
    this.bunny = bunny;
  }
}

naturalSelection.register( 'BunnySpriteInstance', BunnySpriteInstance );
export default BunnySpriteInstance;