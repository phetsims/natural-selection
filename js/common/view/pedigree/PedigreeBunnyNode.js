// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import BunnyImageCache from '../BunnyImageCache.js';
import MutationIconNode from '../MutationIconNode.js';

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

    //TODO add OriginNode

    const isAliveListener = isAlive => {
      if ( !isAlive ) {
        bunny.isAliveProperty.unlink( isAliveListener );
        this.addChild( new Text( '\u274c', {
          font: new PhetFont( 60 ),
          left: wrappedImageNode.left,
          top: wrappedImageNode.top
        } ) );
      }
    };
    bunny.isAliveProperty.link( isAliveListener );

    // @private
    this.disposePedigreeBunnyNode = () => {
      if ( bunny.isAliveProperty.hasListener( isAliveListener ) ) {
        bunny.isAliveProperty.unlink( isAliveListener );
      }
    };
  }

  dispose() {
    this.disposePedigreeBunnyNode();
    super.dispose();
  }
}

naturalSelection.register( 'PedigreeBunnyNode', PedigreeBunnyNode );
export default PedigreeBunnyNode;