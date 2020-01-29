// Copyright 2020, University of Colorado Boulder

/**
 * SpriteNode represents a Sprite model element (which exists in 3D space) as a 2D image projected onto the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnvironmentModelViewTransform = require( 'NATURAL_SELECTION/common/model/EnvironmentModelViewTransform' );
  const merge = require( 'PHET_CORE/merge' );
  const Sprite = require( 'NATURAL_SELECTION/common/model/Sprite' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );

  class SpriteNode extends Node {

    /**
     * @param {Sprite} movable
     * @param {EnvironmentModelViewTransform} modelViewTransform
     * @param {Object} [options]
     */
    constructor( movable, modelViewTransform, options ) {

      options = merge( {
        scaleFactor: 1  // scale applied in addition to modelViewTransform scale
      }, options );

      assert && assert( movable instanceof Sprite, 'invalid movable' );
      assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

      super( options );

      // @public (read-only)
      this.movable = movable;

      // Position and scale
      const positionObserver = position => {
        this.translation = modelViewTransform.modelToViewPosition( position );
        this.setScaleMagnitude( options.scaleFactor * modelViewTransform.getViewScale( position.z ) );
      };
      movable.positionProperty.link( positionObserver );

      // Direction along the x axis
      const xDirectionObserver = xDirection => {
        const getScaleVector = this.getScaleVector();
        this.setScaleMagnitude( Math.abs( getScaleVector.x ) * xDirection, getScaleVector.y );
      };
      movable.xDirectionProperty.link( xDirectionObserver );

      // @private
      this.disposeSpriteNode = () => {
        movable.positionProperty.unlink( positionObserver );
        movable.xDirectionProperty.unlink( xDirectionObserver );
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