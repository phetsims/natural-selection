// Copyright 2020, University of Colorado Boulder

/**
 * ShrubSpriteInstance is a specialization of OrganismSpriteInstance for shrubs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sprite from '../../../../../scenery/js/util/Sprite.js';
import shrubTenderAImage from '../../../../images/shrub-tender-A_png.js';
import shrubTenderBImage from '../../../../images/shrub-tender-B_png.js';
import shrubTenderCImage from '../../../../images/shrub-tender-C_png.js';
import shrubToughAImage from '../../../../images/shrub-tough-A_png.js';
import shrubToughBImage from '../../../../images/shrub-tough-B_png.js';
import shrubToughCImage from '../../../../images/shrub-tough-C_png.js';
import naturalSelection from '../../../naturalSelection.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

// constants
const SHRUB_TENDER_A_SPRITE = new Sprite( new OrganismSpriteImage( shrubTenderAImage ) );
const SHRUB_TOUGH_A_SPRITE = new Sprite( new OrganismSpriteImage( shrubToughAImage ) );
const SHRUB_TENDER_B_SPRITE = new Sprite( new OrganismSpriteImage( shrubTenderBImage ) );
const SHRUB_TOUGH_B_SPRITE = new Sprite( new OrganismSpriteImage( shrubToughBImage ) );
const SHRUB_TENDER_C_SPRITE = new Sprite( new OrganismSpriteImage( shrubTenderCImage ) );
const SHRUB_TOUGH_C_SPRITE = new Sprite( new OrganismSpriteImage( shrubToughCImage ) );

class ShrubSpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Shrub} shrub
   * @param {boolean} isTough
   */
  constructor( shrub, isTough ) {

    // Choose the sprites for tender and tough food based on 'category'.
    let tenderSprite = null;
    let toughSprite = null;
    if ( shrub.category === 'A' ) {
      tenderSprite = SHRUB_TENDER_A_SPRITE;
      toughSprite = SHRUB_TOUGH_A_SPRITE;
    }
    else if ( shrub.category === 'B' ) {
      tenderSprite = SHRUB_TENDER_B_SPRITE;
      toughSprite = SHRUB_TOUGH_B_SPRITE;
    }
    else if ( shrub.category === 'C' ) {
      tenderSprite = SHRUB_TENDER_C_SPRITE;
      toughSprite = SHRUB_TOUGH_C_SPRITE;
    }
    else {
      throw new Error( `invalid shrub category: ${shrub.category}` );
    }

    super( shrub, isTough ? toughSprite : tenderSprite );

    // @private
    this.tenderSprite = tenderSprite;
    this.toughSprite = toughSprite;
  }

  //TODO #128 origin does not remain at bottom-center, moves around when SpriteImage is changed
  /**
   * Sets the appearance of to correspond to tough or tender food.
   * @param {boolean} isTough
   * @public
   */
  setTough( isTough ) {
    this.sprite = isTough ? this.toughSprite : this.tenderSprite;
  }

  /**
   * Gets the sprites used for shrubs.
   * @returns {Sprite[]}
   * @public
   */
  static getSprites() {
    return [
      SHRUB_TENDER_A_SPRITE, SHRUB_TOUGH_A_SPRITE,
      SHRUB_TENDER_B_SPRITE, SHRUB_TOUGH_B_SPRITE,
      SHRUB_TENDER_C_SPRITE, SHRUB_TOUGH_C_SPRITE
    ];
  }
}

naturalSelection.register( 'ShrubSpriteInstance', ShrubSpriteInstance );
export default ShrubSpriteInstance;