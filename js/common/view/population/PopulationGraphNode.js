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
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PopulationGraphBackgroundNode = require( 'NATURAL_SELECTION/common/view/population/PopulationGraphBackgroundNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
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
        maxWidth: 120 // determined empirically
      } );

      //TODO fudge factors to fix wonky layout, need to account for tick marks
      const FUDGE_WIDTH = 40;
      const FUDGE_HEIGHT = 20;
      const FUDGE_X_SPACING = 20;

      //TODO better names for these
      // XY plot
      const plotWidth = options.graphWidth - populationZoomControl.width - ZOOM_CONTROL_X_OFFSET - FUDGE_WIDTH;
      const plotHeight = options.graphHeight - generationScrollControl.height - X_AXIS_LABEL_OFFSET - FUDGE_HEIGHT;

      const backgroundNode = new PopulationGraphBackgroundNode( populationModel, {
        backgroundWidth: plotWidth,
        backgroundHeight: plotHeight,
        left: populationZoomControl.right + ZOOM_CONTROL_X_OFFSET + FUDGE_X_SPACING,
        y: boundsRectangle.top
      } );

      // center x-axis control under the graph
      generationScrollControl.centerX = backgroundNode.x + ( plotWidth / 2 );
      generationScrollControl.top = backgroundNode.bottom + X_AXIS_LABEL_OFFSET;
      yAxisLabelNode.right = populationZoomControl.right + ZOOM_CONTROL_X_OFFSET - Y_AXIS_LABEL_OFFSET;
      yAxisLabelNode.centerY = backgroundNode.y + ( plotHeight / 2 );

      const dataProbeNode = new DataProbeNode( populationModel, backgroundNode.x, plotWidth, plotHeight, {
        x: backgroundNode.x,
        top: backgroundNode.y,
        tandem: options.tandem.createTandem( 'dataProbeNode' )
      } );

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [
        boundsRectangle, backgroundNode,
        generationScrollControl,
        populationZoomControl, yAxisLabelNode,
        dataProbeNode
      ];

      super( options );

      // @private
      this.dataProbeNode = dataProbeNode;
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

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );