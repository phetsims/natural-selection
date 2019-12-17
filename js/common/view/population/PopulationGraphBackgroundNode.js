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
        fill: NaturalSelectionColors.POPULATION_GRAPH_FILL,
        stroke: NaturalSelectionColors.PANEL_STROKE
      } );

      // Grid lines for the x axis
      const xGridLines = new XGridLines( populationModel.xMaximumProperty, {
        xAxisWidth: populationModel.xAxisWidth,
        xAxisTickSpacing: populationModel.xAxisTickSpacing,
        backgroundWidth: options.backgroundWidth,
        backgroundHeight: options.backgroundHeight
      } );

      // Grid lines for the y axis
      const yGridLines = new YGridLines( populationModel.yMaximumProperty, () => populationModel.getYTickSpacing(), {
        backgroundWidth: options.backgroundWidth,
        backgroundHeight: options.backgroundHeight
      } );

      // Group the grid lines, in case we want to be able to show/hide them in the future.
      const gridLinesNode = new Node( {
        children: [ xGridLines, yGridLines ]
      } );

      assert && assert( !options.children, 'PopulationGraphBackgroundNode sets children' );
      options.children = [ rectangleNode, gridLinesNode ];

      super( options );
    }
  }

  /**
   * XGridLines draws the vertical grid lines for the x axis.  The x-axis tick spacing never changes, but the range
   * changes as time progresses.  So we create a single Shape for the x-axis grid lines, then translate it as the
   * x-axis range changes.  Bounds are clipped to the background dimensions.
   */
  class XGridLines extends Node {

    /**
     * @param {Property.<number>} xMaximumProperty
     * @param {Object} [options]
     */
    constructor( xMaximumProperty, options ) {

      options = merge( {
        xAxisWidth: 5,
        xAxisTickSpacing: 1,
        backgroundWidth: 100,
        backgroundHeight: 100,

        // Path options
        stroke: NaturalSelectionColors.GRID_LINES_STROKE,
        lineWidth: GRID_LINES_LINE_WIDTH
      }, options );

      // Compute the number of grid lines and their spacing in view coordinates
      const numberOfGridLines = Math.floor( options.xAxisWidth / options.xAxisTickSpacing ) + 1;
      const viewXSpacing = ( options.xAxisTickSpacing / options.xAxisWidth ) * options.backgroundWidth;

      // Create the grid lines
      const shape = new Shape();
      for ( let i = 0; i < numberOfGridLines; i++ ) {
        const x = options.backgroundWidth - ( i * viewXSpacing );
        shape.moveTo( x, 0 );
        shape.lineTo( x, options.backgroundHeight );
      }
      const path = new Path( shape, options );

      // Clip to the background, because we'll be translating the Path outside the bounds of the background.
      assert && assert( !options.clipArea, 'XGridLines sets clipArea' );
      options.clipArea = Shape.rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight );

      // Wrapped in a Node because we're going to translate the Path
      assert && assert( !options.children, 'XGridLines sets children' );
      options.children = [ path ];

      super( options );

      // Translate the grid lines as time progresses
      xMaximumProperty.link( xMaximum => {
        path.x = -viewXSpacing * ( ( xMaximum % options.xAxisTickSpacing ) / options.xAxisTickSpacing );
      } );
    }
  }

  /**
   * YGridLines draws the horizontal grid lines for the y axis.  The y-axis scale only changes on demand, when
   * the zoom control is used.  So we draw the y-axis grid lines separately from the x-axis grid lines, and
   * totally recreate their associated Shape when the scale changes.
   */
  class YGridLines extends Path {

    /**
     * @param {Property.<number>} yMaximumProperty
     * @param {function:number} getYTickSpacing
     * @param {Object} [options]
     */
    constructor( yMaximumProperty, getYTickSpacing, options ) {

      options = merge( {
        backgroundWidth: 100,
        backgroundHeight: 100,

        // Path options
        stroke: NaturalSelectionColors.GRID_LINES_STROKE,
        lineWidth: GRID_LINES_LINE_WIDTH
      }, options );

      super( new Shape(), options );

      // Adjust the y-axis grid lines when the y-axis scale changes.
      yMaximumProperty.link( yMaximum => {

        // Compute the number of grid lines and their spacing in view coordinates
        const yTickSpacing = getYTickSpacing();
        const numberOfGridLines = Math.floor( yMaximum / yTickSpacing ) + 1;
        const viewYSpacing = ( yTickSpacing / yMaximum ) * options.backgroundHeight;

        // Create the grid lines, skipping the line at y = 0.
        const shape = new Shape();
        for ( let i = 1; i < numberOfGridLines; i++ ) {
          const y = options.backgroundHeight - ( i * viewYSpacing );
          shape.moveTo( 0, y );
          shape.lineTo( options.backgroundWidth, y );
        }
        this.shape = shape;
      } );
    }
  }

  return naturalSelection.register( 'PopulationGraphBackgroundNode', PopulationGraphBackgroundNode );
} );