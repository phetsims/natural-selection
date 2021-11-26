// Copyright 2020, University of Colorado Boulder

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

class ShrubSpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Shrub} shrub
   * @param {boolean} isTough
   * @param {Sprite} tenderSprite
   * @param {Sprite} toughSprite
   */
  constructor( shrub, isTough, tenderSprite, toughSprite ) {

    assert && assert( shrub instanceof Shrub, 'invalid shrub' );
    assert && assert( typeof isTough === 'boolean', 'invalid isTough' );
    assert && assert( tenderSprite instanceof Sprite, 'invalid tenderSprite' );
    assert && assert( toughSprite instanceof Sprite, 'invalid toughSprite' );

    super( shrub, ( isTough ? toughSprite : tenderSprite ), NaturalSelectionConstants.SHRUB_IMAGE_SCALE );

    // @private
    this.tenderSprite = tenderSprite;
    this.toughSprite = toughSprite;
  }

  /**
   * Sets the appearance to correspond to tough or tender food.
   * @param {boolean} isTough
   * @public
   */
  setTough( isTough ) {
    assert && assert( typeof isTough === 'boolean', 'invalid isTough' );
    this.sprite = isTough ? this.toughSprite : this.tenderSprite;
  }
}

naturalSelection.register( 'ShrubSpriteInstance', ShrubSpriteInstance );
export default ShrubSpriteInstance;