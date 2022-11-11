// Copyright 2020-2022, University of Colorado Boulder

/**
 * ShrubSpriteInstance is a specialization of OrganismSpriteInstance for shrubs.
 * Each instance corresponds to a shrub in the model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Sprite } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Shrub from '../../model/Shrub.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

export default class ShrubSpriteInstance extends OrganismSpriteInstance {

  private readonly tenderSprite: Sprite;
  private readonly toughSprite: Sprite;

  public constructor( shrub: Shrub, isTough: boolean, tenderSprite: Sprite, toughSprite: Sprite ) {

    super( shrub, ( isTough ? toughSprite : tenderSprite ), NaturalSelectionConstants.SHRUB_IMAGE_SCALE );

    this.tenderSprite = tenderSprite;
    this.toughSprite = toughSprite;
  }

  /**
   * Sets the appearance to correspond to tough or tender food.
   */
  public setTough( isTough: boolean ): void {
    this.sprite = isTough ? this.toughSprite : this.tenderSprite;
  }
}

naturalSelection.register( 'ShrubSpriteInstance', ShrubSpriteInstance );