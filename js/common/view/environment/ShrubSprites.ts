// Copyright 2020-2022, University of Colorado Boulder

/**
 * ShrubSprites manages the Sprites used for tough and tender food.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Sprite } from '../../../../../scenery/js/imports.js';
import tenderShrub1_png from '../../../../images/tenderShrub1_png.js';
import tenderShrub2_png from '../../../../images/tenderShrub2_png.js';
import tenderShrub3_png from '../../../../images/tenderShrub3_png.js';
import toughShrub1_png from '../../../../images/toughShrub1_png.js';
import toughShrub2_png from '../../../../images/toughShrub2_png.js';
import toughShrub3_png from '../../../../images/toughShrub3_png.js';
import naturalSelection from '../../../naturalSelection.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';

export default class ShrubSprites {

  private readonly tenderSprites: Sprite[]; // sprites for tender food
  private tenderSpritesIndex: number; // index of the next sprite to use for tender food

  private readonly toughSprites: Sprite[]; // sprites for tough food
  private toughSpritesIndex: number; // index of the next sprite to use for tough food

  public constructor() {

    this.tenderSprites = [
      new Sprite( new OrganismSpriteImage( tenderShrub1_png ) ),
      new Sprite( new OrganismSpriteImage( tenderShrub2_png ) ),
      new Sprite( new OrganismSpriteImage( tenderShrub3_png ) )
    ];

    this.tenderSpritesIndex = 0;

    this.toughSprites = [
      new Sprite( new OrganismSpriteImage( toughShrub1_png ) ),
      new Sprite( new OrganismSpriteImage( toughShrub2_png ) ),
      new Sprite( new OrganismSpriteImage( toughShrub3_png ) )
    ];

    this.toughSpritesIndex = 0;
  }

  /**
   * Gets the complete set of Sprites related to shrubs.
   */
  public getSprites(): Sprite[] {
    return this.tenderSprites.concat( this.toughSprites );
  }

  /**
   * Gets the next sprite to use for tender shrubs.
   */
  public getNextTenderSprite(): Sprite {
    const sprite = this.tenderSprites[ this.tenderSpritesIndex++ ];
    if ( this.tenderSpritesIndex >= this.tenderSprites.length ) {
      this.tenderSpritesIndex = 0;
    }
    return sprite;
  }

  /**
   * Gets the next sprite to use for tough shrubs.
   */
  public getNextToughSprite(): Sprite {
    const sprite = this.toughSprites[ this.toughSpritesIndex++ ];
    if ( this.toughSpritesIndex >= this.toughSprites.length ) {
      this.toughSpritesIndex = 0;
    }
    return sprite;
  }
}

naturalSelection.register( 'ShrubSprites', ShrubSprites );