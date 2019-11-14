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
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ZoomControl = require( 'NATURAL_SELECTION/common/view/ZoomControl' );

  // strings
  const generationString = require( 'string!NATURAL_SELECTION/generation' );
  const populationString = require( 'string!NATURAL_SELECTION/population' );

  // const
  const ZOOM_CONTROL_X_OFFSET = 0;
  const X_AXIS_LABEL_OFFSET = 5;
  const Y_AXIS_LABEL_OFFSET = 7;
  const AXIS_LABEL_FONT = new PhetFont( 14 );

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

      // zoom control
      const zoomControl = new ZoomControl( populationModel.yZoomLevelProperty, {
        orientation: 'vertical',
        zoomLevelMax: 10,
        zoomLevelMin: 1,
        left: boundsRectangle.left,
        top: boundsRectangle.top
      } );

      // x-axis label
      const xAxisLabelNode = new Text( generationString, {
        font: AXIS_LABEL_FONT,
        centerX: boundsRectangle.centerX,
        bottom: boundsRectangle.bottom
      } );

      // y-axis label
      const yAxisLabelNode = new Text( populationString, {
        font: AXIS_LABEL_FONT,
        rotation: -Math.PI / 2,
        right: zoomControl.right + ZOOM_CONTROL_X_OFFSET - Y_AXIS_LABEL_OFFSET,
        centerY: boundsRectangle.centerY
      } );

      const width = options.graphWidth - zoomControl.width - ZOOM_CONTROL_X_OFFSET;
      const height = options.graphHeight - xAxisLabelNode.height - X_AXIS_LABEL_OFFSET;
      const graphNode = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE,
        left: zoomControl.right + ZOOM_CONTROL_X_OFFSET,
        top: boundsRectangle.top
      } );

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [ boundsRectangle, graphNode, zoomControl, xAxisLabelNode, yAxisLabelNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );