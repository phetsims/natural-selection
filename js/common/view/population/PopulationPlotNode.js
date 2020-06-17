// Copyright 2020, University of Colorado Boulder

/**
 * PopulationPlotNode plots one set of data on the Population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArray from '../../../../../axon/js/ObservableArray.js';
import Property from '../../../../../axon/js/Property.js';
import Range from '../../../../../dot/js/Range.js';
import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';

// constants
const LINE_WIDTH = 2; // plotted line width, in view coordinates
const POINT_RADIUS = 3; // plotted point radius, in view coordinates
const NORMAL_LINE_DASH = [];
const MUTANT_LINE_DASH = [ 3, 3 ];

class PopulationPlotNode extends Node {

  /**
   * @param {ObservableArray.<Vector2>} points - data points, in model coordinates (x=Generation, y=Population)
   * @param {Property.<boolean>} plotVisibleProperty - whether this plot is visible
   * @param {number} xWidth - width of the x axis, in model coordinates (Generations)
   * @param {Property.<Range>} xRangeProperty - range of the graph's x axis, in model coordinates (Generation)
   * @param {Property.<Range>} yRangeProperty - range of the graph's y axis, in model coordinates (Population)
   * @param {number} gridWidth - width of the graph's grid, in view coordinates
   * @param {number} gridHeight - height of the graph's grid, in view coordinates
   * @param {Property.<number>} generationsProperty - the current value of the generation clock
   * @param {Object} [options]
   */
  constructor( points, plotVisibleProperty, xWidth, xRangeProperty, yRangeProperty,
               gridWidth, gridHeight, generationsProperty, options ) {
    assert && assert( points instanceof ObservableArray, 'invalid points' );
    assert && AssertUtils.assertPropertyOf( plotVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( xRangeProperty, Range );
    assert && AssertUtils.assertPropertyOf( yRangeProperty, Range );
    assert && assert( NaturalSelectionUtils.isPositive( gridWidth ), 'invalid gridWidth' );
    assert && assert( NaturalSelectionUtils.isPositive( gridHeight ), 'invalid gridHeight' );
    assert && AssertUtils.assertPropertyOf( generationsProperty, 'number' );

    options = merge( {
      color: 'black', // {Color|string} color used to render the plot
      isMutant: false // {boolean} is this plot for a mutant allele?
    }, options );

    const plotPath = new Path( new Shape(), {
      stroke: options.color,
      lineWidth: LINE_WIDTH,
      lineDash: options.isMutant ? MUTANT_LINE_DASH : NORMAL_LINE_DASH
    } );

    const pointsPath = new Path( new Shape(), {
      fill: options.color
    } );

    assert && assert( !options.children, 'PopulationPlotNode sets children' );
    options.children = [ plotPath, pointsPath ];

    super( options );

    // @private
    this.points = points;
    this.xWidth = xWidth;
    this.xRangeProperty = xRangeProperty;
    this.yRangeProperty = yRangeProperty;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.generationsProperty = generationsProperty;
    this.plotPath = plotPath;
    this.pointsPath = pointsPath;

    // unlink not needed
    plotVisibleProperty.link( plotVisible => {
      this.visible = plotVisible;
    } );

    // Points are only added, and are not deleted until they are all deleted. So this is optimized to avoid doing
    // work as each individual point is deleted.
    // unlink not needed
    points.lengthProperty.link( ( length, previousLength ) => {
      if ( length > previousLength || length === 0 ) {
        this.update();
      }
    } );

    // unmultilink not needed
    //TODO duplicate work here because xRangeProperty and generationsProperty sometimes change at the same time
    Property.multilink(
      [ xRangeProperty, yRangeProperty, generationsProperty ],
      () => this.update()
    );

    //TODO optimize so that this is not updated if invisible?
  }

  /**
   * Updates the plot.
   * @private
   */
  update() {

    if ( this.points.length > 0 ) {

      const plotShape = new Shape();
      const pointsShape = new Shape();

      const numberOfPoints = this.points.length;
      let previousXView = null;
      let previousYView = null;

      for ( let i = 0; i < numberOfPoints; i++ ) {

        const point = this.points.get( i );

        // Compute view coordinates
        const xView = this.modelToViewX( point.x );
        const yView = this.modelToViewY( point.y );

        pointsShape.circle( xView, yView, POINT_RADIUS );
        if ( previousXView === null ) {
          plotShape.moveTo( xView, yView );
        }
        else {
          plotShape.lineTo( xView, previousYView );
          plotShape.lineTo( xView, yView );
        }

        previousXView = xView;
        previousYView = yView;

        if ( point.x > this.xRangeProperty.value.max ) {
          break;
        }
      }

      const xView = this.modelToViewX( this.generationsProperty.value );
      if ( previousXView < xView ) {
        plotShape.lineTo( xView, previousYView );
      }

      this.plotPath.setShape( plotShape );
      this.pointsPath.setShape( pointsShape );
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
   * Model-view transform for y axis.
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