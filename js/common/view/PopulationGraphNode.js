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
  const X_MARGIN = 5;
  const Y_MARGIN = 5;
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

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE
      } );

      // x-axis label
      const xAxisLabelNode = new Text( generationString, {
        font: AXIS_LABEL_FONT,
        centerX: rectangle.centerX,
        bottom: rectangle.bottom - 8
      } );

      // y-axis label
      const yAxisLabelNode = new Text( populationString, {
        font: AXIS_LABEL_FONT,
        rotation: -Math.PI / 2,
        left: rectangle.left + 8,
        centerY: rectangle.centerY
      } );

      // zoom control
      const zoomControl = new ZoomControl( populationModel.yZoomLevelProperty, {
        orientation: 'vertical',
        zoomLevelMax: 10,
        zoomLevelMin: 1,
        left: rectangle.left + X_MARGIN,
        top: rectangle.top + Y_MARGIN
      } );

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [ rectangle, zoomControl, xAxisLabelNode, yAxisLabelNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );