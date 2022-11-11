// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * PopulationModel is the sub-model for the Population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCounts from './BunnyCounts.js';
import DataProbe from './DataProbe.js';
import GenePool from './GenePool.js';

// constants

// The default index into Y_MAXIMUMS, determines the initial y-axis range.
const Y_MAXIMUMS_INDEX_DEFAULT = 11;

// Minimum value for the y-axis range.
const Y_MINIMUM = 0;

// Maximum population values for the y-axis range.
const Y_MAXIMUMS = [ 2500, 2000, 1400, 1000, 700, 500, 350, 240, 200, 140, 100, 70, 50, 30, 14, 5 ];
assert && assert( _.every( value => NaturalSelectionUtils.isPositiveInteger( value ) ),
  'Y_MAXIMUMS must contain positive integer values' );
assert && assert( NaturalSelectionUtils.isSortedDescending( Y_MAXIMUMS ),
  'Y_MAXIMUMS must be sorted in descending order' );

// Spacing of tick marks for each value of Y_MAXIMUMS.
const Y_TICK_SPACINGS = [ 500, 200, 200, 100, 100, 100, 50, 40, 40, 20, 20, 10, 10, 5, 2, 1 ];
assert && assert( Y_TICK_SPACINGS.length === Y_MAXIMUMS.length, 'incorrect number of Y_TICK_SPACINGS' );
assert && assert( _.every( value => NaturalSelectionUtils.isPositiveInteger( value ) ),
  'Y_TICK_SPACINGS must contain positive integer values' );
assert && assert( NaturalSelectionUtils.isSortedDescending( Y_TICK_SPACINGS ),
  'Y_TICK_SPACINGS must be sorted in descending order' );

export default class PopulationModel extends PhetioObject {

  /**
   * @param {GenePool} genePool
   * @param {ReadOnlyProperty.<number>} timeInGenerationsProperty
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( genePool, timeInGenerationsProperty, isPlayingProperty, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && AssertUtils.assertAbstractPropertyOf( timeInGenerationsProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );

    options = merge( {

      // {number} length of the x-axis, in generations
      xAxisLength: 5,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false, // to prevent serialization, because we don't have an IO Type
      phetioDocumentation: 'model elements that are specific to the Population feature'
    }, options );

    super( options );

    // @public
    this.genePool = genePool;
    this.timeInGenerationsProperty = timeInGenerationsProperty;
    this.isPlayingProperty = isPlayingProperty;
    this.xAxisLength = options.xAxisLength;

    // For organizing all data points in Studio
    const dataPointsTandem = options.tandem.createTandem( 'dataPoints' );

    // @public {ObservableArrayDef.<Vector2>} - data points, for total population and the population of each allele.
    // Vector2.x = generation, Vector2.y = population
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

    // @public visibility of each data set, on the graph and data probe
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

    // @public (read-only) spacing between x-axis tick marks, in generations
    this.xAxisTickSpacing = 1;

    // @public range of the x-axis, as time in generations
    this.xRangeProperty = new Property( new Range( 0, options.xAxisLength ), {
      isValidValue: xRange => ( xRange.min >= 0 ),
      tandem: options.tandem.createTandem( 'xRangeProperty' ),
      phetioValueType: Range.RangeIO,
      phetioReadOnly: true, // range is dynamic, and changes on every clock tick
      phetioHighFrequency: true,
      phetioDocumentation: 'range of the x (Generation) axis'
    } );

    // @public index into Y_MAXIMUMS, determines the y-axis range
    this.yZoomLevelProperty = new NumberProperty( Y_MAXIMUMS_INDEX_DEFAULT, {
      numberType: 'Integer',
      range: new Range( 0, Y_MAXIMUMS.length - 1 ),
      tandem: options.tandem.createTandem( 'yZoomLevelProperty' ),
      phetioDocumentation: 'Zooms in and out by selecting a pre-set y-axis range. The smaller the value, the larger the y-axis range.'
    } );

    // @public range of the y-axis, in population. dispose is not necessary.
    this.yRangeProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => new Range( Y_MINIMUM, Y_MAXIMUMS[ yZoomLevel ] ), {
        isValidValue: yRange => ( yRange.min >= 0 ),
        tandem: options.tandem.createTandem( 'yRangeProperty' ),
        phetioValueType: Range.RangeIO,
        phetioDocumentation: 'range of the y (Population) axis'
      } );

    // @public
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

  /**
   * @public
   */
  reset() {

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
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Gets the y-axis tick mark spacing for the current y-axis scale.
   * @returns {number}
   * @public
   */
  getYTickSpacing() {
    return Y_TICK_SPACINGS[ this.yZoomLevelProperty.value ];
  }

  /**
   * Converts population counts to Vector2 points on the graph.
   * @param {number} timeInGenerations - time (in generations) for the counts
   * @param {BunnyCounts} counts
   * @public
   */
  recordCounts( timeInGenerations, counts ) {
    assert && assert( NaturalSelectionUtils.isNonNegative( timeInGenerations ), `invalid timeInGenerations: ${timeInGenerations}` );
    assert && assert( counts instanceof BunnyCounts, 'invalid counts' );

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
 * @param {Array.<Vector2>} array
 * @param {number} timeInGenerations - time (in generations) for the count
 * @param {number} count
 */
function recordCount( array, timeInGenerations, count ) {
  assert && assert( Array.isArray( array ), 'invalid array' );
  assert && assert( NaturalSelectionUtils.isNonNegative( timeInGenerations ), 'invalid generation' );
  assert && assert( NaturalSelectionUtils.isNonNegativeInteger( count ), 'invalid count' );

  if ( array.length === 0 || array[ array.length - 1 ].y !== count ) {
    array.push( new Vector2( timeInGenerations, count ) );
  }
}

naturalSelection.register( 'PopulationModel', PopulationModel );