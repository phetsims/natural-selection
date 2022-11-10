// Copyright 2020-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * PopulationPlotsNode is the complete set of plots for the Population graph, clipped to the graph's grid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../../kite/js/imports.js';
import merge from '../../../../../phet-core/js/merge.js';
import { Node } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import PopulationPlotNode from './PopulationPlotNode.js';

export default class PopulationPlotsNode extends Node {

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

    // Clipped to the graph, but dilated to mitigate clipping of points and line segments at the edges of the grid.
    // Points (but not line segments) that fall at yMax (in model coordinates) will be slightly clipped as a compromise
    // for improved clipping performance. See https://github.com/phetsims/natural-selection/issues/159
    assert && assert( !options.clipArea, 'PopulationPlotsNode sets clipArea' );
    options.clipArea = Shape.bounds(
      new Bounds2(
        -NaturalSelectionConstants.POPULATION_POINT_RADIUS,
        -NaturalSelectionConstants.POPULATION_LINE_WIDTH / 2,
        options.gridWidth + NaturalSelectionConstants.POPULATION_POINT_RADIUS,
        options.gridHeight + NaturalSelectionConstants.POPULATION_POINT_RADIUS
      )
    );

    // Config common to all PopulationPlotNode instances
    const plotNodeConfig = {
      gridWidth: options.gridWidth,
      gridHeight: options.gridHeight,
      xAxisLength: populationModel.xAxisLength,
      xRangeProperty: populationModel.xRangeProperty,
      yRangeProperty: populationModel.yRangeProperty,
      timeInGenerationsProperty: populationModel.timeInGenerationsProperty
    };

    const totalPlotNode = new PopulationPlotNode( merge( {}, plotNodeConfig, {
      points: populationModel.totalPoints,
      plotVisibleProperty: populationModel.totalVisibleProperty,
      color: NaturalSelectionColors.POPULATION_TOTAL_COUNT
    } ) );

    const whiteFurPlotNode = new PopulationPlotNode( merge( {}, plotNodeConfig, {
      points: populationModel.whiteFurPoints,
      plotVisibleProperty: populationModel.whiteFurVisibleProperty,
      color: NaturalSelectionColors.FUR
    } ) );

    const brownFurPlotNode = new PopulationPlotNode( merge( {}, plotNodeConfig, {
      points: populationModel.brownFurPoints,
      plotVisibleProperty: populationModel.brownFurVisibleProperty,
      color: NaturalSelectionColors.FUR,
      isMutant: true
    } ) );

    const straightEarsPlotNode = new PopulationPlotNode( merge( {}, plotNodeConfig, {
      points: populationModel.straightEarsPoints,
      plotVisibleProperty: populationModel.straightEarsVisibleProperty,
      color: NaturalSelectionColors.EARS
    } ) );

    const floppyEarsPlotNode = new PopulationPlotNode( merge( {}, plotNodeConfig, {
      points: populationModel.floppyEarsPoints,
      plotVisibleProperty: populationModel.floppyEarsVisibleProperty,
      color: NaturalSelectionColors.EARS,
      isMutant: true
    } ) );

    const shortTeethPlotNode = new PopulationPlotNode( merge( {}, plotNodeConfig, {
      points: populationModel.shortTeethPoints,
      plotVisibleProperty: populationModel.shortTeethVisibleProperty,
      color: NaturalSelectionColors.TEETH
    } ) );

    const longTeethProbeNode = new PopulationPlotNode( merge( {}, plotNodeConfig, {
      points: populationModel.longTeethPoints,
      plotVisibleProperty: populationModel.longTeethVisibleProperty,
      color: NaturalSelectionColors.TEETH,
      isMutant: true
    } ) );

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