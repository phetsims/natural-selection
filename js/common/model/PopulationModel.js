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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );

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

      //TODO phet-io instrumentation
      // @public range of the graph's x axis, in generations
      this.xAxisRangeProperty = new Property( new Range( 0, 6 ), {
        valueType: Range,
        isValueValue: value => ( value.min && value.max )
      } );

      //TODO change to yZoomIndexProperty
      // @public zoom level of the graph's y axis
      this.yZoomLevelProperty = new NumberProperty( 1, {
        numberType: 'Integer'
        //TODO isValidValue
      } );

      //TODO derived from yZoomLevelProperty?
      //TODO phet-io instrumentation
      // @public range of the graph's x axis, in population
      this.yAxisRangeProperty = new Property( new Range( 0, 50 ), {
        valueType: Range,
        isValueValue: value => ( value.min && value.max )
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

      this.yZoomLevelProperty.reset();
      this.xAxisRangeProperty.reset();
      this.yAxisRangeProperty.reset();
    }
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );