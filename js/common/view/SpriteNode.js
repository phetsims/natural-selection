// Copyright 2020, University of Colorado Boulder

/**
 * SpriteNode displays a Sprite model element (which exists in 3D space) as a 2D image projected onto the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../naturalSelection.js';
import Sprite from '../model/Sprite.js';

class SpriteNode extends Node {

  /**
   * @param {Sprite} sprite
   * @param {Object} [options]
   */
  constructor( sprite, options ) {

    assert && assert( sprite instanceof Sprite, 'invalid sprite' );

    options = merge( {
      scaleFactor: 1  // scale applied in addition to modelViewTransform scale
    }, options );

    assert && assert( sprite instanceof Sprite, 'invalid sprite' );

    super( options );

    // @public (read-only)
    this.sprite = sprite;

    // Position and scale
    const multilink = Property.multilink( [ sprite.positionProperty, sprite.xDirectionProperty ], ( position, xDirection ) => {
      this.resetTransform();
      this.translation = sprite.modelViewTransform.modelToViewPosition( position );
      const scale = options.scaleFactor * sprite.modelViewTransform.getViewScale( position.z );
      this.setScaleMagnitude( scale * xDirection, scale );
    } );

    // @private
    this.disposeSpriteNode = () => {
      multilink.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    super.dispose();
    this.disposeSpriteNode();
  }
}

naturalSelection.register( 'SpriteNode', SpriteNode );
export default SpriteNode;