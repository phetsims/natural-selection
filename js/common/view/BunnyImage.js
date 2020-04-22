// Copyright 2020, University of Colorado Boulder

/**
 * BunnyImage creates an Image node that corresponds to a Bunny's phenotype (how the bunny looks).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import bunnyBrownFurFloppyEarsLongTeethImage from '../../../images/bunny-brownFur-floppyEars-longTeeth_png.js';
import bunnyBrownFurFloppyEarsShortTeethImage from '../../../images/bunny-brownFur-floppyEars-shortTeeth_png.js';
import bunnyBrownFurStraightEarsLongTeethImage from '../../../images/bunny-brownFur-straightEars-longTeeth_png.js';
import bunnyBrownFurStraightEarsShortTeethImage from '../../../images/bunny-brownFur-straightEars-shortTeeth_png.js';
import bunnyWhiteFurFloppyEarsLongTeethImage from '../../../images/bunny-whiteFur-floppyEars-longTeeth_png.js';
import bunnyWhiteFurFloppyEarsShortTeethImage from '../../../images/bunny-whiteFur-floppyEars-shortTeeth_png.js';
import bunnyWhiteFurStraightEarsLongTeethImage from '../../../images/bunny-whiteFur-straightEars-longTeeth_png.js';
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';

class BunnyImage extends Image {

  /**
   * @param {Bunny} bunny
   * @param {Object} [options]
   */
  constructor( bunny, options ) {
    super( getHTMLImageElement( bunny ), options );
  }
}

// Maps phenotype key to an image. The key pattern is '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}',
// where each value is a boolean. See getHTMLImageElement.
const BUNNY_IMAGE_MAP = {
  'true-true-true': bunnyWhiteFurStraightEarsShortTeethImage,
  'true-true-false': bunnyWhiteFurStraightEarsLongTeethImage,
  'true-false-true': bunnyWhiteFurFloppyEarsShortTeethImage,
  'true-false-false': bunnyWhiteFurFloppyEarsLongTeethImage,
  'false-true-true': bunnyBrownFurStraightEarsShortTeethImage,
  'false-true-false': bunnyBrownFurStraightEarsLongTeethImage,
  'false-false-true': bunnyBrownFurFloppyEarsShortTeethImage,
  'false-false-false': bunnyBrownFurFloppyEarsLongTeethImage
};
assert && assert( _.keys( BUNNY_IMAGE_MAP ).length === 8, 'BUNNY_IMAGE_MAP is incomplete' );
assert && assert( _.every( _.keys( BUNNY_IMAGE_MAP ), key => key.match( /(true|false)-(true|false)-(true|false)/ ) ),
  'BUNNY_IMAGE_MAP has an invalid key' );

/**
 * Gets the image that matches a bunny's phenotype. Instead of a big if-then-else statement for each permutation
 * of traits, this implementation converts the phenotype to a string key, and maps that key to an image.
 *
 * @param {Bunny} bunny
 * @returns {HTMLImageElement}
 * @public
 */
function getHTMLImageElement( bunny ) {

  // create the key by inspecting the phenotype
  const key = `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;

  // look up the image in the map
  return BUNNY_IMAGE_MAP[ key ];
}

naturalSelection.register( 'BunnyImage', BunnyImage );
export default BunnyImage;