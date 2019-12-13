// Copyright 2019, University of Colorado Boulder

/**
 * PopulationModel is the sub-model used by the Population view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DataProbe = require( 'NATURAL_SELECTION/common/model/DataProbe' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Range = require( 'DOT/Range' );
  const RangeIO = require( 'DOT/RangeIO' );
  const Util = require( 'DOT/Util' );

  // constants
  const X_AXIS_LENGTH = 7; // length of the x-axis range, in generations
  
  // Maximum population values for the y-axis scale. These are identical to the Java version.
  const Y_AXIS_MAXIMUMS = [ 5, 15, 30, 50, 75, 100, 150, 200, 250, 350, 500, 1000, 2000, 3000, 5000 ];
  assert && assert( _.every( value => Util.isInteger( value ) ), 'Y_AXIS_MAXIMUMS must contain integer values' );
  //TODO assert that Y_AXIS_MAXIMUMS values are in ascending order

  // The default index into Y_AXIS_MAXIMUMS, determines the initial y-axis scale.
  const Y_AXIS_MAXIMUMS_INDEX_DEFAULT = 3;

  class PopulationModel {

    /**
     * @param {Property.<number>} currentGenerationProperty
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Tandem} tandem
     */
    constructor( currentGenerationProperty, isPlayingProperty, tandem ) {

      // @public
      this.currentGenerationProperty = currentGenerationProperty;

      // @public
      this.dataProbe = new DataProbe( tandem.createTandem( 'dataProbe' ) );

      // @public visibility of the total population plot on the graph and data probe
      this.totalVisibleProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'totalVisibleProperty' )
      } );

      // @public visibility of the plot for each allele on the graph and data probe
      this.whiteFurVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'whiteFurVisibleProperty' )
      } );
      this.brownFurVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'brownFurVisibleProperty' )
      } );
      this.straightEarsVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'straightEarsVisibleProperty' )
      } );
      this.floppyEarsVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'floppyEarsVisibleProperty' )
      } );
      this.shortTeethVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'shortTeethVisibleProperty' )
      } );
      this.longTeethVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'longTeethVisibleProperty' )
      } );

      // @public range of the graph's x axis, in generations
      this.xAxisRangeProperty = new Property( new Range( 0, X_AXIS_LENGTH ), {
        phetioType: PropertyIO( RangeIO ),
        isValidValue: range => ( range.min >= 0 ),
        tandem: tandem.createTandem( 'xAxisRangeProperty' )
      } );
      phet.log && this.xAxisRangeProperty.link(
        xAxisRangeProperty => phet.log( `xAxisRangeProperty=${xAxisRangeProperty}` )
      );

      // @public the total range of the x-axis data
      this.xAxisTotalRangeProperty = new DerivedProperty( [ currentGenerationProperty ],
        currentGeneration => new Range( 0, currentGeneration + 1 ) );

      // @public index into Y_AXIS_MAXIMUMS
      this.yAxisMaximumsIndexProperty = new NumberProperty( Y_AXIS_MAXIMUMS_INDEX_DEFAULT, {
        numberType: 'Integer',
        range: new Range( 0, Y_AXIS_MAXIMUMS.length - 1 ),
        tandem: tandem.createTandem( 'yAxisMaximumsIndexProperty' )
      } );

      // @public range of the graph's y axis, in population
      this.yAxisRangeProperty = new DerivedProperty(
        [ this.yAxisMaximumsIndexProperty ],
        index => new Range( 0, Y_AXIS_MAXIMUMS[ index ] ), {
          phetioType: DerivedPropertyIO( RangeIO ),
          tandem: tandem.createTandem( 'yAxisRangeProperty' )
        } );
      phet.log && this.yAxisRangeProperty.link(
        yAxisRange => phet.log( `yAxisRange=${yAxisRange}` )
      );

      // Pause the sim if we scroll back in time while it's playing
      this.xAxisRangeProperty.link( xAxisRange => {
        if ( isPlayingProperty.value ) {
          isPlayingProperty.value = xAxisRange.contains( currentGenerationProperty.value );
        }
      } );

      // When the sim starts playing or the current generation changes, scroll to the current generation
      Property.multilink(
        [ isPlayingProperty, currentGenerationProperty ],
        ( isPlaying, currentGeneration ) => {
          if ( isPlaying ) {
            const xMax = Math.max( X_AXIS_LENGTH, currentGeneration + 1 ); //TODO this +1 is duplicated above
            const xMin = xMax - X_AXIS_LENGTH;
            this.xAxisRangeProperty.value = new Range( xMin, xMax );
          }
        } );
    }

    /**
     * @public
     */
    reset() {
      this.dataProbe.reset();

      this.totalVisibleProperty.reset();
      this.whiteFurVisibleProperty.reset();
      this.brownFurVisibleProperty.reset();
      this.straightEarsVisibleProperty.reset();
      this.floppyEarsVisibleProperty.reset();
      this.shortTeethVisibleProperty.reset();
      this.longTeethVisibleProperty.reset();

      this.xAxisRangeProperty.reset();
      this.yAxisMaximumsIndexProperty.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'PopulationModel does not support dispose' );
    }
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );