// Copyright 2020-2021, University of Colorado Boulder

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
import bunnyBrownFurFloppyEarsLongTeeth_png from '../../../images/bunnyBrownFurFloppyEarsLongTeeth_png.js';
import bunnyBrownFurFloppyEarsShortTeeth_png from '../../../images/bunnyBrownFurFloppyEarsShortTeeth_png.js';
import bunnyBrownFurStraightEarsLongTeeth_png from '../../../images/bunnyBrownFurStraightEarsLongTeeth_png.js';
import bunnyBrownFurStraightEarsShortTeeth_png from '../../../images/bunnyBrownFurStraightEarsShortTeeth_png.js';
import bunnyWhiteFurFloppyEarsLongTeeth_png from '../../../images/bunnyWhiteFurFloppyEarsLongTeeth_png.js';
import bunnyWhiteFurFloppyEarsShortTeeth_png from '../../../images/bunnyWhiteFurFloppyEarsShortTeeth_png.js';
import bunnyWhiteFurStraightEarsLongTeeth_png from '../../../images/bunnyWhiteFurStraightEarsLongTeeth_png.js';
import bunnyWhiteFurStraightEarsShortTeeth_png from '../../../images/bunnyWhiteFurStraightEarsShortTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from '../model/Bunny.js';
import BunnySpriteImage from './environment/BunnySpriteImage.js';

class BunnyImageMap {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // Maps a bunny's phenotype to an HTMLImageElement. See getKey for how the key is formed.
    // This map is not static because the images need to be loaded before they can be used by SpriteImage.
    const imageMap = {

      // key: value
      'true-true-true': bunnyWhiteFurStraightEarsShortTeeth_png,
      'true-true-false': bunnyWhiteFurStraightEarsLongTeeth_png,
      'true-false-true': bunnyWhiteFurFloppyEarsShortTeeth_png,
      'true-false-false': bunnyWhiteFurFloppyEarsLongTeeth_png,
      'false-true-true': bunnyBrownFurStraightEarsShortTeeth_png,
      'false-true-false': bunnyBrownFurStraightEarsLongTeeth_png,
      'false-false-true': bunnyBrownFurFloppyEarsShortTeeth_png,
      'false-false-false': bunnyBrownFurFloppyEarsLongTeeth_png
    };
    assert && assert( _.keys( imageMap ).length === 8, 'imageMap is incomplete' );
    assert && assert( _.every( _.keys( imageMap ), key => key.match( /(true|false)-(true|false)-(true|false)/ ) ),
      'imageMap has an invalid key' );

    // @private {Object.<string,Sprite>} - Sprites for each bunny phenotype, used in OrganismSprites. Uses the same keys
    // as imageMap.
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

    // @private {Object.<string,Node>} - Nodes for each bunny phenotype, used in the Pedigree graph. Uses the same keys
    // as imageMap. All of these Nodes have the same origin and effective size.
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
 * permutation of gene, this implementation converts the phenotype to a string key. The key pattern is
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