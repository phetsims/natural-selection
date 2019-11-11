// Copyright 2019, University of Colorado Boulder

/**
 * HatchingRectangle is a Rectangle that appears as if it's filled with a hatching pattern.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  class HatchingRectangle extends Rectangle {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     */
    constructor( x, y, width, height, options ) {

      options = merge( {

        // options for the hatching lines
        hatchOptions: {
          stroke: 'white',
          lineWidth: 2,
          rotation: -Math.PI / 4
        },

        // Rectangle options
        fill: 'black',
        stroke: null

      }, options );

      assert && assert( !options.children, 'HatchingRectangle sets children' );
      assert && assert( !options.clipArea, 'HatchingRectangle sets clipArea' );

      super( 0, 0, width, height, options );

      // Clip to the shape of the rectangle
      this.clipArea = this.shape;

      // Draw equally-spaces lines on top of the rectangle to create a hatching pattern. The lines are drawn
      // horizontally as a single Shape, then rotated to the desired angle. The bounds of the lines is 2x the
      // dimensions of the rectangle, so that the hatching pattern can be rotated arbitrarily.
      let lineY = 0;
      const linesShape = new Shape();
      while ( lineY <= 2 * height ) {
        linesShape.moveTo( 0, lineY ).lineTo( 2 * width, lineY );
        lineY = lineY + 2 * options.hatchOptions.lineWidth;
      }
      const linesPath = new Path( linesShape, options.hatchOptions );
      linesPath.center = this.center;
      this.addChild( linesPath );
    }
  }

  return naturalSelection.register( 'HatchingRectangle', HatchingRectangle );
} );