// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Climates = require( 'NATURAL_SELECTION/common/model/Climates' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class NaturalSelectionModel {

    /**
     * @param {SelectionAgent[]} selectionAgents
     */
    constructor( selectionAgents ) {

      // @public (read-only) {SelectionAgent[]}
      this.selectionAgents = selectionAgents;

      // @public whether the sim is playing
      this.isPlayingProperty = new BooleanProperty( true );

      // @public when true, the food supply is limited
      this.limitFoodProperty = new BooleanProperty( false );

      // @public the climate where the simulation is taking place
      this.climateProperty = new EnumerationProperty( Climates, Climates.EQUATOR );
    }

    /**
     * @public
     */
    reset() {
      this.selectionAgents.forEach( selectionAgent => selectionAgent.reset() );
      this.isPlayingProperty.reset();
      this.limitFoodProperty.reset();
      this.climateProperty.reset();
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {
      if ( this.isPlayingProperty.value ) {
        //TODO
      }
    }
  }

  return naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
} );