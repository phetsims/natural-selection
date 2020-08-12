// Copyright 2020, University of Colorado Boulder

/**
 * ShrubSpritesMap maps categories of shrubs (defined in Shrub.CATEGORIES) to their Sprites for tough and tender food.
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
import Shrub from '../../model/Shrub.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';

class ShrubSpritesMap {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @private
    this.spritesMap = {

      // category: value
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
    assert && assert( _.every( _.keys( this.spritesMap ), key => Shrub.CATEGORIES.includes( key ) ),
      'invalid key in shrubSpritesMap' );
  }

  /**
   * Gets the complete set of Sprites related to shrubs.
   * @returns {Sprite[]}
   * @public
   */
  getSprites() {
    const sprites = [];
    for ( const key in this.spritesMap ) {
      sprites.push( this.spritesMap[ key ].tenderSprite );
      sprites.push( this.spritesMap[ key ].toughSprite );
    }
    return sprites;
  }

  /**
   * Gets the sprite used for tender shrubs for a specified category.
   * @param {string} category - see see Shrub.CATEGORIES
   * @returns {Sprite}
   * @public
   */
  getTenderSprite( category ) {
    assert && assert( Shrub.CATEGORIES.includes( category ), `invalid category: ${category}` );
    return this.spritesMap[ category ].tenderSprite;
  }

  /**
   * Gets the sprite used for tough shrubs for a specified category.
   * @param {string} category - see Shrub.CATEGORIES
   * @returns {Sprite}
   * @public
   */
  getToughSprite( category ) {
    assert && assert( Shrub.CATEGORIES.includes( category ), `invalid category: ${category}` );
    return this.spritesMap[ category ].toughSprite;
  }
}

naturalSelection.register( 'ShrubSpritesMap', ShrubSpritesMap );
export default ShrubSpritesMap;