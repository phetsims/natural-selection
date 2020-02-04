// Copyright 2020, University of Colorado Boulder

/**
 * SpriteNode represents a Sprite model element (which exists in 3D space) as a 2D image projected onto the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const Sprite = require( 'NATURAL_SELECTION/common/model/Sprite' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );

  class SpriteNode extends Node {

    /**
     * @param {Sprite} sprite
     * @param {Object} [options]
     */
    constructor( sprite, options ) {

      options = merge( {
        scaleFactor: 1  // scale applied in addition to modelViewTransform scale
      }, options );

      assert && assert( sprite instanceof Sprite, 'invalid sprite' );

      super( options );

      // @public (read-only)
      this.sprite = sprite;

      // Position and scale
      const positionObserver = position => {
        this.translation = sprite.modelViewTransform.modelToViewPosition( position );
        this.setScaleMagnitude( options.scaleFactor * sprite.modelViewTransform.getViewScale( position.z ) );
      };
      sprite.positionProperty.link( positionObserver );

      // Direction along the x axis
      const xDirectionObserver = xDirection => {
        const getScaleVector = this.getScaleVector();
        this.setScaleMagnitude( Math.abs( getScaleVector.x ) * xDirection, getScaleVector.y );
      };
      sprite.xDirectionProperty.link( xDirectionObserver );

      // @private
      this.disposeSpriteNode = () => {
        sprite.positionProperty.unlink( positionObserver );
        sprite.xDirectionProperty.unlink( xDirectionObserver );
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

  return naturalSelection.register( 'SpriteNode', SpriteNode );
} );