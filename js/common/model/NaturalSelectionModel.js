// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModel from './EnvironmentModel.js';
import PedigreeModel from './PedigreeModel.js';
import PopulationModel from './PopulationModel.js';
import ProportionsModel from './ProportionsModel.js';

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
    this.environmentModel = new EnvironmentModel( {
      tandem: tandem.createTandem( 'environmentModel' )
    } );

    // @public (read-only)
    this.populationModel = new PopulationModel(
      this.environmentModel.generationClock.generationsProperty,
      this.isPlayingProperty, {
        tandem: tandem.createTandem( 'populationModel' )
      }
    );

    // @public (read-only)
    this.proportionsModel = new ProportionsModel(
      this.environmentModel.generationClock.currentGenerationProperty,
      this.isPlayingProperty, {
        tandem: tandem.createTandem( 'proportionsModel' )
      } );

    // @public (read-only)
    this.pedigreeModel = new PedigreeModel( this.environmentModel.selectedBunnyProperty, {
      tandem: tandem.createTandem( 'pedigreeModel' )
    } );
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

naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
export default NaturalSelectionModel;