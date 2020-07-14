// Copyright 2020, University of Colorado Boulder

/**
 * PopulationPlotNode plots one set of data on the Population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArray from '../../../../../axon/js/ObservableArray.js';
import Property from '../../../../../axon/js/Property.js';
import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import naturalSelection from '../../../naturalSelection.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

// constants
const LINE_WIDTH = 2; // plotted line width, in view coordinates
const NORMAL_LINE_DASH = [];
const MUTANT_LINE_DASH = NaturalSelectionConstants.POPULATION_MUTANT_LINE_DASH;
const MUTANT_LINE_DASH_SUM = _.sum( MUTANT_LINE_DASH );

class PopulationPlotNode extends Node {

  /**
   * @param {PopulationModel} populationModel
   * @param {ObservableArray.<Vector2>} points - data points, in model coordinates (x=Generation, y=Population)
   * @param {Property.<boolean>} plotVisibleProperty - whether this plot is visible
   * @param {Object} [options]
   */
  constructor( populationModel, points, plotVisibleProperty, options ) {
    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );
    assert && assert( points instanceof ObservableArray, 'invalid points' );
    assert && AssertUtils.assertPropertyOf( plotVisibleProperty, 'boolean' );

    options = merge( {
      gridWidth: 100, // dimensions of the grid (sans tick marks) in view coordinates
      gridHeight: 100,
      color: 'black', // {Color|string} color used to render the plot
      isMutant: false // {boolean} is this plot for a mutant allele?
    }, options );

    // Points will be drawn as circles
    const pointsPath = new Path( new Shape(), {
      fill: options.color
    } );

    // Points will be connected using line segments that create a step plot
    const stepPath = new Path( new Shape(), {
      stroke: options.color,
      lineWidth: LINE_WIDTH,
      lineDash: options.isMutant ? MUTANT_LINE_DASH : NORMAL_LINE_DASH
    } );

    assert && assert( !options.children, 'PopulationPlotNode sets children' );
    options.children = [ stepPath, pointsPath ];

    super( options );

    // @private
    this.points = points;
    this.xWidth = populationModel.xWidth;
    this.xRangeProperty = populationModel.xRangeProperty;
    this.yRangeProperty = populationModel.yRangeProperty;
    this.generationsProperty = populationModel.generationsProperty;
    this.gridWidth = options.gridWidth;
    this.gridHeight = options.gridHeight;
    this.pointsPath = pointsPath;
    this.stepPath = stepPath;
    this.isDashed = _.sum( stepPath.lineDash ) > 0;

    // unlink not needed
    plotVisibleProperty.link( plotVisible => {
      this.visible = plotVisible;
    } );

    // Points are only added, and are not deleted until they are all deleted. So this is optimized to avoid doing
    // work as each individual point is deleted.
    // unlink not needed
    points.lengthProperty.link( ( length, previousLength ) => {
      if ( length > previousLength || length === 0 ) {
        this.plotPoints();
      }
    } );

    // Until data fills the width of the graph and the graph starts scrolling, update the plot when generation changes.
    // After that, it's sufficient to update the plot when xRangeProperty changes.
    // unlink not needed.
    this.generationsProperty.link( generation => {
      if ( generation < this.xWidth ) {
        this.plotPoints();
      }
    } );

    // unmultilink not needed
    Property.multilink( [ this.visibleProperty, this.xRangeProperty, this.yRangeProperty ],
      visible => visible && this.plotPoints()
    );
  }

  /**
   * Plots the points that are within the range of the graph.
   * @private
   */
  plotPoints() {

    // Draw only if visible
    if ( this.visible ) {

      const pointsShape = new Shape();
      const stepShape = new Shape();

      const numberOfPoints = this.points.length;

      // Find the index of the first point that is to the left of the grid. Search from the end of the array, to
      // optimize for the case where the graph is scrolling (animated). If the graph is not scrolling, then the sim
      // is paused, and the graph is being used to examine data for a previous generation. In that case, the time
      // to find this index is not critical.
      let firstIndex = 0;
      for ( let i = numberOfPoints - 1; i >= 0; i-- ) {
        const point = this.points.get( i );
        if ( point.x < this.xRangeProperty.value.min ) {
          firstIndex = i;
          break;
        }
      }

      // For mutant plots (drawn with a lineDash), adjust lineDashOffset so that the dash appears to scroll.
      // See https://github.com/phetsims/natural-selection/issues/111
      if ( this.isDashed && this.points.length > 0 ) {
        const firstPoint = this.points.get( firstIndex );
        const xRemainderModel = firstPoint.x % 1;
        const xRemainderView = this.modelToViewX( xRemainderModel );
        this.stepPath.lineDashOffset = -( xRemainderView % MUTANT_LINE_DASH_SUM );
      }

      let plotStarted = false;
      let previousPoint = null;

      // Plot from left to right
      for ( let i = firstIndex; i < numberOfPoints; i++ ) {

        const point = this.points.get( i );

        if ( this.xRangeProperty.value.contains( point.x ) ) {

          // Compute view coordinates
          const xView = this.modelToViewX( point.x );
          const yView = this.modelToViewY( point.y );

          // Plot the point
          pointsShape.circle( xView, yView, NaturalSelectionConstants.POPULATION_POINT_RADIUS );

          if ( !plotStarted ) {
            if ( point.x === this.xRangeProperty.value.min ) {

              // First point is at xMin
              stepShape.moveTo( xView, yView );
            }
            else {

              // Draw information from left edge of grid to first point
              const yViewPrevious = this.modelToViewY( previousPoint.y );
              stepShape.moveTo( this.modelToViewX( this.xRangeProperty.value.min ), yViewPrevious );
              stepShape.lineTo( xView, yViewPrevious );
              stepShape.lineTo( xView, yView );
            }
            plotStarted = true;
          }
          else {

            // Make a step from previous point to current point
            const yViewPrevious = this.modelToViewY( previousPoint.y );
            stepShape.lineTo( xView, yViewPrevious );
            stepShape.lineTo( xView, yView );
          }
        }
        else if ( plotStarted && point.x > this.xRangeProperty.value.max ) {

          // Draw information from previousPoint point to right edge of grid
          const xViewPrevious = this.modelToViewX( previousPoint.x );
          const xViewRight = this.modelToViewX( this.xRangeProperty.value.max );
          const yView = this.modelToViewY( point.y );
          stepShape.lineTo( xViewPrevious, yView );
          stepShape.lineTo( xViewRight, yView );
          break;
        }

        previousPoint = point;
      }

      // Plot from last point to current generation value
      if ( previousPoint && previousPoint.x < this.generationsProperty.value ) {
        const xView = this.modelToViewX( this.generationsProperty.value );
        const yView = this.modelToViewY( previousPoint.y );
        stepShape.lineTo( xView, yView );
      }

      this.pointsPath.setShape( pointsShape );
      this.stepPath.setShape( stepShape );
    }
  }

  /**
   * Model-view transform for x axis.
   * @param {number} xModel - x model value, in generations
   * @returns {number}
   * @private
   */
  modelToViewX( xModel ) {
    return this.gridWidth * ( xModel - this.xRangeProperty.value.min ) / ( this.xRangeProperty.value.max - this.xRangeProperty.value.min );
  }

  /**
   * Model-view transform for y axis. The y axis is inverted (+y up in model, +y down in view).
   * @param {number} yModel - y model value, population
   * @returns {number}
   * @private
   */
  modelToViewY( yModel ) {
    return this.gridHeight - this.gridHeight * ( yModel - this.yRangeProperty.value.min ) / ( this.yRangeProperty.value.max - this.yRangeProperty.value.min );
  }
}

naturalSelection.register( 'PopulationPlotNode', PopulationPlotNode );
export default PopulationPlotNode;