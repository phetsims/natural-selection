// Copyright 2019-2020, University of Colorado Boulder

/**
 * PopulationModel is the sub-model used by the Population view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import ObservableArrayIO from '../../../../axon/js/ObservableArrayIO.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import Range from '../../../../dot/js/Range.js';
import RangeIO from '../../../../dot/js/RangeIO.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2IO from '../../../../dot/js/Vector2IO.js';
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
const Y_MAXIMUMS_INDEX_DEFAULT = 3;

// Minimum value for the y-axis range.
const Y_MINIMUM = 0;

// Maximum population values for the y-axis range.
const Y_MAXIMUMS = [ 5, 14, 30, 50, 70, 100, 140, 200, 240, 350, 500, 1000, 1400, 2000, 2500 ];
assert && assert( _.every( value => NaturalSelectionUtils.isPositiveInteger( value ) ),
  'Y_MAXIMUMS must contain positive integer values' );
assert && assert( NaturalSelectionUtils.isSorted( Y_MAXIMUMS ),
  'Y_MAXIMUMS must be sorted in ascending order' );

// Spacing of tick marks for each value of Y_MAXIMUMS.
const Y_TICK_SPACINGS = [ 1, 2, 5, 10, 10, 20, 20, 40, 40, 50, 100, 100, 200, 200, 500 ];
assert && assert( Y_TICK_SPACINGS.length === Y_MAXIMUMS.length, 'incorrect number of Y_TICK_SPACINGS' );
assert && assert( _.every( value => NaturalSelectionUtils.isPositiveInteger( value ) ),
  'Y_TICK_SPACINGS must contain positive integer values' );
assert && assert( NaturalSelectionUtils.isSorted( Y_TICK_SPACINGS ),
  'Y_TICK_SPACINGS must be sorted in ascending order' );

class PopulationModel extends PhetioObject {

  /**
   * @param {GenePool} genePool
   * @param {Property.<number>} generationsProperty
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( genePool, generationsProperty, isPlayingProperty, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && AssertUtils.assertPropertyOf( generationsProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );

    options = merge( {

      // {number} width of the graph, in generations
      xWidth: 5,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'model elements that are specific to the Population feature'
    }, options );

    super( options );

    // @public
    this.genePool = genePool;
    this.generationsProperty = generationsProperty;
    this.isPlayingProperty = isPlayingProperty;
    this.xWidth = options.xWidth;

    // For organizing all data points in Studio
    const dataPointsTandem = options.tandem.createTandem( 'dataPoints' );

    // @public data points, for total population and the population of each allele.
    // Vector2.x = generation, Vector2.y = population
    this.totalPoints = new ObservableArray( {
      tandem: dataPointsTandem.createTandem( 'totalPoints' ),
      phetioType: ObservableArrayIO( Vector2IO )
    } );
    this.whiteFurPoints = new ObservableArray( {
      tandem: dataPointsTandem.createTandem( 'whiteFurPoints' ),
      phetioType: ObservableArrayIO( Vector2IO )
    } );
    this.brownFurPoints = new ObservableArray( {
      tandem: dataPointsTandem.createTandem( 'brownFurPoints' ),
      phetioType: ObservableArrayIO( Vector2IO )
    } );
    this.straightEarsPoints = new ObservableArray( {
      tandem: dataPointsTandem.createTandem( 'straightEarsPoints' ),
      phetioType: ObservableArrayIO( Vector2IO )
    } );
    this.floppyEarsPoints = new ObservableArray( {
      tandem: dataPointsTandem.createTandem( 'floppyEarsPoints' ),
      phetioType: ObservableArrayIO( Vector2IO )
    } );
    this.shortTeethPoints = new ObservableArray( {
      tandem: dataPointsTandem.createTandem( 'shortTeethPoints' ),
      phetioType: ObservableArrayIO( Vector2IO )
    } );
    this.longTeethPoints = new ObservableArray( {
      tandem: dataPointsTandem.createTandem( 'longTeethPoints' ),
      phetioType: ObservableArrayIO( Vector2IO )
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

    // @public range of the x-axis, in generations
    this.xRangeProperty = new Property( new Range( 0, options.xWidth ), {
      isValidValue: xRange => ( xRange.min >= 0 ),
      tandem: options.tandem.createTandem( 'xRangeProperty' ),
      phetioType: PropertyIO( RangeIO ),
      phetioReadOnly: true, // range is dynamic, and changes on every clock tick
      phetioHighFrequency: true,
      phetioDocumentation: 'range of the x (Generation) axis'
    } );

    // @public index into Y_MAXIMUMS, determines the y-axis range
    this.yZoomLevelProperty = new NumberProperty( Y_MAXIMUMS_INDEX_DEFAULT, {
      numberType: 'Integer',
      range: new Range( 0, Y_MAXIMUMS.length - 1 ),
      tandem: options.tandem.createTandem( 'yZoomLevelProperty' ),
      phetioDocumentation: 'Zooms in and out by selecting a pre-set y-axis range. The larger the value, the larger the y-axis range.'
    } );

    // @public range of the y-axis, in population. dispose is not necessary.
    this.yRangeProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => new Range( Y_MINIMUM, Y_MAXIMUMS[ yZoomLevel ] ), {
        isValidValue: yRange => ( yRange.min >= 0 ),
        phetioType: DerivedPropertyIO( RangeIO ),
        tandem: options.tandem.createTandem( 'yRangeProperty' ),
        phetioDocumentation: 'range of the y (Population) axis'
      } );

    // @public
    this.dataProbe = new DataProbe( this, {
      tandem: options.tandem.createTandem( 'dataProbe' )
    } );

    // Scrolls the x-axis so that xRangeProperty.max is 'now'.
    const scrollToNow = () => {
      if ( generationsProperty.value > this.xRangeProperty.value.max ) {
        const max = generationsProperty.value;
        const min = max - options.xWidth;
        this.xRangeProperty.value = new Range( min, max );
      }
    };

    // When generations changes... unlink is not necessary.
    generationsProperty.link( () => {

      // scroll the x-axis
      scrollToNow();

      //TODO update dataProbe if it was previously to the right of data (better place to do this?)
    } );

    // When the sim starts playing, scroll the x-axis. unlink is not necessary.
    isPlayingProperty.link( isPlaying => {
      if ( isPlaying ) {
        scrollToNow();
      }
    } );

    // unlink is not necessary.
    this.xRangeProperty.link( xRange => {
      //TODO update dataProbe.generationProperty
    } );

    // When a mutation has been applied, show the plots associated with that gene.
    // unlink is not needed
    this.genePool.furGene.dominantAlleleProperty.link( dominantAllele => {
      this.whiteFurVisibleProperty.value = !!dominantAllele;
      this.brownFurVisibleProperty.value = !!dominantAllele;
    } );
    this.genePool.earsGene.dominantAlleleProperty.link( dominantAllele => {
      this.straightEarsVisibleProperty.value = !!dominantAllele;
      this.floppyEarsVisibleProperty.value = !!dominantAllele;
    } );
    this.genePool.teethGene.dominantAlleleProperty.link( dominantAllele => {
      this.shortTeethVisibleProperty.value = !!dominantAllele;
      this.longTeethVisibleProperty.value = !!dominantAllele;
    } );
  }

  /**
   * @public
   */
  reset() {

    // clear data points
    this.totalPoints.reset();
    this.whiteFurPoints.reset();
    this.brownFurPoints.reset();
    this.straightEarsPoints.reset();
    this.floppyEarsPoints.reset();
    this.shortTeethPoints.reset();
    this.longTeethPoints.reset();

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
   * @param {number} generation - floating point, not integer!
   * @param {BunnyCounts} counts
   * @public
   */
  recordCounts( generation, counts ) {
    assert && assert( NaturalSelectionUtils.isNonNegative( generation ), 'invalid generation' );
    assert && assert( counts instanceof BunnyCounts, 'invalid counts' );

    phet.log && phet.log( `PopulationModel.recordCounts: generation=${generation} counts=${counts}` );
    recordCount( this.totalPoints, generation, counts.totalCount );
    recordCount( this.whiteFurPoints, generation, counts.whiteFurCount );
    recordCount( this.brownFurPoints, generation, counts.brownFurCount );
    recordCount( this.straightEarsPoints, generation, counts.straightEarsCount );
    recordCount( this.floppyEarsPoints, generation, counts.floppyEarsCount );
    recordCount( this.shortTeethPoints, generation, counts.shortTeethCount );
    recordCount( this.longTeethPoints, generation, counts.longTeethCount );
  }
}

/**
 * Records a count if it differs from the previous data point.
 * @param {ObservableArray.<Vector2>} observableArray
 * @param {number} generation - floating point, not integer!
 * @param {number} count
 */
function recordCount( observableArray, generation, count ) {
  assert && assert( observableArray instanceof ObservableArray, 'invalid observableArray' );
  assert && assert( NaturalSelectionUtils.isNonNegative( generation ), 'invalid generation' );
  assert && assert( NaturalSelectionUtils.isNonNegativeInteger( count ), 'invalid count' );

  if ( observableArray.length === 0 || observableArray.get( observableArray.length - 1 ).y !== count ) {
    observableArray.push( new Vector2( generation, count ) );
  }
}

naturalSelection.register( 'PopulationModel', PopulationModel );
export default PopulationModel;