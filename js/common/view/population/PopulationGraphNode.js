// Copyright 2019, University of Colorado Boulder

/**
 * PopulationGraphNode displays the population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DataProbeNode = require( 'NATURAL_SELECTION/common/view/population/DataProbeNode' );
  const GenerationScrollControl = require( 'NATURAL_SELECTION/common/view/population/GenerationScrollControl' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ZoomControl = require( 'NATURAL_SELECTION/common/view/population/ZoomControl' );

  // strings
  const generationString = require( 'string!NATURAL_SELECTION/generation' );
  const populationString = require( 'string!NATURAL_SELECTION/population' );

  // const
  const ZOOM_CONTROL_X_OFFSET = 5;
  const X_AXIS_LABEL_OFFSET = 5;
  const Y_AXIS_LABEL_OFFSET = 7;
  const GRID_LINES_OPTIONS = {
    stroke: NaturalSelectionColors.GRID_LINES_STROKE,
    lineWidth: 1
  };

  class PopulationGraphNode extends Node {

    /**
     * @param {PopulationModel} populationModel
     * @param {Object} [options]
     */
    constructor( populationModel, options ) {

      options = merge( {
        graphWidth: 100,
        graphHeight: 100,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // invisible rectangle that defines the bounds of this Node
      const boundsRectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight );

      // Generation (x-axis) scroll control
      const generationScrollControl = new GenerationScrollControl(
        populationModel.xMaximumProperty, populationModel.generationsProperty, populationModel.isPlayingProperty, {
          scrollWidth: populationModel.xAxisWidth,
          labelString: generationString,
          tandem: options.tandem.createTandem( 'generationScrollControl' )
        } );

      // Population (y-axis) zoom control
      const populationZoomControl = new ZoomControl( populationModel.yZoomIndexProperty, {
        orientation: 'vertical',
        zoomLevelMin: populationModel.yZoomIndexProperty.range.min,
        zoomLevelMax: populationModel.yZoomIndexProperty.range.max,
        left: boundsRectangle.left,
        top: boundsRectangle.top,
        tandem: options.tandem.createTandem( 'populationZoomControl' )
      } );

      // y-axis (Population) label
      const yAxisLabelNode = new Text( populationString, {
        font: NaturalSelectionConstants.POPULATION_AXIS_FONT,
        rotation: -Math.PI / 2,
        right: populationZoomControl.right + ZOOM_CONTROL_X_OFFSET - Y_AXIS_LABEL_OFFSET,
        centerY: boundsRectangle.centerY,
        maxWidth: 120 // determined empirically
      } );

      //TODO placeholder
      // XY plot
      const plotWidth = options.graphWidth - populationZoomControl.width - ZOOM_CONTROL_X_OFFSET;
      const plotHeight = options.graphHeight - generationScrollControl.height - X_AXIS_LABEL_OFFSET;
      const plotNode = new Rectangle( 0, 0, plotWidth, plotHeight, {
        fill: NaturalSelectionColors.POPULATION_GRAPH_FILL,
        stroke: NaturalSelectionColors.PANEL_STROKE,
        left: populationZoomControl.right + ZOOM_CONTROL_X_OFFSET,
        top: boundsRectangle.top,
        tandem: options.tandem.createTandem( 'plotNode' )
      } );

      // Frame around the plot, so that we don't see overlapping tick marks and grid lines.
      const plotFrameNode = new Rectangle( 0, 0, plotWidth, plotHeight, {
        stroke: NaturalSelectionColors.PANEL_STROKE,
        x: plotNode.x,
        y: plotNode.y
      } );

      //TODO this needs to be done better
      const gridLinesOptions = {
        x: plotNode.x,
        y: plotNode.y
      };

      // Grid lines for the x axis
      const xGridLines = new XGridLines(
        populationModel.xMaximumProperty,
        populationModel.xAxisWidth,
        populationModel.xAxisTickSpacing,
        plotWidth,
        plotHeight,
        gridLinesOptions
        );

      // Grid lines for the y axis
      const yGridLines = new YGridLines(
        populationModel.yMaximumProperty.value,
        populationModel.getYTickSpacing(),
        plotWidth,
        plotHeight,
        gridLinesOptions
      );

      // center x-axis control under the graph
      generationScrollControl.centerX = plotNode.centerX;
      generationScrollControl.top = plotNode.bottom + X_AXIS_LABEL_OFFSET;

      const dataProbeNode = new DataProbeNode( populationModel, plotNode.x, plotWidth, plotHeight, {
        x: plotNode.x,
        top: plotNode.top,
        tandem: options.tandem.createTandem( 'dataProbeNode' )
      } );

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [
        boundsRectangle, plotNode,
        generationScrollControl, xGridLines,
        populationZoomControl, yAxisLabelNode, yGridLines,
        plotFrameNode,
        dataProbeNode
      ];

      super( options );

      // @private
      this.dataProbeNode = dataProbeNode;

      // Adjust the y-axis grid lines when the y-axis scale changes.
      populationModel.yMaximumProperty.link( yMaximum => {
        yGridLines.setAxisScale( populationModel.yMaximumProperty.value, populationModel.getYTickSpacing() );
      } );
    }

    /**
     * @public
     */
    reset() {
      this.dataProbeNode.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'PopulationGraphNode does not support dispose' );
    }
  }

  /**
   * XGridLines draws the vertical grid lines for the x axis.  The x-axis tick spacing never changes, but the range
   * does shift from left-to-right as time progresses.  So we create a single Shape for the x-axis grid lines, then
   * translate it as the x-axis range changes.  Bounds are clipped to the plot.
   */
  class XGridLines extends Node {

    constructor( xMaximumProperty, xAxisWidth, xTickSpacing, plotWidth, plotHeight, options ) {

      options = merge( {}, options );

      // Compute the number of grid lines and their spacing in view coordinates
      const numberOfGridLines = Math.floor( xAxisWidth / xTickSpacing ) + 1;
      const viewXSpacing = ( xTickSpacing / xAxisWidth ) * plotWidth;

      // Create the grid lines
      const shape = new Shape();
      for ( let i = 0; i < numberOfGridLines; i++ ) {
        const x = plotWidth - ( i * viewXSpacing );
        shape.moveTo( x, 0 );
        shape.lineTo( x, plotHeight );
      }
      const path = new Path( shape, GRID_LINES_OPTIONS );

      // Clip to the plot
      assert && assert( !options.clipArea, 'XGridLines sets clipArea' );
      options.clipArea = Shape.rectangle( 0, 0, plotWidth, plotHeight );

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
     * @param {number} plotWidth
     * @param {number} plotHeight
     * @param {Object} [options]
     */
    constructor( yMaximum, yTickSpacing, plotWidth, plotHeight, options ) {

      options = merge( {}, GRID_LINES_OPTIONS, options );

      super( new Shape(), options );

      // @private
      this.plotWidth = plotWidth;
      this.plotHeight = plotHeight;

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
      const viewYSpacing = ( yTickSpacing / yMaximum ) * this.plotHeight;

      // Create the grid lines
      const shape = new Shape();
      for ( let i = 1; i < numberOfGridLines; i++ ) {
        const y = this.plotHeight - ( i * viewYSpacing );
        shape.moveTo( 0, y );
        shape.lineTo( this.plotWidth, y );
      }
      this.shape = shape;
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );