// Copyright 2020, University of Colorado Boulder

/**
 * PopulationPlotsNode is the complete set of plots for the Population graph, clipped to the graph's grid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../../naturalSelection.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';
import PopulationPlotNode from './PopulationPlotNode.js';

class PopulationPlotsNode extends Node {

  /**
   * @param {PopulationModel} populationModel
   * @param {number} gridWidth - width of the Population grid, in view coordinates
   * @param {number} gridHeight - height of the Population grid, in view coordinates
   * @param {Object} [options]
   */
  constructor( populationModel, gridWidth, gridHeight, options ) {
    assert && assert( populationModel instanceof PopulationModel, 'invalid ' );
    assert && assert( NaturalSelectionUtils.isPositive( gridWidth ), 'invalid gridWidth' );
    assert && assert( NaturalSelectionUtils.isPositive( gridHeight ), 'invalid gridHeight' );

    options = merge( {}, options );

    assert && assert( !options.clipArea, 'PopulationPlotsNode sets clipArea' );
    const clipAreaDilation = NaturalSelectionConstants.POPULATION_POINT_RADIUS;
    options.clipArea = Shape.rectangle( -clipAreaDilation, 0, gridWidth + 2 * clipAreaDilation, gridHeight + clipAreaDilation );

    //TODO lots of duplication in how these constructors are called
    const totalPlotNode = new PopulationPlotNode( 'total', populationModel.totalPoints,
      populationModel.totalVisibleProperty, populationModel.xWidth,
      populationModel.xRangeProperty, populationModel.yRangeProperty,
      gridWidth, gridHeight, populationModel.generationsProperty, {
        color: NaturalSelectionColors.POPULATION_TOTAL_COUNT
      } );

    const whiteFurPlotNode = new PopulationPlotNode( 'whiteFur', populationModel.whiteFurPoints,
      populationModel.whiteFurVisibleProperty, populationModel.xWidth,
      populationModel.xRangeProperty, populationModel.yRangeProperty,
      gridWidth, gridHeight, populationModel.generationsProperty, {
        color: NaturalSelectionColors.FUR
      } );

    const brownFurPlotNode = new PopulationPlotNode( 'brownFur', populationModel.brownFurPoints,
      populationModel.brownFurVisibleProperty, populationModel.xWidth,
      populationModel.xRangeProperty, populationModel.yRangeProperty,
      gridWidth, gridHeight, populationModel.generationsProperty, {
        color: NaturalSelectionColors.FUR,
        isMutant: true
      } );

    const straightEarsPlotNode = new PopulationPlotNode( 'straightEars', populationModel.straightEarsPoints,
      populationModel.straightEarsVisibleProperty, populationModel.xWidth,
      populationModel.xRangeProperty, populationModel.yRangeProperty,
      gridWidth, gridHeight, populationModel.generationsProperty, {
        color: NaturalSelectionColors.EARS
      } );

    const floppyEarsPlotNode = new PopulationPlotNode( 'floppyEars', populationModel.floppyEarsPoints,
      populationModel.floppyEarsVisibleProperty, populationModel.xWidth,
      populationModel.xRangeProperty, populationModel.yRangeProperty,
      gridWidth, gridHeight, populationModel.generationsProperty, {
        color: NaturalSelectionColors.EARS,
        isMutant: true
      } );

    const shortTeethPlotNode = new PopulationPlotNode( 'shortTeeth', populationModel.shortTeethPoints,
      populationModel.shortTeethVisibleProperty, populationModel.xWidth,
      populationModel.xRangeProperty, populationModel.yRangeProperty,
      gridWidth, gridHeight, populationModel.generationsProperty, {
        color: NaturalSelectionColors.TEETH
      } );

    const longTeethProbeNode = new PopulationPlotNode( 'longTeeth', populationModel.longTeethPoints,
      populationModel.longTeethVisibleProperty, populationModel.xWidth,
      populationModel.xRangeProperty, populationModel.yRangeProperty,
      gridWidth, gridHeight, populationModel.generationsProperty, {
        color: NaturalSelectionColors.TEETH,
        isMutant: true
      } );

    // Children in reverse order, to match bottom-to-top order of checkboxes in PopulationPanel
    assert && assert( !options.children, 'PopulationPlotsNode sets children' );
    options.children = [
      longTeethProbeNode,
      shortTeethPlotNode,
      floppyEarsPlotNode,
      straightEarsPlotNode,
      brownFurPlotNode,
      whiteFurPlotNode,
      totalPlotNode
    ];

    super( options );
  }
}

naturalSelection.register( 'PopulationPlotsNode', PopulationPlotsNode );
export default PopulationPlotsNode;