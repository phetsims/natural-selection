// Copyright 2020, University of Colorado Boulder

/**
 * BunnyImageMap maps a bunny to a visual representation that corresponds to its phenotype.
 * The visual representation can be a Sprite (for use in OrganismSprites) or a Node (for use in the Pedigree graph).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Sprite from '../../../../scenery/js/util/Sprite.js';
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
import BunnySpriteImage from './environment/BunnySpriteImage.js';

class BunnyImageMap {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // Maps a bunny's phenotype to an HTMLImageElement. See getKey for how the key is formed.
    const imageMap = {

      // key: value
      'true-true-true': bunnyWhiteFurStraightEarsShortTeethImage,
      'true-true-false': bunnyWhiteFurStraightEarsLongTeethImage,
      'true-false-true': bunnyWhiteFurFloppyEarsShortTeethImage,
      'true-false-false': bunnyWhiteFurFloppyEarsLongTeethImage,
      'false-true-true': bunnyBrownFurStraightEarsShortTeethImage,
      'false-true-false': bunnyBrownFurStraightEarsLongTeethImage,
      'false-false-true': bunnyBrownFurFloppyEarsShortTeethImage,
      'false-false-false': bunnyBrownFurFloppyEarsLongTeethImage
    };
    assert && assert( _.keys( imageMap ).length === 8, 'imageMap is incomplete' );
    assert && assert( _.every( _.keys( imageMap ), key => key.match( /(true|false)-(true|false)-(true|false)/ ) ),
      'imageMap has an invalid key' );

    // @private Sprites for each bunny phenotype, used in OrganismSprites. Uses the same keys as imageMap.
    this.spriteMap = _.mapValues( imageMap, image => new Sprite( new BunnySpriteImage( image ) ) );

    // Hit test on non-transparent pixels, to make it easier to select overlapping bunnies.
    // See https://github.com/phetsims/natural-selection/issues/63
    const imageOptions = {
      hitTestPixels: true
    };

    // Make all Nodes have the same origin and effective dimensions.
    const alignBoxOptions = {
      xAlign: 'center',
      yAlign: 'bottom',
      group: new AlignGroup()
    };

    // @private Nodes for each bunny phenotype, used in the Pedigree graph. Uses the same keys as imageMap.
    // All of these Nodes have the same origin and effective size.
    this.nodeMap = _.mapValues( imageMap, image => new AlignBox( new Image( image, imageOptions ), alignBoxOptions ) );
  }

  /**
   * Gets the complete set of Sprites for all bunny phenotypes.
   * @returns {Sprite[]}
   * @public
   */
  getSprites() {
    return _.values( this.spriteMap );
  }

  /**
   * Gets the Sprite that matches a bunny's phenotype, for use in OrganismSprites.
   * @param {Bunny} bunny
   * @returns {Sprite}
   * @public
   */
  getSprite( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    // Create the key that corresponds to the bunny's phenotype.
    const key = getKey( bunny );

    // Look up the Sprite in the map.
    const sprite = this.spriteMap[ key ];
    assert && assert( sprite, `no sprite found for key ${key}` );

    return sprite;
  }

  /**
   * Gets the Node that matches a bunny's phenotype, for use in the Pedigree graph. Since this Node is used in multiple
   * places in scenery's DAG, the Node is wrapped with another Node, so that it can be transformed without causing
   * problems.
   * @param {Bunny} bunny
   * @param {Object} [options] - applied to Node wrapper
   * @returns {Node}
   * @public
   */
  getNode( bunny, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    options = merge( {}, options );

    // Create the key that corresponds to the bunny's phenotype.
    const key = getKey( bunny );

    // Look up the Node in the map.
    const node = this.nodeMap[ key ];
    assert && assert( node, `no Node found for key ${key}` );

    assert && assert( !options.children, 'getWrappedNode sets children' );
    options.children = [ node ];

    return new Node( options );
  }
}

/**
 * Gets the key that corresponds to a bunny's phenotype. Instead of a big if-then-else statement for each
 * permutation of gene type, this implementation converts the phenotype to a string key. The key pattern is
 * '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}', where the value for each placeholder is 'true' or 'false'.
 * @param {Bunny} bunny
 * @returns {string}
 * @private
 */
function getKey( bunny ) {
  return `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;
}

naturalSelection.register( 'BunnyImageMap', BunnyImageMap );
export default BunnyImageMap;