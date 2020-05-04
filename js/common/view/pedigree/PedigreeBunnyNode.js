// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import BunnyImageCache from '../BunnyImageCache.js';
import MutationIconNode from '../MutationIconNode.js';
import OriginNode from '../OriginNode.js';

class PedigreeBunnyNode extends Node {

  /**
   * @param {Bunny} bunny
   * @param {Object} [options]
   */
  constructor( bunny, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    options = merge( {}, options );

    const wrappedImageNode = BunnyImageCache.getWrappedImage( bunny );

    assert && assert( !options.children, 'PedigreeBunnyNode sets children' );
    options.children = [ wrappedImageNode ];

    if ( bunny.genotype.isFirstGenerationMutant ) {
      options.children.push( new MutationIconNode( {
        radius: 30,
        left: wrappedImageNode.left,
        bottom: wrappedImageNode.bottom
      } ) );
    }

    super( options );

    if ( NaturalSelectionConstants.SHOW_ORIGIN ) {
      this.addChild( new OriginNode() );
    }
  }
}

naturalSelection.register( 'PedigreeBunnyNode', PedigreeBunnyNode );
export default PedigreeBunnyNode;