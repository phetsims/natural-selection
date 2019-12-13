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

  // constants
  const X_AXIS_WIDTH = 7; // in generations

  class PopulationModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

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
      this.xAxisRangeProperty = new Property( new Range( 0, X_AXIS_WIDTH ), {
        phetioType: PropertyIO( RangeIO ),
        tandem: tandem.createTandem( 'xAxisRangeProperty' )
      } );

      // Maximum population values for the y-axis scale. These are identical to the Java version.
      const yAxisMaximums = [ 5, 15, 30, 50, 75, 100, 150, 200, 250, 350, 500, 1000, 2000, 3000, 5000 ];

      // @public index into yAxisMaximums
      this.yAxisMaximumsIndexProperty = new NumberProperty( 3, {
        numberType: 'Integer',
        range: new Range( 0, yAxisMaximums.length - 1 ),
        tandem: tandem.createTandem( 'yAxisMaximumsIndexProperty' )
      } );

      // @public range of the graph's y axis, in population
      this.yAxisRangeProperty = new DerivedProperty(
        [ this.yAxisMaximumsIndexProperty ],
        index => new Range( 0, yAxisMaximums[ index ] ), {
          phetioType: DerivedPropertyIO( RangeIO ),
          tandem: tandem.createTandem( 'yAxisRangeProperty' )
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
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );