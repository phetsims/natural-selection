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
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  class HatchingRectangle extends Node {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     */
    constructor( x, y, width, height, options ) {

      options = merge( {
        fill: 'black',
        hatchStroke: 'white',
        hatchLineWidth: 2,
        hatchAngle: -Math.PI / 4
      }, options );

      const rectangle = new Rectangle( 0, 0, width, height, {
        fill: options.fill
      } );

      let lineY = 0;
      const linesShape = new Shape();
      while ( lineY <= 2 * height ) {
        linesShape.moveTo( 0, lineY ).lineTo( 2 * width, lineY );
        lineY = lineY + 2 * options.hatchLineWidth;
      }

      const linesPath = new Path( linesShape, {
        stroke: options.hatchStroke,
        lineWidth: options.hatchLineWidth,
        //TODO clipArea
        center: rectangle.center,
        rotation: options.hatchAngle
      } );

      assert && assert( !options.children, 'HatchingRectangle sets children' );
      options.children = [ rectangle, linesPath ];

      assert && assert( !options.clipArea, 'HatchingRectangle sets clipArea' );
      options.clipArea = Shape.rectangle( 0, 0, width, height );

      super( options );
    }
  }

  return naturalSelection.register( 'HatchingRectangle', HatchingRectangle );
} );