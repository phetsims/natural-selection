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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );

  class PopulationModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public visibility of the Values Marker on the graph
      this.valuesMarkerVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'valuesMarkerVisibleProperty' )
      } );

      // @public visibility of the total population plot on the graph
      this.totalVisibleProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'totalVisibleProperty' )
      } );

      // @public visibility of the plot for each allele on the graph
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

      const countPropertyOptions = {

        // null means that there is no data at the location of the Values Marker
        isValidValue: value => ( value === null ) || ( typeof value === 'number' && Util.isInteger( value ) )
      };

      //TODO bogus values, for demo purposes
      // @public counts displayed by the Values Marker
      this.totalCountProperty = new Property( 1000, countPropertyOptions );
      this.whiteFurCountProperty = new Property( 600, countPropertyOptions );
      this.brownFurCountProperty = new Property( 400, countPropertyOptions );
      this.straightEarsCountProperty = new Property( 988, countPropertyOptions );
      this.floppyEarsCountProperty = new Property( 12, countPropertyOptions );
      this.shortTeethCountProperty = new Property( 1000, countPropertyOptions );
      this.longTeethCountProperty = new Property( 0, countPropertyOptions );

      //TODO should this be PhET-iO instrumented?
      // @public range of the graph's x axis, in generations
      this.xRangeProperty = new Property( new Range( 0, 6 ), {
        valueType: Range,
        isValueValue: value => ( value.min && value.max )
      } );

      // @public zoom level of the graph's y axis
      this.yZoomLevelProperty = new NumberProperty( 1, {
        tandem: tandem.createTandem( 'yZoomLevelProperty' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.valuesMarkerVisibleProperty.reset();

      this.totalVisibleProperty.reset();

      this.whiteFurVisibleProperty.reset();
      this.brownFurVisibleProperty.reset();
      this.straightEarsVisibleProperty.reset();
      this.floppyEarsVisibleProperty.reset();
      this.shortTeethVisibleProperty.reset();
      this.longTeethVisibleProperty.reset();

      this.xRangeProperty.reset();
      this.yZoomLevelProperty.reset();
    }
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );