// Copyright 2019, University of Colorado Boulder

/**
 * PopulationGraphNode displays the population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PanControl = require( 'NATURAL_SELECTION/common/view/population/PanControl' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ValuesMarkerNode = require( 'NATURAL_SELECTION/common/view/population/ValuesMarkerNode' );
  const ZoomControl = require( 'NATURAL_SELECTION/common/view/population/ZoomControl' );

  // strings
  const generationString = require( 'string!NATURAL_SELECTION/generation' );
  const populationString = require( 'string!NATURAL_SELECTION/population' );

  // const
  const ZOOM_CONTROL_X_OFFSET = 5;
  const X_AXIS_LABEL_OFFSET = 5;
  const Y_AXIS_LABEL_OFFSET = 7;

  class PopulationGraphNode extends Node {

    /**
     * @param {PopulationModel} populationModel
     * @param {Object} [options]
     */
    constructor( populationModel, options ) {

      options = merge( {
        graphWidth: 100,
        graphHeight: 100
      }, options );

      // invisible rectangle that defines the bounds of this Node
      const boundsRectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight );

      // y-axis zoom control
      const yZoomControl = new ZoomControl( populationModel.yZoomLevelProperty, {
        orientation: 'vertical',
        zoomLevelMax: 10,
        zoomLevelMin: 1,
        left: boundsRectangle.left,
        top: boundsRectangle.top
      } );

      // y-axis (Population) label
      const yAxisLabelNode = new Text( populationString, {
        font: NaturalSelectionConstants.POPULATION_AXIS_FONT,
        rotation: -Math.PI / 2,
        right: yZoomControl.right + ZOOM_CONTROL_X_OFFSET - Y_AXIS_LABEL_OFFSET,
        centerY: boundsRectangle.centerY,
        maxWidth: 120 // determined empirically
      } );
      
      // x-axis pan control
      const xPanControl = new PanControl( generationString );

      //TODO placeholder
      // graph
      const graphWidth = options.graphWidth - yZoomControl.width - ZOOM_CONTROL_X_OFFSET;
      const graphHeight = options.graphHeight - xPanControl.height - X_AXIS_LABEL_OFFSET;
      const graphNode = new Rectangle( 0, 0, graphWidth, graphHeight, {
        fill: NaturalSelectionColors.POPULATION_GRAPH_FILL,
        stroke: NaturalSelectionColors.PANEL_STROKE,
        left: yZoomControl.right + ZOOM_CONTROL_X_OFFSET,
        top: boundsRectangle.top
      } );

      // center x-axis control under the graph
      xPanControl.centerX = graphNode.centerX;
      xPanControl.top = graphNode.bottom + X_AXIS_LABEL_OFFSET;

      const valuesMarkerNode = new ValuesMarkerNode( populationModel, graphHeight, {
        left: graphNode.left + 20, //TODO
        top: graphNode.top
      } );

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [ boundsRectangle, graphNode, xPanControl, yZoomControl, yAxisLabelNode, valuesMarkerNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );