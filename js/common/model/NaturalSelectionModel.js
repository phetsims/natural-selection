// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AbioticEnvironments = require( 'NATURAL_SELECTION/common/model/AbioticEnvironments' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GenerationClock = require( 'NATURAL_SELECTION/common/model/GenerationClock' );
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

      // @public the abiotic environment where the simulation is taking place
      this.abioticEnvironmentProperty = new EnumerationProperty( AbioticEnvironments, AbioticEnvironments.EQUATOR );

      // @public whether a mate was added to the lone bunny that appears at startup
      this.mateWasAddedProperty = new BooleanProperty( false );

      // @public (read-only)
      this.generationClock = new GenerationClock();

      // @public whether anything that affects the lifespan of bunnies is enabled
      const dependencies = [ this.limitFoodProperty ];
      selectionAgents.forEach( selectionAgent => dependencies.push( selectionAgent.enabledProperty ) );
      this.selectionAgentsEnabledProperty = new DerivedProperty( dependencies,
        () => _.some( dependencies, booleanProperty => booleanProperty.value )
      );
    }

    /**
     * @public
     */
    reset() {
      this.selectionAgents.forEach( selectionAgent => selectionAgent.reset() );
      this.isPlayingProperty.reset();
      this.limitFoodProperty.reset();
      this.abioticEnvironmentProperty.reset();
      this.mateWasAddedProperty.reset();
      this.generationClock.reset();
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {

      // advance the generation clock
      if ( this.isPlayingProperty.value && this.mateWasAddedProperty.value ) {
        this.generationClock.step( dt );
      }
    }
  }

  return naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
} );