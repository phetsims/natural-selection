// Copyright 2020, University of Colorado Boulder

/**
 * WolfNode is the view of a Wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import wolfImage from '../../../images/wolf_png.js';
import naturalSelection from '../../naturalSelection.js';
import Wolf from '../model/Wolf.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionSpriteNode from './NaturalSelectionSpriteNode.js';
import OriginNode from './OriginNode.js';
import WolfNodeIO from './WolfNodeIO.js';

// constants
const IMAGE_SCALE = 0.25; // how much the wolf PNG image is scaled

class WolfNode extends NaturalSelectionSpriteNode {

  /**
   * @param {Wolf} wolf
   * @param {Object} [options]
   */
  constructor( wolf, options ) {

    assert && assert( wolf instanceof Wolf, 'invalid wolf' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true,
      phetioType: WolfNodeIO
    }, options );

    // Since this node will be scaled based on z position, and the image itself must have a base scale,
    // Image is used via composition instead of inheritance.
    const imageNode = new Image( wolfImage, {
      scale: IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );

    assert && assert( !options.children, 'WolfNode sets children' );
    options.children = [ imageNode ];

    // Red dot at the origin
    if ( NaturalSelectionQueryParameters.showOrigin ) {
      options.children.push( new OriginNode() );
    }

    super( wolf, options );
  }
}

naturalSelection.register( 'WolfNode', WolfNode );
export default WolfNode;