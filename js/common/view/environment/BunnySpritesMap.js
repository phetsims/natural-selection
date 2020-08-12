// Copyright 2020, University of Colorado Boulder

/**
 * BunnySpritesMap maps a bunny to a Sprite, based on the bunny's phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sprite from '../../../../../scenery/js/util/Sprite.js';
import bunnyBrownFurFloppyEarsLongTeethImage from '../../../../images/bunny-brownFur-floppyEars-longTeeth_png.js';
import bunnyBrownFurFloppyEarsShortTeethImage from '../../../../images/bunny-brownFur-floppyEars-shortTeeth_png.js';
import bunnyBrownFurStraightEarsLongTeethImage from '../../../../images/bunny-brownFur-straightEars-longTeeth_png.js';
import bunnyBrownFurStraightEarsShortTeethImage from '../../../../images/bunny-brownFur-straightEars-shortTeeth_png.js';
import bunnyWhiteFurFloppyEarsLongTeethImage from '../../../../images/bunny-whiteFur-floppyEars-longTeeth_png.js';
import bunnyWhiteFurFloppyEarsShortTeethImage from '../../../../images/bunny-whiteFur-floppyEars-shortTeeth_png.js';
import bunnyWhiteFurStraightEarsLongTeethImage from '../../../../images/bunny-whiteFur-straightEars-longTeeth_png.js';
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import BunnySpriteImage from './BunnySpriteImage.js';

class BunnySpritesMap {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @private
    // Sprites for each possible bunny phenotype. Maps a phenotype key to an Image instance. The phenotype key pattern
    // is '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}', where the value for each placeholder is 'true' or
    // 'false'. See getSprite for how the key is assembled.
    this.spritesMap = {

      // key: value
      'true-true-true': new Sprite( new BunnySpriteImage( bunnyWhiteFurStraightEarsShortTeethImage ) ),
      'true-true-false': new Sprite( new BunnySpriteImage( bunnyWhiteFurStraightEarsLongTeethImage ) ),
      'true-false-true': new Sprite( new BunnySpriteImage( bunnyWhiteFurFloppyEarsShortTeethImage ) ),
      'true-false-false': new Sprite( new BunnySpriteImage( bunnyWhiteFurFloppyEarsLongTeethImage ) ),
      'false-true-true': new Sprite( new BunnySpriteImage( bunnyBrownFurStraightEarsShortTeethImage ) ),
      'false-true-false': new Sprite( new BunnySpriteImage( bunnyBrownFurStraightEarsLongTeethImage ) ),
      'false-false-true': new Sprite( new BunnySpriteImage( bunnyBrownFurFloppyEarsShortTeethImage ) ),
      'false-false-false': new Sprite( new BunnySpriteImage( bunnyBrownFurFloppyEarsLongTeethImage ) )
    };
  }

  /**
   * Gets the complete set of Sprites for all bunny phenotypes.
   * @returns {Sprite[]}
   * @public
   */
  getSprites() {
    const sprites = [];
    for ( const key in this.spritesMap ) {
      sprites.push( this.spritesMap[ key ] );
    }
    return sprites;
  }

  /**
   * Gets the Sprite that matches a bunny's phenotype. Instead of a big if-then-else statement for each permutation
   * of gene type, this implementation converts the phenotype to a string key, and maps that key to a Sprite.
   * @param {Bunny} bunny
   * @returns {Sprite}
   * @public
   */
  getSprite( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    // Create the key by inspecting the phenotype.
    const key = `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;

    // Look up the image in the map.
    const sprite = this.spritesMap[ key ];
    assert && assert( sprite, `no sprite found for key ${key}` );

    return sprite;
  }
}

naturalSelection.register( 'BunnySpritesMap', BunnySpritesMap );
export default BunnySpritesMap;