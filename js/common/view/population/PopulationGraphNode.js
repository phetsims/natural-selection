// Copyright 2019-2022, University of Colorado Boulder

/**
 * PopulationGraphNode displays the population graph. This graph is a performance concern, so plots are updated
 * only when they are visible, see PopulationPlotNode.updatePlot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import PlusMinusZoomButtonGroup from '../../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import { Node, Rectangle, Text } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import DataProbeNode from './DataProbeNode.js';
import PopulationGenerationScroller from './PopulationGenerationScroller.js';
import PopulationGridNode from './PopulationGridNode.js';
import PopulationPlotsNode from './PopulationPlotsNode.js';

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
      phetioVisiblePropertyInstrumented: false
    }, options );

    // invisible rectangle that defines the bounds of this Node
    const boundsRectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight );

    // Generation (x-axis) scroll control
    const generationScroller = new PopulationGenerationScroller(
      populationModel.xRangeProperty, populationModel.timeInGenerationsProperty, populationModel.isPlayingProperty, {
        tandem: options.tandem.createTandem( 'generationScroller' ),
        phetioVisiblePropertyInstrumented: false
      } );

    // y-axis (Population) label
    const yAxisLabelNode = new Text( naturalSelectionStrings.populationStringProperty, {
      font: NaturalSelectionConstants.POPULATION_AXIS_FONT,
      rotation: -Math.PI / 2,
      maxWidth: 90, // determined empirically
      tandem: options.tandem.createTandem( 'yAxisLabelNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    // Wrap yAxisLabelNode because we'll be observing its boundsProperty.
    const yAxisLabelNodeWrapper = new Node( {
      children: [ yAxisLabelNode ]
    } );

    // Population (y-axis) zoom buttons
    const yZoomButtonGroup = new PlusMinusZoomButtonGroup( populationModel.yZoomLevelProperty, {
      orientation: 'vertical',
      touchAreaXDilation: 7,
      touchAreaYDilation: 4,
      left: boundsRectangle.left,
      top: boundsRectangle.top,
      tandem: options.tandem.createTandem( 'yZoomButtonGroup' ),
      phetioVisiblePropertyInstrumented: false
    } );

    // Dimensions of the 2D grid (sans tick marks) in view coordinates
    const gridWidth = options.graphWidth - yZoomButtonGroup.width - Y_AXIS_LABEL_SPACING;
    const gridHeight = options.graphHeight - generationScroller.height - X_TICK_MARKS_HEIGHT - X_AXIS_LABEL_SPACING;

    // the 2D grid, including tick marks
    const gridNode = new PopulationGridNode( populationModel, {
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      x: yZoomButtonGroup.right + Y_AXIS_LABEL_SPACING,
      y: boundsRectangle.top
    } );

    // The complete set of plots
    const plotsNode = new PopulationPlotsNode( populationModel, {
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      translation: gridNode.translation
    } );

    const dataProbeNode = new DataProbeNode( populationModel, {
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      offset: new Vector2( gridNode.x, 0 ),
      tandem: options.tandem.createTandem( 'dataProbeNode' )
    } );

    const zoomOutToSeeDataText = new Text( naturalSelectionStrings.zoomOutToSeeDataStringProperty, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT,
      maxWidth: 0.75 * gridWidth,
      centerX: gridNode.x + gridWidth / 2,
      centerY: gridNode.y + gridHeight / 2,
      tandem: options.tandem.createTandem( 'zoomOutToSeeDataText' ),
      phetioVisiblePropertyInstrumented: false
    } );

    assert && assert( !options.children, 'PopulationGraphNode sets children' );
    options.children = [
      boundsRectangle, gridNode,
      generationScroller,
      yZoomButtonGroup, yAxisLabelNodeWrapper,
      plotsNode,
      zoomOutToSeeDataText,
      dataProbeNode
    ];

    // Center x-axis control under the graph. unlink is not necessary.
    generationScroller.localBoundsProperty.link( () => {
      generationScroller.centerX = gridNode.x + ( gridWidth / 2 );
      generationScroller.top = gridNode.bottom + X_AXIS_LABEL_SPACING;
    } );

    // Center y-axis label to left of graph. unlink is not necessary.
    yAxisLabelNode.localBoundsProperty.link( () => {
      yAxisLabelNode.right = yZoomButtonGroup.right;
      yAxisLabelNode.centerY = gridNode.y + ( gridHeight / 2 );
    } );

    // If the plot has data that is not visible, display 'Zoom out to see data.'
    // unlink is not necessary.
    assert && assert( plotsNode.clipArea, 'plotsNode.clipArea is required' );
    plotsNode.localBoundsProperty.link( localBounds => {
      zoomOutToSeeDataText.visible = !localBounds.equals( Bounds2.NOTHING ) &&
                                     !localBounds.intersectsBounds( plotsNode.clipArea.bounds );
    } );

    super( options );
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