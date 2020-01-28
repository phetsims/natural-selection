// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnvironmentModel = require( 'NATURAL_SELECTION/common/model/EnvironmentModel' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PedigreeModel = require( 'NATURAL_SELECTION/common/model/PedigreeModel' );
  const PopulationModel = require( 'NATURAL_SELECTION/common/model/PopulationModel' );
  const ProportionsModel = require( 'NATURAL_SELECTION/common/model/ProportionsModel' );
  const Tandem = require( 'TANDEM/Tandem' );

  class NaturalSelectionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      // @public whether the sim is playing
      this.isPlayingProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'isPlayingProperty' )
      } );

      // @public (read-only)
      this.environmentModel = new EnvironmentModel( tandem.createTandem( 'environmentModel' ) );

      // @public (read-only)
      this.populationModel = new PopulationModel(
        this.environmentModel.generationClock.generationsProperty,
        this.isPlayingProperty,
        tandem.createTandem( 'populationModel' )
      );

      // @public (read-only)
      this.proportionsModel = new ProportionsModel(
        this.environmentModel.generationClock.currentGenerationProperty,
        this.isPlayingProperty,
        tandem.createTandem( 'proportionsModel' )
      );

      // @public (read-only)
      this.pedigreeModel = new PedigreeModel( tandem.createTandem( 'pedigreeModel' ) );
    }

    /**
     * Resets the entire model.
     * @public
     */
    reset() {

      // Properties
      this.isPlayingProperty.reset();

      // sub-models
      this.environmentModel.reset();
      this.populationModel.reset();
      this.proportionsModel.reset();
      this.pedigreeModel.reset();
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'NaturalSelectionModel does not support dispose' );
    }

    /**
     * Resets the initial bunny population. Other settings are preserved.
     * @public
     */
    playAgain() {
      this.environmentModel.playAgain();
      //TODO other things?
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
      this.environmentModel.step( dt );
    }
  }

  return naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
} );