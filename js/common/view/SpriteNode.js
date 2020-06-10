// Copyright 2020, University of Colorado Boulder

/**
 * SpriteNode synchronizes its position and direction with a Sprite model element.  It converts the model's 3D
 * position to a 2D position and scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../naturalSelection.js';
import Sprite from '../model/Sprite.js';
import SpriteDirection from '../model/SpriteDirection.js';

class SpriteNode extends Node {

  /**
   * @param {Sprite} sprite
   * @param {Object} [options]
   */
  constructor( sprite, options ) {

    assert && assert( sprite instanceof Sprite, 'invalid sprite' );

    super( options );

    // @public (read-only)
    this.sprite = sprite;

    // Position and direction
    const multilink = new Multilink(
      [ sprite.positionProperty, sprite.directionProperty ],
      ( position, direction ) => {
        this.resetTransform();
        this.translation = sprite.modelViewTransform.modelToViewPosition( position );
        const scale = sprite.modelViewTransform.getViewScale( position.z );
        this.setScaleMagnitude( scale * SpriteDirection.toSign( direction ), scale );
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
    this.disposeSpriteNode();
    super.dispose();
  }
}

naturalSelection.register( 'SpriteNode', SpriteNode );
export default SpriteNode;