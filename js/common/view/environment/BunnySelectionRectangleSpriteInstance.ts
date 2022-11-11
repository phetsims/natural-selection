// Copyright 2020-2022, University of Colorado Boulder

/**
 * BunnySelectionRectangleSpriteInstance is the sprite instance for the selection rectangle that surrounds the
 * selected bunny. When a bunny is selected, OrganismSprites creates an instance of BunnySelectionRectangleSpriteInstance
 * and associates it with the selected bunny so that it tracks its position and direction. (Think of it as another view
 * of the selected bunny.) OrganismSprites also handles putting the selection rectangle behind the selected bunny in
 * the rendering order.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import BunnySelectionRectangleSprite from './BunnySelectionRectangleSprite.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

export default class BunnySelectionRectangleSpriteInstance extends OrganismSpriteInstance {

  public constructor( bunny: Bunny, sprite: BunnySelectionRectangleSprite ) {
    super( bunny, sprite, NaturalSelectionConstants.BUNNY_IMAGE_SCALE );
  }
}

naturalSelection.register( 'BunnySelectionRectangleSpriteInstance', BunnySelectionRectangleSpriteInstance );