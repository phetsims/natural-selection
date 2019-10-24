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
  const LimitedFood = require( 'NATURAL_SELECTION/common/model/LimitedFood' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const ToughFood = require( 'NATURAL_SELECTION/common/model/ToughFood' );
  const Wolves = require( 'NATURAL_SELECTION/common/model/Wolves' );

  class NaturalSelectionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public whether the sim is playing
      this.isPlayingProperty = new BooleanProperty( true );

      // @public whether a mate was added to the lone bunny that appears at startup
      this.mateWasAddedProperty = new BooleanProperty( false );

      // @public (read-only)
      this.generationClock = new GenerationClock();

      // @public (read-only) selection agents
      this.wolves = new Wolves();
      this.toughFood = new ToughFood();
      this.limitedFood = new LimitedFood();
      this.abioticEnvironmentProperty = new EnumerationProperty( AbioticEnvironments, AbioticEnvironments.EQUATOR );

      // @public whether any selection agent is enabled
      this.selectionAgentsEnabledProperty = new DerivedProperty(
        [ this.wolves.enabledProperty, this.toughFood.enabledProperty, this.limitedFood.enabledProperty ],
        ( wolvesEnabled, touchFooEnabled, limitedFoodEnabled ) =>
          ( wolvesEnabled || touchFooEnabled || limitedFoodEnabled )
      );
    }

    /**
     * @public
     */
    reset() {
      this.isPlayingProperty.reset();
      this.mateWasAddedProperty.reset();
      this.generationClock.reset();
      this.wolves.reset();
      this.toughFood.reset();
      this.limitedFood.reset();
      this.abioticEnvironmentProperty.reset();
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