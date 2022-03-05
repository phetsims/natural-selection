// Copyright 2019-2022, University of Colorado Boulder

/**
 * PopulationGridNode is the 2D grid for the Population graph, including grid lines and tick marks.
 * The grid scrolls horizontally as the x-axis range changes, and zooms in/out vertically as the y-axis range changes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../../dot/js/Range.js';
import { Shape } from '../../../../../kite/js/imports.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../../scenery/js/imports.js';
import { Path } from '../../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../../scenery/js/imports.js';
import { Text } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';

// constants
const GRID_LINES_LINE_WIDTH = 1;
const TICK_MARKS_LINE_WIDTH = 1;
const TICK_MARKS_LENGTH = 4;
const TICK_LABEL_SPACING = 3;
const TICK_MARKS_FONT = new PhetFont( 10 );

class PopulationGridNode extends Node {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {

    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

    options = merge( {

      // dimensions of the grid (sans tick marks) in view coordinates
      gridWidth: 100,
      gridHeight: 100
    }, options );

    // Background rectangle
    const rectangleNode = new Rectangle( 0, 0, options.gridWidth, options.gridHeight, {
      fill: NaturalSelectionColors.POPULATION_GRAPH_FILL
    } );

    // Grid lines for the x axis
    const xGridLines = new VerticalLines( populationModel.xRangeProperty, {
      xAxisWidth: options.gridWidth,
      xSpacingModel: populationModel.xAxisTickSpacing,
      lineLength: options.gridHeight,
      pathOptions: {
        stroke: NaturalSelectionColors.POPULATION_GRID_LINES_STROKE,
        lineWidth: GRID_LINES_LINE_WIDTH
      },

      // Clip to the background bounds, because we'll be horizontally translating the x grid lines
      clipArea: Shape.rectangle( 0, 0, options.gridWidth, options.gridHeight )
    } );

    // Grid lines for the y axis
    const yGridLines = new HorizontalLines( populationModel.yRangeProperty, () => populationModel.getYTickSpacing(), {
      yAxisHeight: options.gridHeight,
      lineLength: options.gridWidth,
      stroke: NaturalSelectionColors.POPULATION_GRID_LINES_STROKE,
      lineWidth: GRID_LINES_LINE_WIDTH
    } );

    // Group the grid lines, in case we want to be able to show/hide them in the future.
    const gridLinesNode = new Node( {
      children: [ xGridLines, yGridLines ]
    } );

    // Tick-mark lines for the x axis
    const xTickLines = new VerticalLines( populationModel.xRangeProperty, {
      xSpacingModel: populationModel.xAxisTickSpacing,
      xAxisWidth: options.gridWidth,
      lineLength: TICK_MARKS_LENGTH,
      pathOptions: {
        stroke: NaturalSelectionColors.POPULATION_TICK_MARKS_STROKE,
        lineWidth: TICK_MARKS_LINE_WIDTH
      },
      top: rectangleNode.bottom,

      // Clip to the tick mark bounds below the x axis, because we'll be horizontally translating the x tick marks
      clipArea: Shape.rectangle( 0, 0, options.gridWidth, options.gridHeight + TICK_MARKS_LENGTH )
    } );

    // Tick-mark labels for the x axis
    const xTickLabels = new XTickLabels( populationModel.xRangeProperty, {
      xSpacingModel: populationModel.xAxisTickSpacing,
      xAxisWidth: options.gridWidth,
      top: xTickLines.bottom + TICK_LABEL_SPACING
    } );

    // Tick-mark lines for the y axis
    const yTickLines = new HorizontalLines( populationModel.yRangeProperty, () => populationModel.getYTickSpacing(), {
      yAxisHeight: options.gridHeight,
      lineLength: TICK_MARKS_LENGTH,
      stroke: NaturalSelectionColors.POPULATION_TICK_MARKS_STROKE,
      lineWidth: TICK_MARKS_LINE_WIDTH,
      right: rectangleNode.left
    } );

    // Tick-mark labels for the y axis
    const yTickLabels = new YTickLabels( populationModel.yRangeProperty, () => populationModel.getYTickSpacing(), {
      yAxisHeight: options.gridHeight,
      right: yTickLines.left - TICK_LABEL_SPACING
    } );

    // Group the tick marks, in case we want to be able to show/hide them in the future.
    const tickMarksNode = new Node( {
      children: [ xTickLines, xTickLabels, yTickLines, yTickLabels ]
    } );

    // A crisp frame in the foreground, to hide overlapping of tick marks and grid lines
    const frameNode = new Rectangle( 0, 0, options.gridWidth, options.gridHeight, {
      stroke: NaturalSelectionColors.PANEL_STROKE,
      lineWidth: 1.5
    } );

    assert && assert( !options.children, 'PopulationGraphBackgroundNode sets children' );
    options.children = [ rectangleNode, gridLinesNode, tickMarksNode, frameNode ];

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

/**
 * VerticalLines are used for x-axis tick marks and grid lines.  The x-axis tick spacing never changes, but the range
 * changes as time progresses.  So we create a single Shape for the vertical lines, then translate it as the
 * x-axis range changes.  Bounds are clipped to the background dimensions.
 */
