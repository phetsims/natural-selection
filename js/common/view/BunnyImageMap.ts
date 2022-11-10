// Copyright 2020-2022, University of Colorado Boulder

/**
 * BunnyImageMap maps a bunny to a visual representation that corresponds to its phenotype.
 * The visual representation can be a Sprite (for use in OrganismSprites) or a Node (for use in the Pedigree graph).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { AlignBox, AlignBoxOptions, AlignGroup, Image, Node, NodeOptions, NodeTransformOptions, Sprite } from '../../../../scenery/js/imports.js';
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

// Keys for all maps herein. See getKey().
type Key =
  'true-true-true' | 'true-true-false' | 'true-false-true' | 'true-false-false' |
  'false-true-true' | 'false-true-false' | 'false-false-true' | 'false-false-false';

export default class BunnyImageMap {

  // Sprites for each bunny phenotype, used in OrganismSprites. Uses the same keys as const imageMap.
  private readonly spriteMap: Map<Key, Sprite>;

  // Nodes for each bunny phenotype, used in the Pedigree graph. Uses the same keys as const imageMap.
  // All of these Nodes have the same origin and effective size.
  private readonly nodeMap: Map<Key, Node>;

  public constructor() {

    // Maps a bunny's phenotype to an HTMLImageElement.
    // This map is not static because the images need to be loaded before they can be used by SpriteImage.
    const imageMap = new Map<Key, HTMLImageElement>();
    imageMap.set( 'true-true-true', bunnyWhiteFurStraightEarsShortTeeth_png );
    imageMap.set( 'true-true-false', bunnyWhiteFurStraightEarsLongTeeth_png );
    imageMap.set( 'true-false-true', bunnyWhiteFurFloppyEarsShortTeeth_png );
    imageMap.set( 'true-false-false', bunnyWhiteFurFloppyEarsLongTeeth_png );
    imageMap.set( 'false-true-true', bunnyBrownFurStraightEarsShortTeeth_png );
    imageMap.set( 'false-true-false', bunnyBrownFurStraightEarsLongTeeth_png );
    imageMap.set( 'false-false-true', bunnyBrownFurFloppyEarsShortTeeth_png );
    imageMap.set( 'false-false-false', bunnyBrownFurFloppyEarsLongTeeth_png );
    assert && assert( imageMap.size === 8, 'imageMap is incomplete' );

    // Create a Sprite for each entry in imageMap.
    this.spriteMap = new Map<Key, Sprite>();
    imageMap.forEach( ( htmlImageElement, key ) =>
      this.spriteMap.set( key, new Sprite( new BunnySpriteImage( htmlImageElement ) ) ) );

    // Hit test on non-transparent pixels, to make it easier to select overlapping bunnies.
    // See https://github.com/phetsims/natural-selection/issues/63
    const imageOptions = {
      hitTestPixels: true
    };

    // Make all Nodes have the same origin and effective dimensions.
    const alignBoxOptions: AlignBoxOptions = {
      xAlign: 'center',
      yAlign: 'bottom',
      group: new AlignGroup()
    };

    // Create a Node for each entry in imageMap.
    this.nodeMap = new Map<Key, Node>();
    imageMap.forEach( ( htmlImageElement, key ) =>
      this.nodeMap.set( key, new AlignBox( new Image( htmlImageElement, imageOptions ), alignBoxOptions ) ) );
  }

  /**
   * Gets the complete set of Sprites for all bunny phenotypes.
   */
  public getSprites(): Sprite[] {
    return Array.from( this.spriteMap.values() );
  }

  /**
   * Gets the Sprite that matches a bunny's phenotype, for use in OrganismSprites.
   */
  public getSprite( bunny: Bunny ): Sprite {

    // Create the key that corresponds to the bunny's phenotype.
    const key = getKey( bunny );

    // Look up the Sprite in the map.
    const sprite = this.spriteMap.get( key )!;
    assert && assert( sprite, `no sprite found for key ${key}` );

    return sprite;
  }

  /**
   * Gets the Node that matches a bunny's phenotype, for use in the Pedigree graph. Since this Node is used in multiple
   * places in scenery's DAG, the Node is wrapped with another Node, so that it can be transformed without causing
   * problems.
   */
  public getNode( bunny: Bunny, providedOptions?: NodeTransformOptions ): Node {

    const options = combineOptions<NodeOptions>( {}, providedOptions );

    // Create the key that corresponds to the bunny's phenotype.
    const key = getKey( bunny );

    // Look up the Node in the map.
    const node = this.nodeMap.get( key )!;
    assert && assert( node, `no Node found for key ${key}` );

    options.children = [ node ];

    return new Node( options );
  }
}

/**
 * Gets the key that corresponds to a bunny's phenotype. Instead of a big if-then-else statement for each
 * permutation of gene, this implementation converts the phenotype to a string key. The key pattern is
 * '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}', where the value for each placeholder is 'true' or 'false'.
 */
function getKey( bunny: Bunny ): Key {
  return `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;
}

naturalSelection.register( 'BunnyImageMap', BunnyImageMap );