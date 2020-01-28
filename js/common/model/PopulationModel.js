// Copyright 2019-2020, University of Colorado Boulder

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
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Range = require( 'DOT/Range' );
  const RangeIO = require( 'DOT/RangeIO' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Utils = require( 'DOT/Utils' );

  // constants

  // Default x-axis range, in generations.
  const X_RANGE_DEFAULT = new Range( 0, 5 );

  // The default index into Y_MAXIMUMS, determines the initial y-axis range.
  const Y_MAXIMUMS_INDEX_DEFAULT = 3;

  // Minimum value for the y-axis range.
  const Y_MINIMUM = 0;

  // Maximum population values for the y-axis range.
  const Y_MAXIMUMS = [ 5, 14, 30, 50, 70, 100, 140, 200, 240, 350, 500, 1000, 2000, 3000, 5000 ];
  assert && assert( _.every( value => Utils.isInteger( value ) ), 'Y_MAXIMUMS must contain integer values' );
  //TODO assert that Y_MAXIMUMS values are in ascending order

  // Spacing of tick marks for each value of Y_MAXIMUMS.
  const Y_TICK_SPACINGS = [ 1, 2, 5, 10, 10, 20, 20, 40, 40, 50, 100, 200, 400, 500, 1000 ];
  assert && assert( Y_TICK_SPACINGS.length === Y_MAXIMUMS.length, 'incorrect number of Y_TICK_SPACINGS' );
  assert && assert( _.every( value => Utils.isInteger( value ) ), 'Y_TICK_SPACINGS must contain integer values' );

  class PopulationModel extends PhetioObject {

    /**
     * @param {Property.<number>} generationsProperty
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Tandem} tandem
     */
    constructor( generationsProperty, isPlayingProperty, tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      super( {

        // phet-io
        tandem: tandem,
        phetioState: false, // to prevent serialization, because we don't have an IO type
        phetioDocumentation: 'portion of the model that deals with the Population graph'
      } );

      // @public
      this.generationsProperty = generationsProperty;
      this.isPlayingProperty = isPlayingProperty;

      // @public
      this.dataProbe = new DataProbe( {
        tandem: tandem.createTandem( 'dataProbe' )
      } );

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

      // @public (read-only) spacing between x-axis tick marks, in generations
      this.xAxisTickSpacing = 1;

      // @public range of the x-axis, in generations
      this.xRangeProperty = new Property( new Range( 0, 5 ), {
        isValidValue: xRange => ( xRange.min >= 0 ),
        tandem: tandem.createTandem( 'xRangeProperty' ),
        phetioType: PropertyIO( RangeIO ),
        phetioStudioControl: false, //TODO range is dynamic, and changes on every clock tick
        phetioHighFrequency: true,
        phetioDocumentation: 'range of the x axis, in generations'
      } );

      // @public index into Y_MAXIMUMS, determines the y-axis range
      this.yRangeIndexProperty = new NumberProperty( Y_MAXIMUMS_INDEX_DEFAULT, {
        numberType: 'Integer',
        range: new Range( 0, Y_MAXIMUMS.length - 1 ),
        tandem: tandem.createTandem( 'yRangeIndexProperty' ),
        phetioDocumentation: 'index into an array of ranges for the y axis, larger values are larger ranges'
      } );

      // @public range of the y-axis, in population
      this.yRangeProperty = new DerivedProperty(
        [ this.yRangeIndexProperty ],
        yRangeIndex => new Range( Y_MINIMUM, Y_MAXIMUMS[ yRangeIndex ] ), {
          isValidValue: yRange => ( yRange.min >= 0 ),
          phetioType: DerivedPropertyIO( RangeIO ),
          tandem: tandem.createTandem( 'yRangeProperty' ),
          phetioDocumentation: 'range of the y axis, in number of bunnies'
        } );
      phet.log && this.yRangeProperty.link( yRange => phet.log( `yRange=${yRange}` ) );

      // Scrolls the x-axis so that xRangeProperty.max is 'now'.
      const scrollToNow = () => {
        if ( generationsProperty.value > this.xRangeProperty.value.max ) {
          const max = generationsProperty.value;
          const min = max - X_RANGE_DEFAULT.getLength();
          this.xRangeProperty.value = new Range( min, max );
        }
      };

      // When generations changes, scroll the x-axis.
      generationsProperty.link( () => scrollToNow() );

      // When the sim starts playing, scroll the x-axis.
      isPlayingProperty.link( isPlaying => {
        if ( isPlaying ) {
          scrollToNow();
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

      this.xRangeProperty.reset();
      this.yRangeIndexProperty.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'PopulationModel does not support dispose' );
    }

    /**
     * Gets the y-axis tick mark spacing for the current y-axis scale.
     * @returns {number}
     * @public
     */
    getYTickSpacing() {
      return Y_TICK_SPACINGS[ this.yRangeIndexProperty.value ];
    }
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );