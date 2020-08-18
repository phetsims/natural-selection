// Copyright 2020, University of Colorado Boulder

/**
 * BunnySpritesMap maps a bunny to a Sprite or Node, based on the bunny's phenotype.
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

class BunnySpritesMap {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // Maps a bunny's phenotype to an HTMLImageElement. See getKey for how the key is formed.
    const imagesMap = {

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
    assert && assert( _.keys( imagesMap ).length === 8, 'imagesMap is incomplete' );
    assert && assert( _.every( _.keys( imagesMap ), key => key.match( /(true|false)-(true|false)-(true|false)/ ) ),
      'imagesMap has an invalid key' );

    // @private Sprites for each bunny phenotype, used in OrganismSprites. Uses the same keys as imagesMap.
    this.spritesMap = {};
    for ( const key in imagesMap ) {
      this.spritesMap[ key ] = new Sprite( new BunnySpriteImage( imagesMap[ key ] ) );
    }

    // Hit test on non-transparent pixels, to make it easier to select overlapping bunnies.
    // See https://github.com/phetsims/natural-selection/issues/63
    const imageOptions = {
      hitTestPixels: true
    };

    // To make all images have the same effective dimensions, center-bottom aligned to correspond to bunny's origin.
    const alignBoxOptions = {
      group: new AlignGroup(),
      xAlign: 'center',
      yAlign: 'bottom'
    };

    // @private Nodes for each bunny phenotype, used in the Pedigree graph. Uses the same keys as imagesMap.
    // All Nodes are guaranteed to have the same effective size.
    this.nodesMap = {};
    for ( const key in imagesMap ) {
      this.nodesMap[ key ] = new AlignBox( new Image( imagesMap[ key ], imageOptions ), alignBoxOptions );
    }
    //TODO verify that they all have the same size
  }

  /**
   * Gets the complete set of Sprites for all bunny phenotypes.
   * @returns {Sprite[]}
   * @public
   */
  getSprites() {
    const sprites = [];
    for ( const key in this.spritesMap ) {
      assert && assert( this.spritesMap.hasOwnProperty( key ), `spriteMaps is missing key ${key}` );
      sprites.push( this.spritesMap[ key ] );
    }
    return sprites;
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
    const sprite = this.spritesMap[ key ];
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
  getWrappedNode( bunny, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    options = merge( {}, options );

    // Create the key that corresponds to the bunny's phenotype.
    const key = getKey( bunny );

    // look up the Node in the map
    const image = this.nodesMap[ key ];

    assert && assert( !options.children, 'getWrappedNode sets children' );
    options.children = [ image ];

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

naturalSelection.register( 'BunnySpritesMap', BunnySpritesMap );
export default BunnySpritesMap;