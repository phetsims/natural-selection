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
  const GRID_LINES_LINE_WIDTH = 1;
  const TICK_MARKS_LINE_WIDTH = 1;
  const TICK_MARKS_LENGTH = 3;

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

      // Background rectangle
      const rectangleNode = new Rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight, {
        fill: NaturalSelectionColors.POPULATION_GRAPH_FILL
      } );

      // Grid lines for the x axis
      const xGridLines = new VerticalLines( populationModel.xMaximumProperty, {
        xAxisWidth: populationModel.xAxisWidth,
        xAxisTickSpacing: populationModel.xAxisTickSpacing,
        stroke: NaturalSelectionColors.GRID_LINES_STROKE,
        lineWidth: GRID_LINES_LINE_WIDTH,
        backgroundWidth: options.backgroundWidth,
        lineLength: options.backgroundHeight,

        // Clip to the background bounds, because we'll be horizontally translating the x grid lines
        clipArea: Shape.rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight )
      } );

      // Grid lines for the y axis
      const yGridLines = new HorizontalLines( populationModel.yMaximumProperty, () => populationModel.getYTickSpacing(), {
        stroke: NaturalSelectionColors.GRID_LINES_STROKE,
        lineWidth: GRID_LINES_LINE_WIDTH,
        lineLength: options.backgroundWidth,
        backgroundHeight: options.backgroundHeight
      } );

      // Group the grid lines, in case we want to be able to show/hide them in the future.
      const gridLinesNode = new Node( {
        children: [ xGridLines, yGridLines ]
      } );

      // Tick marks for the x axis
      const xTickMarks = new VerticalLines( populationModel.xMaximumProperty, {
        xAxisWidth: populationModel.xAxisWidth,
        xAxisTickSpacing: populationModel.xAxisTickSpacing,
        backgroundWidth: options.backgroundWidth,
        lineLength: TICK_MARKS_LENGTH,
        stroke: NaturalSelectionColors.TICK_MARKS_STROKE,
        lineWidth: TICK_MARKS_LINE_WIDTH,
        top: rectangleNode.bottom,

        // Clip to the tick mark bounds below the x axis, because we'll be horizontally translating the x tick marks
        clipArea: Shape.rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight + TICK_MARKS_LENGTH )
      } );

      // Tick marks for the y axis
      const yTickMarks = new HorizontalLines( populationModel.yMaximumProperty, () => populationModel.getYTickSpacing(), {
        lineLength: TICK_MARKS_LENGTH,
        backgroundHeight: options.backgroundHeight,
        stroke: NaturalSelectionColors.TICK_MARKS_STROKE,
        lineWidth: TICK_MARKS_LINE_WIDTH,
        right: rectangleNode.left
      } );

      // Group the tick marks, in case we want to be able to show/hide them in the future.
      const tickMarksNode = new Node( {
        children: [ xTickMarks, yTickMarks ]
      } );

      // A crisp frame in the foreground, to hide overlapping of tick marks and grid lines
      const frameNode = new Rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight, {
        stroke: NaturalSelectionColors.PANEL_STROKE,
        lineWidth: 1.5
      } );

      assert && assert( !options.children, 'PopulationGraphBackgroundNode sets children' );
      options.children = [ rectangleNode, gridLinesNode, tickMarksNode, frameNode ];

      super( options );
    }
  }

  /**
   * VerticalLines are used for x-axis tick marks and grid lines.  The x-axis tick spacing never changes, but the range
   * changes as time progresses.  So we create a single Shape for the vertical lines, then translate it as the
   * x-axis range changes.  Bounds are clipped to the background dimensions.
   */
  class VerticalLines extends Node {

    /**
     * @param {Property.<number>} xMaximumProperty
     * @param {Object} [options]
     */
    constructor( xMaximumProperty, options ) {

      options = merge( {
        xAxisWidth: 5,
        xAxisTickSpacing: 1,
        backgroundWidth: 100,
        lineLength: 100
      }, options );

      // Compute the number of grid lines and their spacing in view coordinates
      const numberOfGridLines = Math.floor( options.xAxisWidth / options.xAxisTickSpacing ) + 1;
      const viewXSpacing = ( options.xAxisTickSpacing / options.xAxisWidth ) * options.backgroundWidth;

      // Create the grid lines
      const shape = new Shape();
      for ( let i = 0; i < numberOfGridLines; i++ ) {
        const x = options.backgroundWidth - ( i * viewXSpacing );
        shape.moveTo( x, 0 );
        shape.lineTo( x, options.lineLength );
      }
      const path = new Path( shape, options );

      // Wrapped in a Node because we're going to translate the Path
      assert && assert( !options.children, 'VerticalLines sets children' );
      options.children = [ path ];

      // Translate the grid lines as time progresses
      xMaximumProperty.link( xMaximum => {
        path.x = -viewXSpacing * ( ( xMaximum % options.xAxisTickSpacing ) / options.xAxisTickSpacing );
      } );

      super(  options );
    }
  }

  /**
   * HorizontalLines are used for y-axis tick marks and grid lines. The y-axis scale only changes on demand, when
   * the zoom control is used.  So we draw the horizontal lines separately from the vertical lines, and
   * totally recreate their associated Shape when the scale changes.
   */
  class HorizontalLines extends Path {

    /**
     * @param {Property.<number>} yMaximumProperty
     * @param {function:number} getYTickSpacing
     * @param {Object} [options]
     */
    constructor( yMaximumProperty, getYTickSpacing, options ) {

      options = merge( {
        lineLength: 100,
        backgroundHeight: 100
      }, options );

      super( new Shape() );

      // Adjust the y-axis grid lines when the y-axis scale changes.
      yMaximumProperty.link( yMaximum => {

        // Compute the number of grid lines and their spacing in view coordinates
        const yTickSpacing = getYTickSpacing();
        const numberOfGridLines = Math.floor( yMaximum / yTickSpacing ) + 1;
        const viewYSpacing = ( yTickSpacing / yMaximum ) * options.backgroundHeight;

        // Create the grid lines
        const shape = new Shape();
        for ( let i = 0; i < numberOfGridLines; i++ ) {
          const y = options.backgroundHeight - ( i * viewYSpacing );
          shape.moveTo( 0, y );
          shape.lineTo( options.lineLength, y );
        }
        this.shape = shape;
      } );

      this.mutate( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphBackgroundNode', PopulationGraphBackgroundNode );
} );