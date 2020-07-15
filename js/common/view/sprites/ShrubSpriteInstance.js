// Copyright 2020, University of Colorado Boulder

//TODO add sprites for 'B' and 'C' shrub images
/**
 * ShrubSpriteInstance is a specialization of OrganismSpriteInstance for shrubs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sprite from '../../../../../scenery/js/util/Sprite.js';
import shrubTenderAImage from '../../../../images/shrub-tender-A_png.js';
import shrubToughAImage from '../../../../images/shrub-tough-A_png.js';
import naturalSelection from '../../../naturalSelection.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

// constants
const SHRUB_TENDER_SPRITE = new Sprite( new OrganismSpriteImage( shrubTenderAImage ) );
const SHRUB_TOUGH_SPRITE = new Sprite( new OrganismSpriteImage( shrubToughAImage ) );

class ShrubSpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Shrub} shrub
   */
  constructor( shrub ) {
    super( shrub, shrub.isToughProperty.value ? SHRUB_TOUGH_SPRITE : SHRUB_TENDER_SPRITE );
  }

  /**
   * Gets the sprites used for shrubs.
   * @returns {Sprite[]}
   * @public
   */
  static getSprites() {
    return [ SHRUB_TENDER_SPRITE, SHRUB_TOUGH_SPRITE ];
  }
}

ShrubSpriteInstance.SHRUB_TENDER_SPRITE = SHRUB_TENDER_SPRITE;
ShrubSpriteInstance.SHRUB_TOUGH_SPRITE = SHRUB_TOUGH_SPRITE;

naturalSelection.register( 'ShrubSpriteInstance', ShrubSpriteInstance );
export default ShrubSpriteInstance;