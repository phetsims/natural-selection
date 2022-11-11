// Copyright 2020-2022, University of Colorado Boulder

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

export default class WolfSpriteInstance extends OrganismSpriteInstance {

  public constructor( wolf: Wolf, sprite: Sprite ) {
    super( wolf, sprite, NaturalSelectionConstants.WOLF_IMAGE_SCALE );
  }
}

naturalSelection.register( 'WolfSpriteInstance', WolfSpriteInstance );