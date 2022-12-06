// Copyright 2020-2022, University of Colorado Boulder

/**
 * BunnySpriteInstance is a specialization of OrganismSpriteInstance for bunnies.
 * Each instance corresponds to a bunny in the model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Sprite } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

export default class BunnySpriteInstance extends OrganismSpriteInstance {

  public readonly bunny: Bunny;

  public constructor( bunny: Bunny, sprite: Sprite ) {
    super( bunny, sprite, NaturalSelectionConstants.BUNNY_IMAGE_SCALE );
    this.bunny = bunny;
  }
}

naturalSelection.register( 'BunnySpriteInstance', BunnySpriteInstance );