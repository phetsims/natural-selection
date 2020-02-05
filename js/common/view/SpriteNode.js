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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Sprite = require( 'NATURAL_SELECTION/common/model/Sprite' );

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

  return naturalSelection.register( 'SpriteNode', SpriteNode );
} );