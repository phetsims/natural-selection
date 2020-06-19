// Copyright 2019-2020, University of Colorado Boulder

/**
 * PopulationGraphNode displays the population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../../dot/js/Range.js';
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
import PopulationPlotsNode from './PopulationPlotsNode.js';
import ZoomControl from './ZoomControl.js';

// const
const X_TICK_MARKS_HEIGHT = 20; // height of x-axis tick marks, determined empirically
const X_AXIS_LABEL_SPACING = 7; // space between x-axis 'Generation' label/control and x-axis tick marks)
const Y_AXIS_LABEL_SPACING = 40; // space between y zoom control and y axis (not y tick marks)

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

    // Dimensions of the 2D grid (sans tick marks) in view coordinates
    const gridWidth = options.graphWidth - yZoomControl.width - Y_AXIS_LABEL_SPACING;
    const gridHeight = options.graphHeight - generationScrollControl.height - X_TICK_MARKS_HEIGHT - X_AXIS_LABEL_SPACING;

    // the 2D grid, including tick marks
    const gridNode = new PopulationGridNode( populationModel, {
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      x: yZoomControl.right + Y_AXIS_LABEL_SPACING,
      y: boundsRectangle.top
    } );

    // The complete set of plots
    const plotsNode = new PopulationPlotsNode( populationModel, {
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      translation: gridNode.translation
    } );

    const dataProbeXRange = new Range( gridNode.x, gridNode.x + gridWidth );
    const dataProbeNode = new DataProbeNode( populationModel, dataProbeXRange, gridHeight, {
      x: gridNode.x,
      top: gridNode.y,
      tandem: options.tandem.createTandem( 'dataProbeNode' )
    } );

    assert && assert( !options.children, 'PopulationGraphNode sets children' );
    options.children = [
      boundsRectangle, gridNode,
      generationScrollControlWrapper,
      yZoomControl, yAxisLabelNodeWrapper,
      plotsNode,
      dataProbeNode
    ];

    // Center x-axis control under the graph. unlink is not necessary.
    generationScrollControl.boundsProperty.link( () => {
      generationScrollControl.centerX = gridNode.x + ( gridWidth / 2 );
      generationScrollControl.top = gridNode.bottom + X_AXIS_LABEL_SPACING;
    } );

    // Center y-axis label to left of graph. unlink is not necessary.
    yAxisLabelNode.boundsProperty.link( () => {
      yAxisLabelNode.right = yZoomControl.right;
      yAxisLabelNode.centerY = gridNode.y + ( gridHeight / 2 );
    } );

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
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
export default PopulationGraphNode;