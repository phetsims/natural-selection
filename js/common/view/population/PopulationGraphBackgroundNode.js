// Copyright 2019, University of Colorado Boulder

/**
 * PopulationGraphBackgroundNode is the background for the Population graph, including dynamic grid lines.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const GRID_LINES_OPTIONS = {
    stroke: NaturalSelectionColors.GRID_LINES_STROKE,
    lineWidth: 1
  };

  class PopulationGraphBackgroundNode extends Node {

    /**
     * @param {PopulationModel} populationModel
     * @param {Object} [options]
     */
    constructor( populationModel, options ) {

      options = merge( {
        backgroundWidth: 100,
        backgroundHeight: 100
      }, options );

      const rectangleNode = new Rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight, {
        fill: NaturalSelectionColors.POPULATION_GRAPH_FILL,
        stroke: NaturalSelectionColors.PANEL_STROKE
      } );

      // Grid lines for the x axis
      const xGridLines = new XGridLines(
        populationModel.xMaximumProperty,
        populationModel.xAxisWidth,
        populationModel.xAxisTickSpacing,
        options.backgroundWidth,
        options.backgroundHeight
      );

      // Grid lines for the y axis
      const yGridLines = new YGridLines(
        populationModel.yMaximumProperty.value,
        populationModel.getYTickSpacing(),
        options.backgroundWidth,
        options.backgroundHeight
      );

      // Group the grid lines, in case we want to be able to show/hide them in the future.
      const gridLinesNode = new Node( {
        children: [ xGridLines, yGridLines ]
      } );

      assert && assert( !options.children, 'PopulationGraphBackgroundNode sets children' );
      options.children = [ rectangleNode, gridLinesNode ];

      super( options );

      // Adjust the y-axis grid lines when the y-axis scale changes.
      populationModel.yMaximumProperty.link( yMaximum => {
        yGridLines.setAxisScale( populationModel.yMaximumProperty.value, populationModel.getYTickSpacing() );
      } );
    }
  }

  /**
   * XGridLines draws the vertical grid lines for the x axis.  The x-axis tick spacing never changes, but the range
   * does shift from left-to-right as time progresses.  So we create a single Shape for the x-axis grid lines, then
   * translate it as the x-axis range changes.  Bounds are clipped to the plot.
   */
  class XGridLines extends Node {

    constructor( xMaximumProperty, xAxisWidth, xTickSpacing, backgroundWidth, backgroundHeight, options ) {

      options = merge( {}, options );

      // Compute the number of grid lines and their spacing in view coordinates
      const numberOfGridLines = Math.floor( xAxisWidth / xTickSpacing ) + 1;
      const viewXSpacing = ( xTickSpacing / xAxisWidth ) * backgroundWidth;

      // Create the grid lines
      const shape = new Shape();
      for ( let i = 0; i < numberOfGridLines; i++ ) {
        const x = backgroundWidth - ( i * viewXSpacing );
        shape.moveTo( x, 0 );
        shape.lineTo( x, backgroundHeight );
      }
      const path = new Path( shape, GRID_LINES_OPTIONS );

      // Clip to the plot
      assert && assert( !options.clipArea, 'XGridLines sets clipArea' );
      options.clipArea = Shape.rectangle( 0, 0, backgroundWidth, backgroundHeight );

      assert && assert( !options.children, 'XGridLines sets children' );
      options.children = [ path ];

      super( options );

      // Translate the grid lines as time progresses
      xMaximumProperty.link( xMaximum => {
        path.x = -viewXSpacing * ( ( xMaximum % xTickSpacing ) / xTickSpacing );
      } );
    }
  }

  /**
   * YGridLines draws the horizontal grid lines for the y axis.  The y-axis scale only changes on demand, when
   * the zoom control is used.  So we draw the y-axis grid lines separately from the x-axis grid lines, and
   * totally recreate their associated Shape.
   */
  class YGridLines extends Path {

    /**
     * @param {number} yMaximum
     * @param {number} yTickSpacing
     * @param {number} backgroundWidth
     * @param {number} backgroundHeight
     * @param {Object} [options]
     */
    constructor( yMaximum, yTickSpacing, backgroundWidth, backgroundHeight, options ) {

      options = merge( {}, GRID_LINES_OPTIONS, options );

      super( new Shape(), options );

      // @private
      this.backgroundWidth = backgroundWidth;
      this.backgroundHeight = backgroundHeight;

      this.setAxisScale( yMaximum, yTickSpacing );
    }

    /**
     * Updates the scale for the y axis.
     * @param {number} yMaximum
     * @param {number} yTickSpacing
     */
    setAxisScale( yMaximum, yTickSpacing ) {

      // Compute the number of grid lines and their spacing in view coordinates
      const numberOfGridLines = Math.floor( yMaximum / yTickSpacing ) + 1;
      const viewYSpacing = ( yTickSpacing / yMaximum ) * this.backgroundHeight;

      // Create the grid lines
      const shape = new Shape();
      for ( let i = 1; i < numberOfGridLines; i++ ) {
        const y = this.backgroundHeight - ( i * viewYSpacing );
        shape.moveTo( 0, y );
        shape.lineTo( this.backgroundWidth, y );
      }
      this.shape = shape;
    }
  }

  return naturalSelection.register( 'PopulationGraphBackgroundNode', PopulationGraphBackgroundNode );
} );