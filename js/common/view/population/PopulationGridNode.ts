// Copyright 2019-2023, University of Colorado Boulder

/**
 * PopulationGridNode is the 2D grid for the Population graph, including grid lines and tick marks.
 * The grid scrolls horizontally as the x-axis range changes, and zooms in/out vertically as the y-axis range changes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import { Shape } from '../../../../../kite/js/imports.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, NodeTranslationOptions, Path, PathOptions, Rectangle, Text } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';

// constants
const GRID_LINES_LINE_WIDTH = 1;
const TICK_MARKS_LINE_WIDTH = 1;
const TICK_MARKS_LENGTH = 4;
const TICK_LABEL_SPACING = 3;
const TICK_MARKS_FONT = new PhetFont( 10 );

type SelfOptions = {

  // dimensions of the grid (sans tick marks) in view coordinates
  gridWidth?: number;
  gridHeight?: number;
};

type PopulationGridNodeOptions = SelfOptions & NodeTranslationOptions;

export default class PopulationGridNode extends Node {

  public constructor( populationModel: PopulationModel, providedOptions?: PopulationGridNodeOptions ) {

    const options = optionize<PopulationGridNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      gridWidth: 100,
      gridHeight: 100
    }, providedOptions );

    // Background rectangle
    const rectangleNode = new Rectangle( 0, 0, options.gridWidth, options.gridHeight, {
      fill: NaturalSelectionColors.POPULATION_GRAPH_FILL
    } );

    // Grid lines for the x-axis
    const xGridLines = new VerticalLines( populationModel.xRangeProperty, {
      xAxisWidth: options.gridWidth,
      xSpacingModel: populationModel.xAxisTickSpacing,
      lineLength: options.gridHeight,
      pathOptions: {
        stroke: NaturalSelectionColors.POPULATION_GRID_LINES_STROKE,
        lineWidth: GRID_LINES_LINE_WIDTH
      },

      // Clip to the background bounds, because we'll be horizontally translating the x-axis grid lines
      clipArea: Shape.rectangle( 0, 0, options.gridWidth, options.gridHeight )
    } );

    // Grid lines for the y-axis
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

    // Tick-mark lines for the x-axis
    const xTickLines = new VerticalLines( populationModel.xRangeProperty, {
      xSpacingModel: populationModel.xAxisTickSpacing,
      xAxisWidth: options.gridWidth,
      lineLength: TICK_MARKS_LENGTH,
      pathOptions: {
        stroke: NaturalSelectionColors.POPULATION_TICK_MARKS_STROKE,
        lineWidth: TICK_MARKS_LINE_WIDTH
      },
      top: rectangleNode.bottom,

      // Clip to the tick mark bounds below the x-axis, because we'll be horizontally translating the x-axis tick marks
      clipArea: Shape.rectangle( 0, 0, options.gridWidth, options.gridHeight + TICK_MARKS_LENGTH )
    } );

    // Tick-mark labels for the x-axis
    const xTickLabels = new XTickLabels( populationModel.xRangeProperty, {
      xSpacingModel: populationModel.xAxisTickSpacing,
      xAxisWidth: options.gridWidth,
      top: xTickLines.bottom + TICK_LABEL_SPACING
    } );

    // Tick-mark lines for the y-axis
    const yTickLines = new HorizontalLines( populationModel.yRangeProperty, () => populationModel.getYTickSpacing(), {
      yAxisHeight: options.gridHeight,
      lineLength: TICK_MARKS_LENGTH,
      stroke: NaturalSelectionColors.POPULATION_TICK_MARKS_STROKE,
      lineWidth: TICK_MARKS_LINE_WIDTH,
      right: rectangleNode.left
    } );

    // Tick-mark labels for the y-axis
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

    options.children = [ rectangleNode, gridLinesNode, tickMarksNode, frameNode ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * VerticalLines are used for x-axis tick marks and grid lines.  The x-axis tick spacing never changes, but the range
 * changes as time progresses.  So we create a single Shape for the vertical lines, then translate it as the
 * x-axis range changes.  Bounds are clipped to the background dimensions.
 */

type VerticalLinesSelfOptions = {
  xSpacingModel?: number; // spacing between lines, in model coordinates
  xAxisWidth?: number; // width of the x-axis, in view coordinates
  lineLength?: number; // vertical length of the lines, in view coordinates
  pathOptions?: PathOptions; // options passed to the Path subcomponent, which draws the lines
};

type VerticalLinesOptions = VerticalLinesSelfOptions & NodeTranslationOptions &
  PickRequired<NodeOptions, 'clipArea'>;

class VerticalLines extends Node {

  /**
   * @param xRangeProperty - range of the x-axis, in model coordinates
   * @param [providedOptions]
   */
  public constructor( xRangeProperty: TReadOnlyProperty<Range>, providedOptions?: VerticalLinesOptions ) {

    const options = optionize<VerticalLinesOptions, StrictOmit<VerticalLinesSelfOptions, 'pathOptions'>, NodeOptions>()( {

      // VerticalLinesSelfOptions
      xSpacingModel: 1,
      xAxisWidth: 100,
      lineLength: 100
    }, providedOptions );

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
    options.children = [ path ];

    // Translate the lines as time progresses. unlink is not necessary.
    xRangeProperty.link( xRange => {
      path.x = -xSpacingView * ( ( xRange.max % options.xSpacingModel ) / options.xSpacingModel );
    } );

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'VerticalLines does not support dispose' );
    super.dispose();
  }
}

/**
 * HorizontalLines are used for y-axis tick marks and grid lines.
 * They are recreated on demand, when the zoom control is used.
 */

