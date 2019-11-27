// Copyright 2019, University of Colorado Boulder

/**
 * PopulationModel is the model used by the Population view.
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

  // constants
  const CHECKBOXES_ENABLED = true; //TODO for debugging, delete this, should be false

  class PopulationModel {

    constructor() {

      // @public visibility of the Values Marker on the graph
      this.valuesMarkerVisibleProperty = new BooleanProperty( false );

      // @public visibility of the total population plot on the graph
      this.totalVisibleProperty = new BooleanProperty( true );

      // @public visibility of the plot for each allele on the graph
      this.whiteFurVisibleProperty = new BooleanProperty( false );
      this.brownFurVisibleProperty = new BooleanProperty( false );
      this.straightEarsVisibleProperty = new BooleanProperty( false );
      this.floppyEarsVisibleProperty = new BooleanProperty( false );
      this.shortTeethVisibleProperty = new BooleanProperty( false );
      this.longTeethVisibleProperty = new BooleanProperty( false );

      // @public enabled state of the checkbox for each allele in the Population control panel
      // Checkboxes are disabled until an associated mutation is applied.
      this.whiteFurEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED );
      this.brownFurEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED );
      this.straightEarsEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED );
      this.floppyEarsEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED );
      this.shortTeethEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED );
      this.longTeethEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED );

      const countPropertyOptions = {
        isValidValue: value => ( value === null ) || ( typeof value === 'number' && Util.isInteger( value ) )
      };

      //TODO bogus values, for demo purposes
      // @public counts displayed by the Values Marker. null means that there is no data.
      this.totalCountProperty = new Property( 1000, countPropertyOptions );
      this.whiteFurCountProperty = new Property( 600, countPropertyOptions );
      this.brownFurCountProperty = new Property( 400, countPropertyOptions );
      this.straightEarsCountProperty = new Property( 988, countPropertyOptions );
      this.floppyEarsCountProperty = new Property( 12, countPropertyOptions );
      this.shortTeethCountProperty = new Property( 1000, countPropertyOptions );
      this.longTeethCountProperty = new Property( 0, countPropertyOptions );

      // @public range of the graph's x axis, in generations
      this.xRangeProperty = new Property( new Range( 0, 6 ), {
        valueType: Range,
        isValueValue: value => ( value.min && value.max )
      } );

      // @public zoom level of the graph's y axis
      this.yZoomLevelProperty = new NumberProperty( 1 );
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

      this.whiteFurEnabledProperty.reset();
      this.brownFurEnabledProperty.reset();
      this.straightEarsEnabledProperty.reset();
      this.floppyEarsEnabledProperty.reset();
      this.shortTeethEnabledProperty.reset();
      this.longTeethEnabledProperty.reset();

      this.xRangeProperty.reset();
      this.yZoomLevelProperty.reset();
    }
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );