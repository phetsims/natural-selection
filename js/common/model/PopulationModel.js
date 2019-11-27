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
      this.whiteFurEnabledProperty = new BooleanProperty( false );
      this.brownFurEnabledProperty = new BooleanProperty( false );
      this.straightEarsEnabledProperty = new BooleanProperty( false );
      this.floppyEarsEnabledProperty = new BooleanProperty( false );
      this.shortTeethEnabledProperty = new BooleanProperty( false );
      this.longTeethEnabledProperty = new BooleanProperty( false );

      // @public
      this.totalCountProperty = new NumberProperty( 1000 );
      this.whiteFurCountProperty = new NumberProperty( 500 );
      this.brownFurCountProperty = new NumberProperty( 500 );
      this.straightEarsCountProperty = new NumberProperty( 500 );
      this.floppyEarsCountProperty = new NumberProperty( 500 );
      this.shortTeethCountProperty = new NumberProperty( 500 );
      this.longTeethCountProperty = new NumberProperty( 500 );

      // @public zoom level of the graph's y axis
      this.yZoomLevelProperty = new NumberProperty( 1 );
    }

    /**
     * @public
     */
    reset() {
      this.valuesMarkerVisibleProperty.reset();
      this.totalVisibleProperty.reset();
      this.yZoomLevelProperty.reset();

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
    }
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );