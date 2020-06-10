// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionSpriteNode is the base-class view of a NaturalSelectionSprite model element. It synchronizes its
 * position and direction with the model, and converts the model's 3D position to a 2D position and scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionSprite from '../model/NaturalSelectionSprite.js';
import SpriteDirection from '../model/SpriteDirection.js';

class NaturalSelectionSpriteNode extends Node {

  /**
   * @param {Sprite} sprite
   * @param {Object} [options]
   */
  constructor( sprite, options ) {

    assert && assert( sprite instanceof NaturalSelectionSprite, 'invalid sprite' );

    super( options );

    // @public (read-only)
    this.sprite = sprite;

    // Position and direction, must be disposed
    const multilink = new Multilink(
      [ sprite.positionProperty, sprite.directionProperty ],
      ( position, direction ) => {
        this.resetTransform();
        this.translation = sprite.modelViewTransform.modelToViewPosition( position );
        const scale = sprite.modelViewTransform.getViewScale( position.z );
        this.setScaleMagnitude( scale * SpriteDirection.toSign( direction ), scale );
      } );

    // @private
    this.disposeNaturalSelectionSpriteNode = () => {
      multilink.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeNaturalSelectionSpriteNode();
    super.dispose();
  }
}

naturalSelection.register( 'NaturalSelectionSpriteNode', NaturalSelectionSpriteNode );
export default NaturalSelectionSpriteNode;