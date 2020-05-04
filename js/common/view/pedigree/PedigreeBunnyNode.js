// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import BunnyImageCache from '../BunnyImageCache.js';
import MutationIconNode from '../MutationIconNode.js';

class PedigreeBunnyNode extends Node {

  /**
   * @param {Bunny} bunny
   * @param {Object} [options]
   */
  constructor( bunny, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    options = merge( {
      isSelected: false
    }, options );

    const wrappedImage = BunnyImageCache.getWrappedImage( bunny );

    assert && assert( !options.children, 'PedigreeBunnyNode sets children' );
    options.children = [ wrappedImage ];

    if ( bunny.genotype.isFirstGenerationMutant ) {
      options.children.push( new MutationIconNode( {
        radius: 30,
        left: wrappedImage.left,
        bottom: wrappedImage.bottom
      } ) );
    }

    // Rectangle that appears around the selected bunny
    if ( options.isSelected ) {

      //TODO copied from BunnyNode, factor out into BunnySelectionRectangle
      //TODO stroke doesn't appear to be the same lineWidth as selected bunny in environment because its scaled here
      const selectionRectangle = new Rectangle( wrappedImage.bounds.dilated( 5 ), {
        fill: 'rgba( 0, 0, 0, 0.25 )',
        stroke: 'blue',
        lineWidth: 2.5,
        cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
        center: wrappedImage.center,
        pickable: false
      } );
      options.children.unshift( selectionRectangle );
    }

    super( options );

    //TODO add OriginNode

    const isAliveListener = isAlive => {
      if ( !isAlive ) {
        bunny.isAliveProperty.unlink( isAliveListener );
        this.addChild( new Text( '\u274c', {
          font: new PhetFont( 60 ),
          left: wrappedImage.left,
          top: wrappedImage.top
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