class VerticalLines extends Node {

  /**
   * @param {Property.<Range>} xRangeProperty - range of the x-axis, in model coordinates
   * @param {Object} [options]
   */
  constructor( xRangeProperty, options ) {

    assert && AssertUtils.assertPropertyOf( xRangeProperty, Range );

    options = merge( {
      xSpacingModel: 1, // spacing between lines, in model coordinates
      xAxisWidth: 100, // width of the x axis, in view coordinates
      lineLength: 100, // vertical length of the lines, in view coordinates
      pathOptions: null // options passed to the Path subcomponent, which draws the lines
    }, options );

    // Compute the number of lines and their spacing, in view coordinates
    const numberOfLines = getNumberOfVerticalLines( xRangeProperty.value, options.xSpacingModel );
    const xSpacingView = getXSpacingView( xRangeProperty.value, options.xSpacingModel, options.xAxisWidth );

    // Create the lines
    const shape = new Shape();
    for ( let i = 0; i < numberOfLines; i++ ) {
      const x = options.xAxisWidth - ( i * xSpacingView );
      shape.moveTo( x, 0 );
      shape.lineTo( x, options.lineLength );
    }
    const path = new Path( shape, options.pathOptions );

    // Wrapped in a Node because we're going to translate the Path
    assert && assert( !options.children, 'VerticalLines sets children' );
    options.children = [ path ];

    // Translate the lines as time progresses. unlink is not necessary.
    xRangeProperty.link( xRange => {
      path.x = -xSpacingView * ( ( xRange.max % options.xSpacingModel ) / options.xSpacingModel );
    } );

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'VerticalLines does not support dispose' );
    super.dispose();
  }
}

/**
 * HorizontalLines are used for y-axis tick marks and grid lines.
 * They are recreated on demand, when the zoom control is used.
 */
class HorizontalLines extends Path {

  /**
   * @param {Property.<Range>} yRangeProperty - range of the y-axis range, in model coordinates
   * @param {function:number} getYSpacing - gets the y-spacing for the current value of yRangeProperty
   * @param {Object} [options]
   */
  constructor( yRangeProperty, getYSpacing, options ) {

    assert && AssertUtils.assertPropertyOf( yRangeProperty, Range );
    assert && assert( typeof getYSpacing === 'function', 'invalid getYSpacing' );

    options = merge( {
      yAxisHeight: 100, // y axis height, in view coordinates
      lineLength: 100 // line length, in view coordinates
    }, options );

    super( new Shape() );

    // Recreate the lines when the y-axis range changes. unlink is not necessary.
    yRangeProperty.link( yRange => {

      // Compute the number of lines and their spacing, in view coordinates
      const ySpacingModel = getYSpacing();
      const numberOfLines = getNumberOfHorizontalLines( yRange, ySpacingModel );
      const ySpacingView = getYSpacingView( yRange, ySpacingModel, options.yAxisHeight );

      // Create the grid lines
      const shape = new Shape();
      for ( let i = 0; i < numberOfLines; i++ ) {
        const y = options.yAxisHeight - ( i * ySpacingView );
        shape.moveTo( 0, y );
        shape.lineTo( options.lineLength, y );
      }
      this.shape = shape;
    } );

    this.mutate( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'HorizontalLines does not support dispose' );
    super.dispose();
  }
}

/**
 * XTickLabels renders the x-axis tick-mark labels. (The tick-mark lines are rendered by VerticalLines.)
 * There is a static number of labels, reused and repositioned as the x-axis range changes.
 */
class XTickLabels extends Node {

