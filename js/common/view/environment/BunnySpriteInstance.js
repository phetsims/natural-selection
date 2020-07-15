// Copyright 2020, University of Colorado Boulder

/**
 * BunnySpriteInstance is a specialization of OrganismSpriteInstance for bunnies.
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
import OrganismSpriteInstance from './OrganismSpriteInstance.js';

// Cache of Sprites for each possible bunny phenotype. The cache is a map, which maps phenotype key to an Image
// instance. The phenotype key pattern is '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}', where the value
// for each placeholder is 'true' or 'false'. See getBunnySprite for how the key is assembled.
const BUNNY_SPRITES_CACHE = {
  'true-true-true': new Sprite( new BunnySpriteImage( bunnyWhiteFurStraightEarsShortTeethImage ) ),
  'true-true-false': new Sprite( new BunnySpriteImage( bunnyWhiteFurStraightEarsLongTeethImage ) ),
  'true-false-true': new Sprite( new BunnySpriteImage( bunnyWhiteFurFloppyEarsShortTeethImage ) ),
  'true-false-false': new Sprite( new BunnySpriteImage( bunnyWhiteFurFloppyEarsLongTeethImage ) ),
  'false-true-true': new Sprite( new BunnySpriteImage( bunnyBrownFurStraightEarsShortTeethImage ) ),
  'false-true-false': new Sprite( new BunnySpriteImage( bunnyBrownFurStraightEarsLongTeethImage ) ),
  'false-false-true': new Sprite( new BunnySpriteImage( bunnyBrownFurFloppyEarsShortTeethImage ) ),
  'false-false-false': new Sprite( new BunnySpriteImage( bunnyBrownFurFloppyEarsLongTeethImage ) )
};

class BunnySpriteInstance extends OrganismSpriteInstance {

  /**
   * @param {Bunny} bunny
   */
  constructor( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    super( bunny, getBunnySprite( bunny ), {
      baseScale: 0.4
    } );
    this.bunny = bunny;
  }

  /**
   * Gets the sprites used for bunnies.
   * @returns {Sprite[]}
   * @public
   */
  static getSprites() {
    const sprites = [];
    for ( const property in BUNNY_SPRITES_CACHE ) {
      sprites.push( BUNNY_SPRITES_CACHE[ property ] );
    }
    return sprites;
  }
}

/**
 * Gets the cached Sprite that matches a bunny's phenotype. Instead of a big if-then-else statement for each
 * permutation of gene type, this implementation converts the phenotype to a string key, and maps that key to a Sprite.
 * @param {Bunny} bunny
 * @returns {Sprite}
 * @private
 */
function getBunnySprite( bunny ) {

  assert && assert( bunny instanceof Bunny, 'invalid bunny' );

  // create the key by inspecting the phenotype
  const key = `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;

  // look up the image in the map
  const sprite = BUNNY_SPRITES_CACHE[ key ];
  assert && assert( sprite, `no sprite found for key ${key}` );

  return sprite;
}

naturalSelection.register( 'BunnySpriteInstance', BunnySpriteInstance );
export default BunnySpriteInstance;