type HorizontalLinesSelfOptions = {
  yAxisHeight?: number; // y-axis height, in view coordinates
  lineLength?: number; // line length, in view coordinates
};

type HorizontalLinesOptions = HorizontalLinesSelfOptions & NodeTranslationOptions &
  PickRequired<PathOptions, 'stroke' | 'lineWidth'>;

class HorizontalLines extends Path {

  /**
   * @param yRangeProperty - range of the y-axis range, in model coordinates
   * @param getYSpacing - gets the y-spacing for the current value of yRangeProperty
   * @param [providedOptions]
   */
  public constructor( yRangeProperty: TReadOnlyProperty<Range>,
                      getYSpacing: () => number,
                      providedOptions?: HorizontalLinesOptions ) {

    const options = optionize<HorizontalLinesOptions, HorizontalLinesSelfOptions, PathOptions>()( {

      // HorizontalLinesSelfOptions
      yAxisHeight: 100,
      lineLength: 100
    }, providedOptions );

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

  public override dispose(): void {
    assert && assert( false, 'HorizontalLines does not support dispose' );
    super.dispose();
  }
}

/**
 * XTickLabels renders the x-axis tick-mark labels. (The tick-mark lines are rendered by VerticalLines.)
 * There is a static number of labels, reused and repositioned as the x-axis range changes.
 */

type XTickLabelsSelfOptions = {
  xSpacingModel?: number; // spacing between lines, in model coordinates
  xAxisWidth?: number; // x-axis width, in view coordinates
};

type XTickLabelsOptions = XTickLabelsSelfOptions & NodeTranslationOptions;

class XTickLabels extends Node {

  /**
   * @param xRangeProperty - the x-axis range, in model coordinates
   * @param [providedOptions]
   */
  public constructor( xRangeProperty: TReadOnlyProperty<Range>, providedOptions?: XTickLabelsOptions ) {

    const options = optionize<XTickLabelsOptions, XTickLabelsSelfOptions, NodeOptions>()( {

      // XTickLabelsSelfOptions
      xSpacingModel: 1,
      xAxisWidth: 100
    }, providedOptions );

    // Compute the number of labels and their spacing, in view coordinates
    const numberOfLabels = getNumberOfVerticalLines( xRangeProperty.value, options.xSpacingModel );
    const xSpacingView = getXSpacingView( xRangeProperty.value, options.xSpacingModel, options.xAxisWidth );

    // Create a fixed number of labels.
    // These instances of Text do not take a string Property because they display a number.
    // The numbers and positions are adjusted by xRangeProperty listener below.
    const labelNodes: Text[] = [];
    for ( let i = 0; i < numberOfLabels; i++ ) {
      labelNodes.push( new Text( i, {
        font: TICK_MARKS_FONT
      } ) );
    }

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
          labelNode.string = xModel;
          labelNode.centerX = xOffsetView + ( i * xSpacingView );
        }
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'XTickLabels does not support dispose' );
    super.dispose();
  }
}

/**
 * YTickLabels renders the y-axis tick-mark labels. (The tick-mark lines are rendered by HorizontalLines.)
 * They are recreated on demand, when the zoom control is used.
 */

type YTickLabelsSelfOptions = {
  yAxisHeight?: number; // y-axis height, in view coordinates
};

type YTickLabelsOptions = YTickLabelsSelfOptions & NodeTranslationOptions;

class YTickLabels extends Node {

  /**
   * @param yRangeProperty - the y-axis range, in model coordinates
   * @param getYSpacing - gets the y-spacing for the current value of yRangeProperty
   * @param [providedOptions]
   */
  public constructor( yRangeProperty: TReadOnlyProperty<Range>,
                      getYSpacing: () => number,
                      providedOptions?: YTickLabelsOptions ) {

    const options = optionize<YTickLabelsOptions, YTickLabelsSelfOptions, NodeOptions>()( {

      // YTickLabelsSelfOptions
      yAxisHeight: 100
    }, providedOptions );

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

  public override dispose(): void {
    assert && assert( false, 'YTickLabels does not support dispose' );
    super.dispose();
  }
}

/**
 * Gets the number of vertical lines in the grid.
 * @param xRange - range of the x-axis, in model coordinates
 * @param xSpacing - space between vertical grid lines, in model coordinates
 */
function getNumberOfVerticalLines( xRange: Range, xSpacing: number ): number {
  return Math.floor( xRange.getLength() / xSpacing ) + 1;
}

/**
 * Gets the spacing between vertical lines, in view coordinates.
 * @param xRange - range of the x-axis, in model coordinates
 * @param xSpacing - space between vertical grid lines, in model coordinates
 * @param xAxisWidth - width of the x-axis, in view coordinates
 */
function getXSpacingView( xRange: Range, xSpacing: number, xAxisWidth: number ): number {
  return ( xSpacing / xRange.getLength() ) * xAxisWidth;
}

/**
 * Gets the number of horizontal lines in the grid.
 * @param yRange - range of the y-axis, in model coordinates
 * @param ySpacing - space between horizontal grid lines, in model coordinates
 */
function getNumberOfHorizontalLines( yRange: Range, ySpacing: number ): number {
  return Math.floor( yRange.getLength() / ySpacing ) + 1;
}

/**
 * Gets the spacing between horizontal lines, in view coordinates.
 * @param yRange - range of the y-axis, in model coordinates
 * @param ySpacing - space between horizontal grid lines, in model coordinates
 * @param yAxisHeight - width of the y-axis, in view coordinates
 */
function getYSpacingView( yRange: Range, ySpacing: number, yAxisHeight: number ): number {
  return ( ySpacing / yRange.getLength() ) * yAxisHeight;
}

naturalSelection.register( 'PopulationGridNode', PopulationGridNode );