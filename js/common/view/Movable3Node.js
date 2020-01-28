// Copyright 2020, University of Colorado Boulder

/**
 * Movable3Node is a Node that has an associated Movable3 model element, and handles the 3D to 2D projection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnvironmentModelViewTransform = require( 'NATURAL_SELECTION/common/model/EnvironmentModelViewTransform' );
  const merge = require( 'PHET_CORE/merge' );
  const Movable3 = require( 'NATURAL_SELECTION/common/model/Movable3' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );

  class Movable3Node extends Node {

    /**
     * @param {Movable3} movable
     * @param {EnvironmentModelViewTransform} modelViewTransform
     * @param {Object} [options]
     */
    constructor( movable, modelViewTransform, options ) {

      options = merge( {
        scaleFactor: 1  // scale applied in addition to modelViewTransform scale
      }, options );

      assert && assert( movable instanceof Movable3, 'invalid movable' );
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
      const directionObserver = isMovingRight => {
        const getScaleVector = this.getScaleVector();
        const xScale = isMovingRight ? getScaleVector.x : -getScaleVector.x;
        this.setScaleMagnitude( xScale, getScaleVector.y );
      };
      movable.isMovingRightProperty.link( directionObserver );

      // @private
      this.disposeMovable3Node = () => {
        movable.positionProperty.unlink( positionObserver );
        movable.isMovingRightProperty.unlink( directionObserver );
      };
    }

    /**
     * @public
     * @override
     */
    dispose() {
      super.dispose();
      this.disposeMovable3Node();
    }
  }

  return naturalSelection.register( 'Movable3Node', Movable3Node );
} );