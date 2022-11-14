// Copyright 2019-2022, University of Colorado Boulder

/**
 * DataProbeNode displays population (y-axis) values for a specific generation (x-axis) value.
 * It can be dragged along the x-axis. The origin is at the top center of barNode.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Property from '../../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import { Shape } from '../../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions, optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../../scenery-phet/js/ShadedSphereNode.js';
import { Color, DragListener, HStrut, Node, NodeOptions, Rectangle, TColor, VBox, VStrut } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import BunnyCounts from '../../model/BunnyCounts.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';

// Options to createNumberDisplay function
type CreateNumberDisplayOptions = {
  backgroundFill?: Color | string;
} & StrictOmit<NumberDisplayOptions, 'backgroundFill'>;

// constants
const MANIPULATOR_RADIUS = 7;
const NUMBER_DISPLAY_RANGE = new Range( 0, 10 * NaturalSelectionQueryParameters.maxPopulation );
const NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY = 0.7;
const NUMBER_DISPLAY_DEFAULTS: CreateNumberDisplayOptions = {
  textOptions: {
    font: new PhetFont( 12 )
  },
  backgroundLineWidth: 2,
  noValueAlign: 'center'
};

type SelfOptions = {

  // dimensions of the grid (sans tick marks) in view coordinates
  gridWidth?: number;
  gridHeight?: number;

  // offset in view coordinates
  offset?: Vector2;
};

type DataProbeNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DataProbeNode extends Node {

  public constructor( populationModel: PopulationModel, providedOptions: DataProbeNodeOptions ) {

    const options = optionize<DataProbeNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      gridWidth: 100,
      gridHeight: 100,
      offset: Vector2.ZERO,

      // NodeOptions
      cursor: 'ew-resize' // east-west arrows, <->
    }, providedOptions );

    const dataProbe = populationModel.dataProbe;

    options.visibleProperty = dataProbe.visibleProperty;

    // Transform for data probe offset from the top-left of the grid
    const offsetTransform =
      ModelViewTransform2.createOffsetScaleMapping( options.offset, options.gridWidth / populationModel.xAxisLength );

    // Which side of the bar the displays are on: true = right, false = left
    let displaysOnRight = true;

    // Vertical bar
    const barNode = new Rectangle( 0, 0, 3, options.gridHeight, {
      fill: NaturalSelectionColors.DATA_PROBE_BAR_COLOR,
      opacity: 0.6,
      centerX: 0,
      y: 0
    } );
    barNode.mouseArea = barNode.localBounds.dilatedXY( 5, 0 );
    barNode.touchArea = barNode.localBounds.dilatedXY( 10, 0 );

    // Manipulator at bottom of the bar
    const manipulator = new ShadedSphereNode( 2 * MANIPULATOR_RADIUS, {
      mainColor: NaturalSelectionColors.DATA_PROBE_MANIPULATOR_COLOR,
      mouseArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
      touchArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
      centerX: barNode.centerX,
      centerY: barNode.bottom
    } );

    // NumberDisplay instances
    const genePool = populationModel.genePool;
    const totalDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'totalCount',
      NaturalSelectionColors.POPULATION_TOTAL_COUNT, populationModel.totalVisibleProperty );
    const whiteFurDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'whiteFurCount',
      genePool.furGene.color, populationModel.whiteFurVisibleProperty );
    const brownFurDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'brownFurCount',
      genePool.furGene.color, populationModel.brownFurVisibleProperty );
    const straightEarsDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'straightEarsCount',
      genePool.earsGene.color, populationModel.straightEarsVisibleProperty );
    const floppyEarsDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'floppyEarsCount',
      genePool.earsGene.color, populationModel.floppyEarsVisibleProperty );
    const shortTeethDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'shortTeethCount',
      genePool.teethGene.color, populationModel.shortTeethVisibleProperty );
    const longTeethDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'longTeethCount',
      genePool.teethGene.color, populationModel.longTeethVisibleProperty );

    // vertical layout of NumberDisplays 
    const numberDisplaysParent = new VBox( {
      spacing: 3,
      align: 'left',
      children: [
        new VStrut( 5 ), // a bit of space at the top
        new HStrut( totalDisplay.width ), // so that numberDisplaysParent always has consistent non-zero width
        totalDisplay,
        whiteFurDisplay, brownFurDisplay,
        straightEarsDisplay, floppyEarsDisplay,
        shortTeethDisplay, longTeethDisplay
      ],
      top: barNode.top
    } );

    assert && assert( !options.children, 'DataProbeNode sets children' );
    options.children = [ barNode, manipulator, numberDisplaysParent ];

    super( options );

    // removeInputListener is not necessary
    this.addInputListener( new DragListener( {
      positionProperty: dataProbe.offsetProperty,
      transform: offsetTransform,
      dragBoundsProperty: new Property( new Bounds2( 0, 0, populationModel.xAxisLength, 0 ) ), // model coordinates
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( visible => this.interruptSubtreeInput() );

    // Flip NumberDisplays around the y-axis at edges of the graph, so that they stay inside the bounds of the graph.
    // unlink is not necessary.
    dataProbe.offsetProperty.link( offset => {

      this.x = offsetTransform.modelToViewPosition( offset ).x;

      // flip NumberDisplays around y-axis at edges of graph
      if ( this.left < options.offset.x && !displaysOnRight ) {
        displaysOnRight = true;
        numberDisplaysParent.left = barNode.right;
      }
      else if ( this.right > +options.offset.x + options.gridWidth && displaysOnRight ) {
        displaysOnRight = false;
        numberDisplaysParent.right = barNode.left;
      }
    } );

    // Create a Studio link to the model
    this.addLinkedElement( dataProbe, {
      tandem: options.tandem.createTandem( 'dataProbe' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Creates a NumberDisplay whose background is filled with a solid color.  This is used for normal allele counts.
 */
