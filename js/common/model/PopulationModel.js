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

  class PopulationModel {

    constructor() {

      // @public visibility of the values marker on the graph
      this.valuesMarkerVisibleProperty = new BooleanProperty( false );

      // @public visibility of the total population plot on the graph
      this.totalVisibleProperty = new BooleanProperty( true );

      // @public visibility of the plot for each allele on the graph
      this.whiteFurVisibleProperty = new BooleanProperty( false );
      this.brownFurVisibleProperty = new BooleanProperty( false );
      this.tallEarsVisibleProperty = new BooleanProperty( false );
      this.flatEarsVisibleProperty = new BooleanProperty( false );
      this.shortTeethVisibleProperty = new BooleanProperty( false );
      this.longTeethVisibleProperty = new BooleanProperty( false );

      // @public enabled state of the checkbox for each allele in the Population control panel
      // Checkboxes are disabled until an associated mutation is applied.
      this.whiteFurEnabledProperty = new BooleanProperty( false );
      this.brownFurEnabledProperty = new BooleanProperty( false );
      this.tallEarsEnabledProperty = new BooleanProperty( false );
      this.flatEarsEnabledProperty = new BooleanProperty( false );
      this.shortTeethEnabledProperty = new BooleanProperty( false );
      this.longTeethEnabledProperty = new BooleanProperty( false );
    }

    /**
     * @public
     */
    reset() {
      this.valuesMarkerVisibleProperty.reset();

      this.totalVisibleProperty.reset();

      this.whiteFurVisibleProperty.reset();
      this.brownFurVisibleProperty.reset();
      this.tallEarsVisibleProperty.reset();
      this.flatEarsVisibleProperty.reset();
      this.shortTeethVisibleProperty.reset();
      this.longTeethVisibleProperty.reset();

      this.whiteFurEnabledProperty.reset();
      this.brownFurEnabledProperty.reset();
      this.tallEarsEnabledProperty.reset();
      this.flatEarsEnabledProperty.reset();
      this.shortTeethEnabledProperty.reset();
      this.longTeethEnabledProperty.reset();
    }
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );