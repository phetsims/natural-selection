// Copyright 2020-2021, University of Colorado Boulder

/**
 * WolfSpriteInstance is a specialization of OrganismSpriteInstance for wolves.
 * Each instance corresponds to a wolf in the model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Sprite } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Wolf from '../../model/Wolf.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

class WolfSpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Wolf} wolf
   * @param {Sprite} sprite
   */
  constructor( wolf, sprite ) {

    assert && assert( wolf instanceof Wolf, 'invalid wolf' );
    assert && assert( sprite instanceof Sprite, 'invalid sprite' );

    super( wolf, sprite, NaturalSelectionConstants.WOLF_IMAGE_SCALE );
  }
}

naturalSelection.register( 'WolfSpriteInstance', WolfSpriteInstance );
export default WolfSpriteInstance;