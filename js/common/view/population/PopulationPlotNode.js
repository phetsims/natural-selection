// Copyright 2020-2022, University of Colorado Boulder

/**
 * PopulationPlotNode plots one set of data on the Population graph, updated only when visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import { Shape } from '../../../../../kite/js/imports.js';
import merge from '../../../../../phet-core/js/merge.js';
import required from '../../../../../phet-core/js/required.js';
import { Node, Path } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

// constants
const NORMAL_LINE_DASH = [];
const MUTANT_LINE_DASH = NaturalSelectionConstants.POPULATION_MUTANT_LINE_DASH;
const MUTANT_LINE_DASH_SUM = _.sum( MUTANT_LINE_DASH );

export default class PopulationPlotNode extends Node {

  /**
   * @param {Object} config - NOT propagated to super
   */
  constructor( config ) {

    config = merge( {

      // {ObservableArrayDef.<Vector2>} data points, in model coordinates (x=Generation, y=Population)
      points: required( config.points ),

      // {Property.<boolean>} whether this plot is visible
      plotVisibleProperty: required( config.plotVisibleProperty ),

      // {number} length of the x-axis, in generations
      xAxisLength: required( config.xAxisLength ),

      // {Property.<Range>} ranges for the axes
      xRangeProperty: required( config.xRangeProperty ),
      yRangeProperty: required( config.yRangeProperty ),

      // {Property.<number>} time on the generation clock, in generations
      timeInGenerationsProperty: required( config.timeInGenerationsProperty ),

      // dimensions of the grid (sans tick marks) in view coordinates
      gridWidth: required( config.gridWidth ),
      gridHeight: required( config.gridHeight ),

      // {Color|string} color used to render the plot
      color: required( config.color ),

      // {boolean} is this plot for a mutant allele?
      isMutant: false
    }, config );

    // Points will be drawn as circles
    const pointsPath = new Path( new Shape(), {
      fill: config.color
    } );

    // Points will be connected using line segments that create a step plot
    const stepPath = new Path( new Shape(), {
      stroke: config.color,
      lineWidth: NaturalSelectionConstants.POPULATION_LINE_WIDTH,
      lineDash: config.isMutant ? MUTANT_LINE_DASH : NORMAL_LINE_DASH
    } );

    super( {
      children: [ stepPath, pointsPath ]
    } );

    // @private
    this.points = config.points;
    this.xAxisLength = config.xAxisLength;
    this.xRangeProperty = config.xRangeProperty;
    this.yRangeProperty = config.yRangeProperty;
    this.timeInGenerationsProperty = config.timeInGenerationsProperty; // {Property.<number>}
    this.gridWidth = config.gridWidth;
    this.gridHeight = config.gridHeight;
    this.pointsPath = pointsPath; // {Path}
    this.stepPath = stepPath; // {Path}
    this.isDashed = _.sum( stepPath.lineDash ) > 0; // {number}

    // unlink is not necessary.
    config.plotVisibleProperty.link( plotVisible => {
      this.visible = plotVisible;
    } );

    // Points are only added, and are not deleted until they are all deleted. So this is optimized to avoid doing
    // work as each individual point is deleted.
    // unlink is not necessary.
    this.points.lengthProperty.link( ( length, previousLength ) => {
      if ( length > previousLength || length === 0 ) {
        this.updatePlot();
      }
    } );

    // Until data fills the width of the graph and the graph starts scrolling, update the plot when generation changes.
    // After that, it's sufficient to update the plot when xRangeProperty changes.
    // unlink is not necessary.
    this.timeInGenerationsProperty.link( timeInGenerations => {
      if ( timeInGenerations < this.xAxisLength ) {
        this.updatePlot();
      }
    } );

    // Update when visibility or range changes. unmultilink is not necessary.
    Multilink.multilink( [ this.visibleProperty, this.xRangeProperty, this.yRangeProperty ],
      visible => visible ? this.updatePlot() : this.clearPlot()
    );
  }

  /**
   * Plots the points and line segments that are within the x range of the graph.
   * The y range is handled by a clipArea on PopulationPlotsNode (the parent Node).
   * @private
   */
  updatePlot() {

    // Draw only if visible
    if ( this.visible ) {

      const pointsShape = new Shape();
      const stepShape = new Shape();

      const numberOfPoints = this.points.length;

      // If we have points and any of them fall within the x range...
      if ( numberOfPoints > 0 && this.points[ 0 ].x <= this.xRangeProperty.value.max ) {

        // Index of the point to start with. Defaults to the first point in the array.
        let startIndex = 0;

        // If there is at least one point that is < xMin, find the index of the first point that is <= xMin.
        // Do a brute-force search from the end of the array, to optimize for the case where the graph is scrolling
        // (animated). If the graph is not scrolling, then the sim is paused, and the graph is being used to examine
        // data for a previous generation. In that case, the time for this search is not critical.
        if ( this.points[ 0 ].x < this.xRangeProperty.value.min ) {
          for ( let i = numberOfPoints - 1; i >= 0; i-- ) {
            const point = this.points[ i ];
            if ( point.x <= this.xRangeProperty.value.min ) {
              startIndex = i;
              break;
            }
          }
        }

        // Start with this point, and plot from left to right.
        const startPoint = this.points[ startIndex ];

        // For mutant plots (drawn with a lineDash), adjust lineDashOffset so that the dash appears to scroll.
        // See https://github.com/phetsims/natural-selection/issues/111
        if ( this.isDashed && this.points.length > 0 ) {
          const xRemainderModel = startPoint.x % 1;
          const xRemainderView = this.modelToViewX( xRemainderModel );
          this.stepPath.lineDashOffset = -( xRemainderView % MUTANT_LINE_DASH_SUM );
        }

        // Plot the start point, if it's within the x range of the grid.
        const startXView = this.modelToViewX( Math.max( startPoint.x, this.xRangeProperty.value.min ) );
        const startYView = this.modelToViewY( startPoint.y );
        if ( startPoint.x >= this.xRangeProperty.value.min ) {
          pointsShape.circle( startXView, startYView, NaturalSelectionConstants.POPULATION_POINT_RADIUS );
        }
        stepShape.moveTo( startXView, startYView );

        // Keep track of the previous point that was plotted.
        let previousPoint = startPoint;

        // Starting with the next point, plot from left to right.
        for ( let i = startIndex + 1; i < numberOfPoints; i++ ) {

          const point = this.points[ i ];

          if ( point.x <= this.xRangeProperty.value.max ) {

            // Compute view coordinates
            const xView = this.modelToViewX( point.x );
            const yView = this.modelToViewY( point.y );
            const yViewPrevious = this.modelToViewY( previousPoint.y );

            // Plot the point
            pointsShape.circle( xView, yView, NaturalSelectionConstants.POPULATION_POINT_RADIUS );

            // Plot the line segments
            stepShape.lineTo( xView, yViewPrevious ); // horizontal line from the previous point
            stepShape.lineTo( xView, yView ); // vertical line to the current point
          }
          else {

            // Extend the plot from previousPoint to the right edge of the grid.
            const xViewMax = this.modelToViewX( this.xRangeProperty.value.max );
            const yViewPrevious = this.modelToViewY( previousPoint.y );
            stepShape.lineTo( xViewMax, yViewPrevious ); // horizontal line from the previous point
          }

          previousPoint = point;

          // Bail out if when we reach the right edge of grid.
          if ( point.x >= this.xRangeProperty.value.max ) {
            break;
          }
        }

        // Plot from previousPoint to current generation time
        if ( ( previousPoint.x < this.xRangeProperty.value.max ) && ( previousPoint.x < this.timeInGenerationsProperty.value ) ) {
          const xView = this.modelToViewX( this.timeInGenerationsProperty.value );
          const yView = this.modelToViewY( previousPoint.y );
          stepShape.lineTo( xView, yView );
        }
      }

      this.pointsPath.setShape( pointsShape );
      this.stepPath.setShape( stepShape );
    }
  }

  /**
   * Clears the plot. While a plot is invisible, it is not updated.  So when a plot is made invisible, it must
   * also be cleared. This is important because bounds are used to decide if the graph is displaying data, and
   * whether the "Zoom out to show data" message should be displayed.  Bounds computation includes invisible Nodes,
   * and if the plot still contains geometry, then it will be incorrectly contributing to bounds.
   * See https://github.com/phetsims/natural-selection/issues/209
   * @private
   */
  clearPlot() {
    this.pointsPath.setShape( null );
    this.stepPath.setShape( null );
  }

  /**
   * Model-view transform for x-axis.
   * @param {number} xModel - x model value, in generations
   * @returns {number} x view value
   * @private
   */
  modelToViewX( xModel ) {
    return this.gridWidth * ( xModel - this.xRangeProperty.value.min ) / ( this.xRangeProperty.value.max - this.xRangeProperty.value.min );
  }

  /**
   * Model-view transform for y-axis. The y-axis is inverted (+y up in model, +y down in view).
   * @param {number} yModel - y model value, population
   * @returns {number} y view value
   * @private
   */
  modelToViewY( yModel ) {
    return this.gridHeight - this.gridHeight * ( yModel - this.yRangeProperty.value.min ) / ( this.yRangeProperty.value.max - this.yRangeProperty.value.min );
  }
}

naturalSelection.register( 'PopulationPlotNode', PopulationPlotNode );