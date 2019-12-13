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
  const Bunny = require( 'NATURAL_SELECTION/common/model/Bunny' );
  const EnvironmentModel = require( 'NATURAL_SELECTION/common/model/EnvironmentModel' );
  const GenerationClock = require( 'NATURAL_SELECTION/common/model/GenerationClock' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PedigreeModel = require( 'NATURAL_SELECTION/common/model/PedigreeModel' );
  const PopulationModel = require( 'NATURAL_SELECTION/common/model/PopulationModel' );
  const ProportionsModel = require( 'NATURAL_SELECTION/common/model/ProportionsModel' );

  class NaturalSelectionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public whether the sim is playing
      this.isPlayingProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'isPlayingProperty' )
      } );

      //TODO this should be an Emitter
      // @public whether a mate was added to the lone bunny that appears at startup
      this.mateWasAddedProperty = new BooleanProperty( false );

      // @public (read-only)
      this.generationClock = new GenerationClock( tandem.createTandem( 'generationClock' ) );

      // @public (read-only)
      this.environmentModel = new EnvironmentModel( tandem.createTandem( 'environmentModel' ) );

      // @public (read-only)
      this.populationModel = new PopulationModel( this.generationClock.currentGenerationProperty,
        tandem.createTandem( 'populationModel' ) );
      this.proportionsModel = new ProportionsModel( this.generationClock.currentGenerationProperty,
        tandem.createTandem( 'proportionsModel' ) );
      this.pedigreeModel = new PedigreeModel( tandem.createTandem( 'pedigreeModel' ) );

      // @public (read-only) {Bunny[]}
      this.bunnies = [ Bunny.createDefault() ];
    }

    /**
     * Resets the entire model.
     * @public
     */
    reset() {

      // Properties
      this.isPlayingProperty.reset();
      this.mateWasAddedProperty.reset();

      // Clock
      this.generationClock.reset();

      // sub-models
      this.environmentModel.reset();
      this.populationModel.reset();
      this.proportionsModel.reset();
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