// Copyright 2020, University of Colorado Boulder

/**
 * WolfSpriteInstance is a specialization of OrganismSpriteInstance for wolves.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sprite from '../../../../../scenery/js/util/Sprite.js';
import wolfImage from '../../../../images/wolf_png.js';
import naturalSelection from '../../../naturalSelection.js';
import Wolf from '../../model/Wolf.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

// constants
const WOLF_SPRITE = new Sprite( new OrganismSpriteImage( wolfImage ) );

class WolfSpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Wolf} wolf
   */
  constructor( wolf ) {
    assert && assert( wolf instanceof Wolf, 'invalid wolf' );
    super( wolf, WOLF_SPRITE, {
      baseScale: 0.25
    } );
  }

  /**
   * Gets the sprites used for wolves.
   * @returns {Sprite[]}
   * @public
   */
  static getSprites() {
    return [ WOLF_SPRITE ];
  }
}

naturalSelection.register( 'WolfSpriteInstance', WolfSpriteInstance );
export default WolfSpriteInstance;