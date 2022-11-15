// Copyright 2019-2022, University of Colorado Boulder

/**
 * PopulationModel is the sub-model for the Population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCounts from './BunnyCounts.js';
import DataProbe from './DataProbe.js';
import GenePool from './GenePool.js';

// The default index into Y_MAXIMUMS, determines the initial y-axis range.
const Y_MAXIMUMS_INDEX_DEFAULT = 11;

// Minimum value for the y-axis range.
const Y_MINIMUM = 0;

// Maximum population values for the y-axis range.
const Y_MAXIMUMS = [ 2500, 2000, 1400, 1000, 700, 500, 350, 240, 200, 140, 100, 70, 50, 30, 14, 5 ];
assert && assert( _.every( Y_MAXIMUMS, value => NaturalSelectionUtils.isPositiveInteger( value ) ),
  'Y_MAXIMUMS must contain positive integer values' );
assert && assert( NaturalSelectionUtils.isSortedDescending( Y_MAXIMUMS ),
  'Y_MAXIMUMS must be sorted in descending order' );

// Spacing of tick marks for each value of Y_MAXIMUMS.
const Y_TICK_SPACINGS = [ 500, 200, 200, 100, 100, 100, 50, 40, 40, 20, 20, 10, 10, 5, 2, 1 ];
assert && assert( Y_TICK_SPACINGS.length === Y_MAXIMUMS.length, 'incorrect number of Y_TICK_SPACINGS' );
assert && assert( _.every( Y_TICK_SPACINGS, value => NaturalSelectionUtils.isPositiveInteger( value ) ),
  'Y_TICK_SPACINGS must contain positive integer values' );
assert && assert( NaturalSelectionUtils.isSortedDescending( Y_TICK_SPACINGS ),
  'Y_TICK_SPACINGS must be sorted in descending order' );

type SelfOptions = {
  xAxisLength?: number; // length of the x-axis, in generations
};

type PopulationModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PopulationModel extends PhetioObject {

  public readonly genePool: GenePool;
  public readonly timeInGenerationsProperty: TReadOnlyProperty<number>;
  public readonly isPlayingProperty: Property<boolean>;
  public readonly xAxisLength: number; // length of the x-axis, in generations
  public readonly xAxisTickSpacing: number; // spacing between x-axis tick marks, in generations

  // data points, for total population and the population of each allele.
  // Vector2.x = generation, Vector2.y = population
  public readonly totalPoints: ObservableArray<Vector2>;
  public readonly whiteFurPoints: ObservableArray<Vector2>;
  public readonly brownFurPoints: ObservableArray<Vector2>;
  public readonly straightEarsPoints: ObservableArray<Vector2>;
  public readonly floppyEarsPoints: ObservableArray<Vector2>;
  public readonly shortTeethPoints: ObservableArray<Vector2>;
  public readonly longTeethPoints: ObservableArray<Vector2>;

  // visibility of each data set, on the graph and data probe
  public readonly totalVisibleProperty: Property<boolean>;
  public readonly whiteFurVisibleProperty: Property<boolean>;
  public readonly brownFurVisibleProperty: Property<boolean>;
  public readonly straightEarsVisibleProperty: Property<boolean>;
  public readonly floppyEarsVisibleProperty: Property<boolean>;
  public readonly shortTeethVisibleProperty: Property<boolean>;
  public readonly longTeethVisibleProperty: Property<boolean>;

  // range of the x-axis, as time in generations
  public readonly xRangeProperty: Property<Range>;

  // index into Y_MAXIMUMS, determines the y-axis range
  public readonly yZoomLevelProperty: NumberProperty;

  // range of the y-axis, in population. dispose is not necessary.
  public readonly yRangeProperty: TReadOnlyProperty<Range>;

  public readonly dataProbe: DataProbe;

  public constructor( genePool: GenePool, timeInGenerationsProperty: TReadOnlyProperty<number>,
                      isPlayingProperty: Property<boolean>, providedOptions: PopulationModelOptions ) {

    const options = optionize<PopulationModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      xAxisLength: 5,

      // PhetioObjectOptions
      phetioState: false, // to prevent serialization, because we don't have an IO Type
      phetioDocumentation: 'model elements that are specific to the Population feature'
    }, providedOptions );

    super( options );

    this.genePool = genePool;
    this.timeInGenerationsProperty = timeInGenerationsProperty;
    this.isPlayingProperty = isPlayingProperty;
    this.xAxisLength = options.xAxisLength;
    this.xAxisTickSpacing = 1;

    // For organizing all data points in Studio
    const dataPointsTandem = options.tandem.createTandem( 'dataPoints' );

    // data points, for total population and the population of each allele.
    this.totalPoints = createObservableArray( {
      tandem: dataPointsTandem.createTandem( 'totalPoints' ),
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'Population data points for all bunnies'
    } );
    this.whiteFurPoints = createObservableArray( {
      tandem: dataPointsTandem.createTandem( 'whiteFurPoints' ),
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'Population data points for bunnies with white fur'
    } );
    this.brownFurPoints = createObservableArray( {
      tandem: dataPointsTandem.createTandem( 'brownFurPoints' ),
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'Population data points for bunnies with brown fur'
    } );
    this.straightEarsPoints = createObservableArray( {
      tandem: dataPointsTandem.createTandem( 'straightEarsPoints' ),
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'Population data points for bunnies with straight ears'
    } );
    this.floppyEarsPoints = createObservableArray( {
      tandem: dataPointsTandem.createTandem( 'floppyEarsPoints' ),
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'Population data points for bunnies with floppy ears'
    } );
    this.shortTeethPoints = createObservableArray( {
      tandem: dataPointsTandem.createTandem( 'shortTeethPoints' ),
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'Population data points for bunnies with short teeth'
    } );
    this.longTeethPoints = createObservableArray( {
      tandem: dataPointsTandem.createTandem( 'longTeethPoints' ),
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'Population data points for bunnies with long teeth'
    } );

    // visibility of each data set, on the graph and data probe
    this.totalVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'totalVisibleProperty' )
    } );
    this.whiteFurVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'whiteFurVisibleProperty' )
    } );
    this.brownFurVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'brownFurVisibleProperty' )
    } );
    this.straightEarsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'straightEarsVisibleProperty' )
    } );
    this.floppyEarsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'floppyEarsVisibleProperty' )
    } );
    this.shortTeethVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'shortTeethVisibleProperty' )
    } );
    this.longTeethVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'longTeethVisibleProperty' )
    } );

    this.xRangeProperty = new Property( new Range( 0, options.xAxisLength ), {
      isValidValue: xRange => ( xRange.min >= 0 ),
      tandem: options.tandem.createTandem( 'xRangeProperty' ),
      phetioValueType: Range.RangeIO,
      phetioReadOnly: true, // range is dynamic, and changes on every clock tick
      phetioHighFrequency: true,
      phetioDocumentation: 'range of the x (Generation) axis'
    } );

    this.yZoomLevelProperty = new NumberProperty( Y_MAXIMUMS_INDEX_DEFAULT, {
      numberType: 'Integer',
      range: new Range( 0, Y_MAXIMUMS.length - 1 ),
      tandem: options.tandem.createTandem( 'yZoomLevelProperty' ),
      phetioDocumentation: 'Zooms in and out by selecting a pre-set y-axis range. The smaller the value, the larger the y-axis range.'
    } );

    this.yRangeProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => new Range( Y_MINIMUM, Y_MAXIMUMS[ yZoomLevel ] ), {
        isValidValue: yRange => ( yRange.min >= 0 ),
        tandem: options.tandem.createTandem( 'yRangeProperty' ),
        phetioValueType: Range.RangeIO,
        phetioDocumentation: 'range of the y (Population) axis'
      } );

    this.dataProbe = new DataProbe( this, {
      tandem: options.tandem.createTandem( 'dataProbe' )
    } );

    // Scrolls the x-axis so that 'now' is always the max x value. unlink is not necessary.
    timeInGenerationsProperty.link( timeInGeneration => {

      // Skip when restoring PhET-iO state, see https://github.com/phetsims/natural-selection/issues/315
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        const max = Math.max( options.xAxisLength, timeInGeneration );
        if ( this.xRangeProperty.value.max !== max ) {
          const min = max - options.xAxisLength;
          this.xRangeProperty.value = new Range( min, max );
        }
      }
    } );

    // When a mutation has been applied, show the plots associated with that gene.
    // unlinks are not necessary.
    // Do not do this when restoring PhET-iO state, see https://github.com/phetsims/natural-selection/issues/314.
    this.genePool.furGene.dominantAlleleProperty.link( dominantAllele => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.whiteFurVisibleProperty.value = !!dominantAllele;
        this.brownFurVisibleProperty.value = !!dominantAllele;
      }
    } );
    this.genePool.earsGene.dominantAlleleProperty.link( dominantAllele => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.straightEarsVisibleProperty.value = !!dominantAllele;
        this.floppyEarsVisibleProperty.value = !!dominantAllele;
      }
    } );
    this.genePool.teethGene.dominantAlleleProperty.link( dominantAllele => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.shortTeethVisibleProperty.value = !!dominantAllele;
        this.longTeethVisibleProperty.value = !!dominantAllele;
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {

    // Clear data points. Use this approach because these are instances of ObservableArrayDef.
    this.totalPoints.length = 0;
    this.whiteFurPoints.length = 0;
    this.brownFurPoints.length = 0;
    this.straightEarsPoints.length = 0;
    this.floppyEarsPoints.length = 0;
    this.shortTeethPoints.length = 0;
    this.longTeethPoints.length = 0;

    // reset visibility of plots
    this.totalVisibleProperty.reset();
    this.whiteFurVisibleProperty.reset();
    this.brownFurVisibleProperty.reset();
    this.straightEarsVisibleProperty.reset();
    this.floppyEarsVisibleProperty.reset();
    this.shortTeethVisibleProperty.reset();
    this.longTeethVisibleProperty.reset();

    this.xRangeProperty.reset();
    this.yZoomLevelProperty.reset();

    this.dataProbe.reset();
  }

  /**
   * Gets the y-axis tick mark spacing for the current y-axis scale.
   */
  public getYTickSpacing(): number {
    return Y_TICK_SPACINGS[ this.yZoomLevelProperty.value ];
  }

  /**
   * Converts population counts to Vector2 points on the graph.
   */
  public recordCounts( timeInGenerations: number, counts: BunnyCounts ): void {
    assert && assert( timeInGenerations >= 0, `invalid timeInGenerations: ${timeInGenerations}` );

    recordCount( this.totalPoints, timeInGenerations, counts.totalCount );
    recordCount( this.whiteFurPoints, timeInGenerations, counts.whiteFurCount );
    recordCount( this.brownFurPoints, timeInGenerations, counts.brownFurCount );
    recordCount( this.straightEarsPoints, timeInGenerations, counts.straightEarsCount );
    recordCount( this.floppyEarsPoints, timeInGenerations, counts.floppyEarsCount );
    recordCount( this.shortTeethPoints, timeInGenerations, counts.shortTeethCount );
    recordCount( this.longTeethPoints, timeInGenerations, counts.longTeethCount );
  }
}

/**
 * Records a count if it differs from the previous data point.
 */
function recordCount( array: Vector2[], timeInGenerations: number, count: number ): void {
  assert && assert( timeInGenerations >= 0, 'invalid generation' );
  assert && assert( NaturalSelectionUtils.isNonNegativeInteger( count ), 'invalid count' );

  if ( array.length === 0 || array[ array.length - 1 ].y !== count ) {
    array.push( new Vector2( timeInGenerations, count ) );
  }
}

naturalSelection.register( 'PopulationModel', PopulationModel );