function createSolidNumberDisplay( bunnyCountsProperty: TReadOnlyProperty<BunnyCounts | null>, bunnyCountsFieldName: string,
                                   color: TColor, visibleProperty: TReadOnlyProperty<boolean> ): NumberDisplay {
  const colorWithAlpha = Color.toColor( color ).withAlpha( NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY );
  return createNumberDisplay( bunnyCountsProperty, bunnyCountsFieldName, {
    visibleProperty: visibleProperty,
    backgroundFill: colorWithAlpha,
    backgroundStroke: colorWithAlpha
  } );
}

/**
 * Creates a NumberDisplay whose background is stroked with a dashed line. This is used for mutant allele counts.
 */
function createDashedNumberDisplay( bunnyCountsProperty: TReadOnlyProperty<BunnyCounts | null>, bunnyCountsFieldName: string,
                                    color: TColor, visibleProperty: TReadOnlyProperty<boolean> ): NumberDisplay {
  return createNumberDisplay( bunnyCountsProperty, bunnyCountsFieldName, {
    visibleProperty: visibleProperty,
    backgroundFill: new Color( 255, 255, 255, NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY ),
    backgroundStroke: color,
    backgroundLineDash: [ 3, 3 ]
  } );
}

/**
 * Creates a NumberDisplay for the data probe.
 */
function createNumberDisplay( bunnyCountsProperty: TReadOnlyProperty<BunnyCounts | null>, bunnyCountsFieldName: string,
                              providedOptions?: CreateNumberDisplayOptions ): NumberDisplay {

  const options = optionize4<CreateNumberDisplayOptions, EmptySelfOptions, CreateNumberDisplayOptions>()(
    {}, NUMBER_DISPLAY_DEFAULTS, {
      backgroundFill: 'white'
    }, providedOptions );

  // Set the text fill based on whether the background color is dark or light.
  if ( !options.textOptions || options.textOptions.fill === undefined ) {
    options.textOptions = options.textOptions || {};
    options.textOptions.fill = Color.isDarkColor( options.backgroundFill ) ? 'white' : 'black';
  }

  // Adapter Property, for interfacing with NumberDisplay. dispose is not necessary.
  const countProperty = new DerivedProperty( [ bunnyCountsProperty ],
    bunnyCounts => {
      if ( bunnyCounts ) {
        type BunnyCountKey = keyof typeof bunnyCounts;
        const count = bunnyCounts[ bunnyCountsFieldName as BunnyCountKey ] as number;
        assert && assert( typeof count === 'number' ); // eslint-disable-line no-simple-type-checking-assertions
        return count;
      }
      else {
        return null;
      }
    }, {
      tandem: Tandem.OPT_OUT
    } );

  const numberDisplay = new NumberDisplay( countProperty, NUMBER_DISPLAY_RANGE, options );

  // Set non-dilated pointer areas so that they will be rendered by ?showPointerAreas.
  numberDisplay.touchArea = numberDisplay.localBounds.dilated( 0 );
  numberDisplay.mouseArea = numberDisplay.localBounds.dilated( 0 );

  return numberDisplay;
}

naturalSelection.register( 'DataProbeNode', DataProbeNode );