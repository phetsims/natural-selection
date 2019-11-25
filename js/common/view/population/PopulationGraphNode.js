// Copyright 2019, University of Colorado Boulder

/**
 * PopulationGraphNode displays the population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ZoomControl = require( 'NATURAL_SELECTION/common/view/population/ZoomControl' );

  // strings
  const generationString = require( 'string!NATURAL_SELECTION/generation' );
  const populationString = require( 'string!NATURAL_SELECTION/population' );

  // const
  const ZOOM_CONTROL_X_OFFSET = 5;
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

      // y-axis zoom control
      const yZoomControl = new ZoomControl( populationModel.yZoomLevelProperty, {
        orientation: 'vertical',
        zoomLevelMax: 10,
        zoomLevelMin: 1,
        left: boundsRectangle.left,
        top: boundsRectangle.top
      } );

      // x-axis (Generation) label
      const xAxisLabelNode = new Text( generationString, {
        font: AXIS_LABEL_FONT,
        centerX: boundsRectangle.centerX,
        bottom: boundsRectangle.bottom,
        maxWidth: 120 // determined empirically
      } );

      // y-axis (Population) label
      const yAxisLabelNode = new Text( populationString, {
        font: AXIS_LABEL_FONT,
        rotation: -Math.PI / 2,
        right: yZoomControl.right + ZOOM_CONTROL_X_OFFSET - Y_AXIS_LABEL_OFFSET,
        centerY: boundsRectangle.centerY,
        maxWidth: 120 // determined empirically
      } );

      // x-axis scroll buttons, on either side of the x-axis (Generation) label
      const previous = () => {}; //TODO
      const next = () => {}; //TODO
      const previousButton = new ArrowButton( 'left', previous, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS );
      const nextButton = new ArrowButton( 'right', next, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS );
      const xScrollControl = new HBox( {
        spacing: 10,
        children: [ previousButton, xAxisLabelNode, nextButton ]
      } );

      //TODO placeholder
      // graph
      const width = options.graphWidth - yZoomControl.width - ZOOM_CONTROL_X_OFFSET;
      const height = options.graphHeight - xScrollControl.height - X_AXIS_LABEL_OFFSET;
      const graphNode = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE,
        left: yZoomControl.right + ZOOM_CONTROL_X_OFFSET,
        top: boundsRectangle.top
      } );

      // center x-axis control under the graph
      xScrollControl.centerX = graphNode.centerX;
      xScrollControl.top = graphNode.bottom + X_AXIS_LABEL_OFFSET;

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [ boundsRectangle, graphNode, xScrollControl, yZoomControl, yAxisLabelNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );