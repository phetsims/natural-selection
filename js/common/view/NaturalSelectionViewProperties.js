// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionViewProperties contains view-specific Properties that are common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class NaturalSelectionViewProperties {

    constructor() {

      // @public
      this.graphProperty = new EnumerationProperty( Graphs, Graphs.POPULATION );

      // @public
      this.populationTotalVisibleProperty = new BooleanProperty( false );
      this.populationValuesMarkerVisibleProperty = new BooleanProperty( false );

    }

    /**
     * @public
     */
    reset() {
      this.graphProperty.reset();
      this.populationTotalVisibleProperty.reset();
      this.populationValuesMarkerVisibleProperty.reset();
      this.populationWhiteFurVisibleProperty.reset();
      this.populationBrownFurVisibleProperty.reset();
    }
  }

  return naturalSelection.register( 'NaturalSelectionViewProperties', NaturalSelectionViewProperties );
} );