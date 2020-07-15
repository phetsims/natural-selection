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

// Cache containing all possible sprites used to render shrubs.
// The key is Shrub.category, as specified in https://github.com/phetsims/natural-selection/issues/17
const SHRUB_SPRITES_CACHE = {
  'A': {
    tenderSprite: new Sprite( new OrganismSpriteImage( shrubTenderAImage ) ),
    toughSprite: new Sprite( new OrganismSpriteImage( shrubToughAImage ) )
  },
  'B': {
    tenderSprite: new Sprite( new OrganismSpriteImage( shrubTenderBImage ) ),
    toughSprite: new Sprite( new OrganismSpriteImage( shrubToughBImage ) )
  },
  'C': {
    tenderSprite: new Sprite( new OrganismSpriteImage( shrubTenderCImage ) ),
    toughSprite: new Sprite( new OrganismSpriteImage( shrubToughCImage ) )
  }
};

class ShrubSpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Shrub} shrub
   * @param {boolean} isTough
   */
  constructor( shrub, isTough ) {

    // Choose the sprites for tender and tough food based on 'category'.
    const tenderSprite = SHRUB_SPRITES_CACHE[ shrub.category ].tenderSprite;
    const toughSprite = SHRUB_SPRITES_CACHE[ shrub.category ].toughSprite;

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
    const sprites = [];
    for ( const property in SHRUB_SPRITES_CACHE ) {
      sprites.push( SHRUB_SPRITES_CACHE[ property ].tenderSprite );
      sprites.push( SHRUB_SPRITES_CACHE[ property ].toughSprite );
    }
    return sprites;
  }
}

naturalSelection.register( 'ShrubSpriteInstance', ShrubSpriteInstance );
export default ShrubSpriteInstance;