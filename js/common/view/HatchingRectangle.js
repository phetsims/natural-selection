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
        fill: 'black',
        hatchStroke: 'white',
        hatchLineWidth: 5,
        hatchAngle: -Math.PI / 4
      }, options );

      super( x, y, width, height, options );

      let lineY = 0;
      const linesShape = new Shape();
      while ( lineY <= height ) {
        linesShape.moveTo( 0, lineY )
          .lineTo( width, lineY )
          .moveTo( width, lineY + options.hatchLineWidth )
          .lineTo( 0, lineY + options.hatchLineWidth );
        lineY = lineY + 2 * options.hatchLineWidth;
      }

      this.linesPath = new Path( linesShape, {
        stroke: options.hatchStroke,
        lineWidth: options.hatchLineWidth
        // clipArea: this.shape
        // center: this.center,
        // rotation: options.hatchAngle
      } );
      this.addChild( this.linesPath );
    }
  }

  return naturalSelection.register( 'HatchingRectangle', HatchingRectangle );
} );