  /**
   * @param {Property.<Range>} xRangeProperty - the x-axis range, in model coordinates
   * @param {Object} [options]
   */
  constructor( xRangeProperty, options ) {

    assert && AssertUtils.assertPropertyOf( xRangeProperty, Range );

    options = merge( {
      xSpacingModel: 1, // spacing between lines, in model coordinates
      xAxisWidth: 100 // x axis width, in view coordinates
    }, options );

    // Compute the number of labels and their spacing, in view coordinates
    const numberOfLabels = getNumberOfVerticalLines( xRangeProperty.value, options.xSpacingModel );
    const xSpacingView = getXSpacingView( xRangeProperty.value, options.xSpacingModel, options.xAxisWidth );

    // Create a fixed number of labels. Their values and positions will be adjusted by xRangeProperty listener below.
    const labelNodes = []; // {Text[]}
    for ( let i = 0; i < numberOfLabels; i++ ) {
      labelNodes.push( new Text( i, {
        font: TICK_MARKS_FONT
      } ) );
    }

    assert && assert( !options.children, 'XTickLabels set children' );
    options.children = labelNodes;

    super( options );

    // Adjusts the text and position for all labels when the x-axis range changes. unlink is not necessary.
    xRangeProperty.link( xRange => {

      const xOffsetModel = Math.floor( options.xSpacingModel * xRange.min / options.xSpacingModel );
      const xOffsetView = -xSpacingView * ( ( xRange.max % options.xSpacingModel ) / options.xSpacingModel );

      for ( let i = 0; i < numberOfLabels; i++ ) {
        const labelNode = labelNodes[ i ];
        const xModel = xOffsetModel + ( i * options.xSpacingModel );
        labelNode.visible = xRange.contains( xModel );
        if ( labelNode.visible ) {
          labelNode.text = xModel;
          labelNode.centerX = xOffsetView + ( i * xSpacingView );
        }
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'XTickLabels does not support dispose' );
    super.dispose();
  }
}

/**
 * YTickLabels renders the y-axis tick-mark labels. (The tick-mark lines are rendered by HorizontalLines.)
 * They are recreated on demand, when the zoom control is used.
 */
class YTickLabels extends Node {

  /**
   * @param {Property.<Range>} yRangeProperty - the y-axis range, in model coordinates
   * @param {function:number} getYSpacing - gets the y-spacing for the current value of yRangeProperty
   * @param {Object} [options]
   */
  constructor( yRangeProperty, getYSpacing, options ) {

    assert && AssertUtils.assertPropertyOf( yRangeProperty, Range );
    assert && assert( typeof getYSpacing === 'function', 'invalid getYSpacing' );

    options = merge( {
      yAxisHeight: 100 // y axis height, in view coordinates
    }, options );

    assert && assert( !options.children, 'YTickLabels sets children' );

    super();

    // Recreate the labels when the y-axis range changes. unlink is not necessary.
    yRangeProperty.link( yRange => {

      // Compute the number of tick marks and their spacing, in view coordinates
      const ySpacingModel = getYSpacing();
      const numberOfTickMarks = getNumberOfHorizontalLines( yRange, ySpacingModel );
      const ySpacingView = getYSpacingView( yRange, ySpacingModel, options.yAxisHeight );

      // Create the tick mark labels
      const labelNodes = [];
      for ( let i = 0; i < numberOfTickMarks; i++ ) {

        const labelNode = new Text( yRange.min + ( i * ySpacingModel ), {
          font: TICK_MARKS_FONT,
          right: 0,
          centerY: options.yAxisHeight - ( i * ySpacingView )
        } );

        labelNodes.push( labelNode );
      }

      this.children = labelNodes;
    } );

    this.mutate( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'YTickLabels does not support dispose' );
    super.dispose();
  }
}

/**
 * Gets the number of vertical lines in the grid.
 * @param {Range} xRange - range of the x axis, in model coordinates
 * @param {number} xSpacing - space between vertical grid lines, in model coordinates
 * @returns {number}
 */
function getNumberOfVerticalLines( xRange, xSpacing ) {
  return Math.floor( xRange.getLength() / xSpacing ) + 1;
}

/**
 * Gets the spacing between vertical lines, in view coordinates.
 * @param {Range} xRange - range of the x axis, in model coordinates
 * @param {number} xSpacing - space between vertical grid lines, in model coordinates
 * @param {number} xAxisWidth - width of the x axis, in view coordinates
 * @returns {number}
 */
function getXSpacingView( xRange, xSpacing, xAxisWidth ) {
  return ( xSpacing / xRange.getLength() ) * xAxisWidth;
}

/**
 * Gets the number of horizontal lines in the grid.
 * @param {Range} yRange - range of the y axis, in model coordinates
 * @param {number} ySpacing - space between horizontal grid lines, in model coordinates
 * @returns {number}
 */
function getNumberOfHorizontalLines( yRange, ySpacing ) {
  return Math.floor( yRange.getLength() / ySpacing ) + 1;
}

/**
 * Gets the spacing between horizontal lines, in view coordinates.
 * @param {Range} yRange - range of the y axis, in model coordinates
 * @param {number} ySpacing - space between horizontal grid lines, in model coordinates
 * @param {number} yAxisHeight - width of the y axis, in view coordinates
 * @returns {number}
 */
function getYSpacingView( yRange, ySpacing, yAxisHeight ) {
  return ( ySpacing / yRange.getLength() ) * yAxisHeight;
}

naturalSelection.register( 'PopulationGridNode', PopulationGridNode );
export default PopulationGridNode;