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
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ScrollControl = require( 'NATURAL_SELECTION/common/view/population/ScrollControl' );
  const Tandem = require( 'TANDEM/Tandem' );
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
        graphHeight: 100,
        
        // phet-io
        tandem: Tandem.required
      }, options );

      // invisible rectangle that defines the bounds of this Node
      const boundsRectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight );

      // y-axis zoom control
      const yZoomControl = new ZoomControl( populationModel.yZoomLevelProperty, {
        orientation: 'vertical',
        zoomLevelMax: 10,
        zoomLevelMin: 1,
        left: boundsRectangle.left,
        top: boundsRectangle.top,
        tandem: options.tandem.createTandem( 'yZoomControl' )
      } );

      // y-axis (Population) label
      const yAxisLabelNode = new Text( populationString, {
        font: NaturalSelectionConstants.POPULATION_AXIS_FONT,
        rotation: -Math.PI / 2,
        right: yZoomControl.right + ZOOM_CONTROL_X_OFFSET - Y_AXIS_LABEL_OFFSET,
        centerY: boundsRectangle.centerY,
        maxWidth: 120 // determined empirically
      } );
      
      // x-axis scroll control
      const xScrollControl = new ScrollControl( generationString, {
        tandem: options.tandem.createTandem( 'xScrollControl' )
      } );

      //TODO placeholder
      // XY plot
      const plotWidth = options.graphWidth - yZoomControl.width - ZOOM_CONTROL_X_OFFSET;
      const plotHeight = options.graphHeight - xScrollControl.height - X_AXIS_LABEL_OFFSET;
      const plotNode = new Rectangle( 0, 0, plotWidth, plotHeight, {
        fill: NaturalSelectionColors.POPULATION_GRAPH_FILL,
        stroke: NaturalSelectionColors.PANEL_STROKE,
        left: yZoomControl.right + ZOOM_CONTROL_X_OFFSET,
        top: boundsRectangle.top,
        tandem: options.tandem.createTandem( 'plotNode' )
      } );

      // center x-axis control under the graph
      xScrollControl.centerX = plotNode.centerX;
      xScrollControl.top = plotNode.bottom + X_AXIS_LABEL_OFFSET;

      const valuesMarkerNode = new ValuesMarkerNode( populationModel, plotNode.x, plotWidth, plotHeight, {
        x: plotNode.x,
        top: plotNode.top,
        tandem: options.tandem.createTandem( 'valuesMarkerNode' )
      } );

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [ boundsRectangle, plotNode, xScrollControl, yZoomControl, yAxisLabelNode, valuesMarkerNode ];

      super( options );

      // @private
      this.valuesMarkerNode = valuesMarkerNode;
    }

    /**
     * @public
     */
    reset() {
      this.valuesMarkerNode.reset();
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );