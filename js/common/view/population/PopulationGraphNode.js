// Copyright 2019-2020, University of Colorado Boulder

/**
 * PopulationGraphNode displays the population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import DataProbeNode from './DataProbeNode.js';
import GenerationScrollControl from './GenerationScrollControl.js';
import PopulationGridNode from './PopulationGridNode.js';
import ZoomControl from './ZoomControl.js';

// const
const ZOOM_CONTROL_X_OFFSET = 5;
const X_AXIS_LABEL_OFFSET = 7;
const Y_AXIS_LABEL_OFFSET = 7;

class PopulationGraphNode extends Node {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {

    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

    options = merge( {
      graphWidth: 100,
      graphHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    }, options );

    // invisible rectangle that defines the bounds of this Node
    const boundsRectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight );

    // Generation (x-axis) scroll control
    const generationScrollControl = new GenerationScrollControl(
      populationModel.xRangeProperty, populationModel.generationsProperty, populationModel.isPlayingProperty, {
        labelString: naturalSelectionStrings.generation,
        tandem: options.tandem.createTandem( 'generationScrollControl' ),
        phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
      } );

    // Wrap generationScrollControl because we'll be observing its boundsProperty.
    const generationScrollControlWrapper = new Node( {
      children: [ generationScrollControl ]
    } );

    // y-axis (Population) label
    const yAxisLabelNode = new Text( naturalSelectionStrings.population, {
      font: NaturalSelectionConstants.POPULATION_AXIS_FONT,
      rotation: -Math.PI / 2,
      maxWidth: 90, // determined empirically
      tandem: options.tandem.createTandem( 'yAxisLabelNode' ),
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    } );

    // Wrap yAxisLabelNode because we'll be observing its boundsProperty.
    const yAxisLabelNodeWrapper = new Node( {
      children: [ yAxisLabelNode ]
    } );

    // Population (y-axis) zoom control
    const yZoomControl = new ZoomControl( populationModel.yZoomLevelProperty, {
      orientation: 'vertical',
      zoomLevelMin: populationModel.yZoomLevelProperty.range.min,
      zoomLevelMax: populationModel.yZoomLevelProperty.range.max,
      left: boundsRectangle.left,
      top: boundsRectangle.top,
      tandem: options.tandem.createTandem( 'yZoomControl' ),
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    } );

    //TODO fudge factors to fix wonky layout, need to account for tick marks
    const FUDGE_WIDTH = 27;
    const FUDGE_HEIGHT = 20;
    const FUDGE_X_SPACING = 8;

    // Dimensions of the 2D grid (sans tick marks) in view coordinates
    const gridWidth = options.graphWidth - yZoomControl.width - ZOOM_CONTROL_X_OFFSET - FUDGE_WIDTH;
    const gridHeight = options.graphHeight - generationScrollControl.height - X_AXIS_LABEL_OFFSET - FUDGE_HEIGHT;

    // the 2D grid, including tick marks
    const gridNode = new PopulationGridNode( populationModel, {
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      left: yZoomControl.right + ZOOM_CONTROL_X_OFFSET + FUDGE_X_SPACING,
      y: boundsRectangle.top
    } );

    const dataProbeNode = new DataProbeNode( populationModel, gridNode.x, gridWidth, gridHeight, {
      x: gridNode.x,
      top: gridNode.y,
      tandem: options.tandem.createTandem( 'dataProbeNode' )
    } );

    assert && assert( !options.children, 'PopulationGraphNode sets children' );
    options.children = [
      boundsRectangle, gridNode,
      generationScrollControlWrapper,
      yZoomControl, yAxisLabelNodeWrapper,
      dataProbeNode
    ];

    // center x-axis control under the graph
    generationScrollControl.boundsProperty.link( () => {
      generationScrollControl.centerX = gridNode.x + ( gridWidth / 2 );
      generationScrollControl.top = gridNode.bottom + X_AXIS_LABEL_OFFSET;
    } );

    // center y-axis label to left of graph
    yAxisLabelNode.boundsProperty.link( () => {
      yAxisLabelNode.right = yZoomControl.right + ZOOM_CONTROL_X_OFFSET - Y_AXIS_LABEL_OFFSET;
      yAxisLabelNode.centerY = gridNode.y + ( gridHeight / 2 );
    } );

    super( options );

    // @private
    this.dataProbeNode = dataProbeNode;
  }

  //TODO make this unnecessary
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

naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
export default PopulationGraphNode;