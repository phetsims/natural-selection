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

    // Options common to all PopulationPlotNode instances
    const plotNodeOptions = {
      gridWidth: options.gridWidth,
      gridHeight: options.gridHeight
    };

    const totalPlotNode = new PopulationPlotNode( populationModel,
      populationModel.totalPoints, populationModel.totalVisibleProperty,
      merge( {
        color: NaturalSelectionColors.POPULATION_TOTAL_COUNT
      }, plotNodeOptions ) );

    const whiteFurPlotNode = new PopulationPlotNode( populationModel,
      populationModel.whiteFurPoints, populationModel.whiteFurVisibleProperty,
      merge( {
        color: NaturalSelectionColors.FUR
      }, plotNodeOptions ) );

    const brownFurPlotNode = new PopulationPlotNode( populationModel,
      populationModel.brownFurPoints, populationModel.brownFurVisibleProperty,
      merge( {
        color: NaturalSelectionColors.FUR,
        isMutant: true
      }, plotNodeOptions ) );

    const straightEarsPlotNode = new PopulationPlotNode( populationModel,
      populationModel.straightEarsPoints, populationModel.straightEarsVisibleProperty,
      merge( {
        color: NaturalSelectionColors.EARS
      }, plotNodeOptions ) );

    const floppyEarsPlotNode = new PopulationPlotNode( populationModel,
      populationModel.floppyEarsPoints, populationModel.floppyEarsVisibleProperty,
      merge( {
        color: NaturalSelectionColors.EARS,
        isMutant: true
      }, plotNodeOptions ) );

    const shortTeethPlotNode = new PopulationPlotNode( populationModel,
      populationModel.shortTeethPoints, populationModel.shortTeethVisibleProperty,
      merge( {
        color: NaturalSelectionColors.TEETH
      }, plotNodeOptions ) );

    const longTeethProbeNode = new PopulationPlotNode( populationModel,
      populationModel.longTeethPoints, populationModel.longTeethVisibleProperty,
      merge( {
        color: NaturalSelectionColors.TEETH,
        isMutant: true
      }, plotNodeOptions ) );

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