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
  const Bunny = require( 'NATURAL_SELECTION/common/model/Bunny' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GenerationClock = require( 'NATURAL_SELECTION/common/model/GenerationClock' );
  const LimitedFood = require( 'NATURAL_SELECTION/common/model/LimitedFood' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PedigreeModel = require( 'NATURAL_SELECTION/common/model/PedigreeModel' );
  const ProportionModel = require( 'NATURAL_SELECTION/common/model/ProportionModel' );
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

      // @public the abiotic (physical, rather than biological) environment
      this.abioticEnvironmentProperty = new EnumerationProperty( AbioticEnvironments, AbioticEnvironments.EQUATOR );

      // @public (read-only) the biotic (biological, rather than physical) environmental factors
      this.wolves = new Wolves();
      this.toughFood = new ToughFood();
      this.limitedFood = new LimitedFood();

      // @public whether any selection agent is enabled
      this.selectionAgentsEnabledProperty = new DerivedProperty(
        [ this.wolves.enabledProperty, this.toughFood.enabledProperty, this.limitedFood.enabledProperty ],
        ( wolvesEnabled, touchFooEnabled, limitedFoodEnabled ) =>
          ( wolvesEnabled || touchFooEnabled || limitedFoodEnabled )
      );

      // @public (read-only) {Bunny[]}
      this.bunnies = [ Bunny.createDefault() ];

      // @public (read-only)
      this.proportionModel = new ProportionModel();
      this.pedigreeModel = new PedigreeModel();
    }

    /**
     * Resets the entire model.
     * @public
     */
    reset() {

      // Properties
      this.isPlayingProperty.reset();
      this.mateWasAddedProperty.reset();
      this.generationClock.reset();
      this.abioticEnvironmentProperty.reset();

      // subcomponents
      this.wolves.reset();
      this.toughFood.reset();
      this.limitedFood.reset();
      this.proportionModel.reset();
      this.pedigreeModel.reset();

      this.playAgain();
    }

    /**
     * Starts over with a brand new bunny. Other settings are preserved.
     * @public
     */
    playAgain() {

      // dispose of all bunnies
      for ( let i = 0; i < this.bunnies.length; i++ ) {
        this.bunnies[ i ].dispose();
      }

      // create a lone bunny
      this.bunnies = [ Bunny.createDefault() ];

      // note that a mate has not been added
      this.mateWasAddedProperty.value = false;
    }

    /**
     * Steps the model.
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {
      if ( this.isPlayingProperty.value ) {
        this.stepOnce( dt );
      }
    }

    /**
     * Steps the model one time step.
     * @public
     */
    stepOnce( dt ) {

      // advance the generation clock
      if ( this.mateWasAddedProperty.value ) {
        this.generationClock.step( dt );
      }

      // step the bunnies
      for ( let i = 0; i < this.bunnies.length; i++ ) {
        this.bunnies[ i ].step( dt );
      }
    }
  }

  return naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
} );