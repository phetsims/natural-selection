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
import PopulationPlotNode from './PopulationPlotNode.js';

class PopulationPlotsNode extends Node {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {
    assert && assert( populationModel instanceof PopulationModel, 'invalid ' );

    options = merge( {

      // dimensions of the grid (sans tick marks) in view coordinates
      gridWidth: 100,
      gridHeight: 100
    }, options );

    // Clipped to the graph, but dilated so that points and line segments at the edges of the grid are not clipped.
    assert && assert( !options.clipArea, 'PopulationPlotsNode sets clipArea' );
    const clipAreaDilation = NaturalSelectionConstants.POPULATION_POINT_RADIUS;
    options.clipArea = Shape.rectangle( -clipAreaDilation, 0,
      options.gridWidth + 2 * clipAreaDilation, options.gridHeight + clipAreaDilation );

    //TODO lots of duplication in how these constructors are called
    const totalPlotNode = new PopulationPlotNode( 'total',
      populationModel.totalPoints, populationModel.totalVisibleProperty,
      populationModel.xWidth, populationModel.xRangeProperty, populationModel.yRangeProperty,
      populationModel.generationsProperty, {
        gridWidth: options.gridWidth,
        gridHeight: options.gridHeight,
        color: NaturalSelectionColors.POPULATION_TOTAL_COUNT
      } );

    const whiteFurPlotNode = new PopulationPlotNode( 'whiteFur',
      populationModel.whiteFurPoints, populationModel.whiteFurVisibleProperty,
      populationModel.xWidth, populationModel.xRangeProperty, populationModel.yRangeProperty,
      populationModel.generationsProperty, {
        gridWidth: options.gridWidth,
        gridHeight: options.gridHeight,
        color: NaturalSelectionColors.FUR
      } );

    const brownFurPlotNode = new PopulationPlotNode( 'brownFur',
      populationModel.brownFurPoints, populationModel.brownFurVisibleProperty,
      populationModel.xWidth, populationModel.xRangeProperty, populationModel.yRangeProperty,
      populationModel.generationsProperty, {
        gridWidth: options.gridWidth,
        gridHeight: options.gridHeight,
        color: NaturalSelectionColors.FUR,
        isMutant: true
      } );

    const straightEarsPlotNode = new PopulationPlotNode( 'straightEars',
      populationModel.straightEarsPoints, populationModel.straightEarsVisibleProperty,
      populationModel.xWidth, populationModel.xRangeProperty, populationModel.yRangeProperty,
      populationModel.generationsProperty, {
        gridWidth: options.gridWidth,
        gridHeight: options.gridHeight,
        color: NaturalSelectionColors.EARS
      } );

    const floppyEarsPlotNode = new PopulationPlotNode( 'floppyEars',
      populationModel.floppyEarsPoints, populationModel.floppyEarsVisibleProperty,
      populationModel.xWidth, populationModel.xRangeProperty, populationModel.yRangeProperty,
      populationModel.generationsProperty, {
        gridWidth: options.gridWidth,
        gridHeight: options.gridHeight,
        color: NaturalSelectionColors.EARS,
        isMutant: true
      } );

    const shortTeethPlotNode = new PopulationPlotNode( 'shortTeeth',
      populationModel.shortTeethPoints, populationModel.shortTeethVisibleProperty,
      populationModel.xWidth, populationModel.xRangeProperty, populationModel.yRangeProperty,
      populationModel.generationsProperty, {
        gridWidth: options.gridWidth,
        gridHeight: options.gridHeight,
        color: NaturalSelectionColors.TEETH
      } );

    const longTeethProbeNode = new PopulationPlotNode( 'longTeeth',
      populationModel.longTeethPoints, populationModel.longTeethVisibleProperty,
      populationModel.xWidth, populationModel.xRangeProperty, populationModel.yRangeProperty,
      populationModel.generationsProperty, {
        gridWidth: options.gridWidth,
        gridHeight: options.gridHeight,
        color: NaturalSelectionColors.TEETH,
        isMutant: true
      } );

    // Front-to-back rendering order should match top-to-bottom order of checkboxes in PopulationPanel
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