// Copyright 2020, University of Colorado Boulder

/**
 * BunnyImageCache is a cache of Image nodes for all possible Bunny phenotypes (appearances).
 * These Image instances are used in multiple places via scenery's DAG feature, so exercise
 * caution when applying transforms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import bunnyBrownFurFloppyEarsLongTeethImage from '../../../images/bunny-brownFur-floppyEars-longTeeth_png.js';
import bunnyBrownFurFloppyEarsShortTeethImage from '../../../images/bunny-brownFur-floppyEars-shortTeeth_png.js';
import bunnyBrownFurStraightEarsLongTeethImage from '../../../images/bunny-brownFur-straightEars-longTeeth_png.js';
import bunnyBrownFurStraightEarsShortTeethImage from '../../../images/bunny-brownFur-straightEars-shortTeeth_png.js';
import bunnyWhiteFurFloppyEarsLongTeethImage from '../../../images/bunny-whiteFur-floppyEars-longTeeth_png.js';
import bunnyWhiteFurFloppyEarsShortTeethImage from '../../../images/bunny-whiteFur-floppyEars-shortTeeth_png.js';
import bunnyWhiteFurStraightEarsLongTeethImage from '../../../images/bunny-whiteFur-straightEars-longTeeth_png.js';
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from '../model/Bunny.js';

// Hit test on non-transparent pixels, to make it easier to select overlapping bunnies.
// See https://github.com/phetsims/natural-selection/issues/63
const IMAGE_OPTIONS = {
  hitTestPixels: true
};

// To make all images have the same effective dimensions, center-bottom aligned to correspond to bunny's origin.
const ALIGN_BOX_OPTIONS = {
  group: new AlignGroup(),
  xAlign: 'center',
  yAlign: 'bottom'
};

// The cache is a map, which maps phenotype key to an Image instance.
// The phenotype key pattern is '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}', where each value is a boolean.
// See getImage for how the key is assembled.
const CACHE = {
  'true-true-true': new AlignBox( new Image( bunnyWhiteFurStraightEarsShortTeethImage, IMAGE_OPTIONS ), ALIGN_BOX_OPTIONS ),
  'true-true-false': new AlignBox( new Image( bunnyWhiteFurStraightEarsLongTeethImage, IMAGE_OPTIONS ), ALIGN_BOX_OPTIONS ),
  'true-false-true': new AlignBox( new Image( bunnyWhiteFurFloppyEarsShortTeethImage, IMAGE_OPTIONS ), ALIGN_BOX_OPTIONS ),
  'true-false-false': new AlignBox( new Image( bunnyWhiteFurFloppyEarsLongTeethImage, IMAGE_OPTIONS ), ALIGN_BOX_OPTIONS ),
  'false-true-true': new AlignBox( new Image( bunnyBrownFurStraightEarsShortTeethImage, IMAGE_OPTIONS ), ALIGN_BOX_OPTIONS ),
  'false-true-false': new AlignBox( new Image( bunnyBrownFurStraightEarsLongTeethImage, IMAGE_OPTIONS ), ALIGN_BOX_OPTIONS ),
  'false-false-true': new AlignBox( new Image( bunnyBrownFurFloppyEarsShortTeethImage, IMAGE_OPTIONS ), ALIGN_BOX_OPTIONS ),
  'false-false-false': new AlignBox( new Image( bunnyBrownFurFloppyEarsLongTeethImage, IMAGE_OPTIONS ), ALIGN_BOX_OPTIONS )
};
assert && assert( _.keys( CACHE ).length === 8, 'CACHE is incomplete' );
assert && assert( _.every( _.keys( CACHE ), key => key.match( /(true|false)-(true|false)-(true|false)/ ) ),
  'CACHE has an invalid key' );

const BunnyImageCache = {

  /**
   * Gets the cached Image that matches a bunny's phenotype. Instead of a big if-then-else statement for each
   * permutation of gene type, this implementation converts the phenotype to a string key, and maps that key to an Image.
   * Since this Image is used in multiple places in scenery's DAG, the Image is wrapped in a Node, so that it can be
   * transformed without causing subtle (or not-so-subtle) problems.
   * @param {Bunny} bunny
   * @param {Object} [options] - applied to Node wrapper
   * @returns {Node}
   */
  getWrappedImage( bunny, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    options = merge( {}, options );

    // create the key by inspecting the phenotype
    const key = `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;

    // look up the image in the map
    const image = CACHE[ key ];

    assert && assert( !options.children, 'getWrappedImage sets children' );
    options.children = [ image ];

    return new Node( options );
  }
};

naturalSelection.register( 'BunnyImageCache', BunnyImageCache );
export default BunnyImageCache;