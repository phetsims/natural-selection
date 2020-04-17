// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModel from './EnvironmentModel.js';
import PedigreeModel from './PedigreeModel.js';
import PopulationModel from './PopulationModel.js';
import ProportionsModel from './ProportionsModel.js';
import SimulationMode from './SimulationMode.js';

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

    // @public
    this.simulationModeProperty = new EnumerationProperty( SimulationMode, SimulationMode.STAGED, {
      tandem: tandem.createTandem( 'simulationModeProperty' ),
      phetioReadOnly: true
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

    // When the simulation state changes, adjust the model.
    this.simulationModeProperty.link( simulationMode => {
      phet.log && phet.log( `simulationMode=${simulationMode}` );

      // SimulationMode indicates which mode the simulation is in. It does not describe a full state of that mode.
      // Do nothing when PhET-iO is restoring state, or saved state will be overwritten.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        if ( simulationMode === SimulationMode.STAGED ) {
          this.isPlayingProperty.value = true;
          this.environmentModel.generationClock.isRunningProperty.value = false;
        }
        else if ( simulationMode === SimulationMode.ACTIVE ) {
          this.isPlayingProperty.value = true;
          this.environmentModel.generationClock.isRunningProperty.value = true;
        }
        else if ( simulationMode === SimulationMode.COMPLETED ) {
          this.isPlayingProperty.value = false;
          this.environmentModel.generationClock.isRunningProperty.value = false;
        }
        else {
          throw new Error( `unsupported simulationMode: ${simulationMode}` );
        }
      }
    } );
  }

  /**
   * Resets the entire model.
   * @public
   */
  reset() {

    // sub-models
    this.environmentModel.reset();
    this.populationModel.reset();
    this.proportionsModel.reset();
    this.pedigreeModel.reset();

    // Properties that apply to the entire model
    this.isPlayingProperty.reset();
    this.simulationModeProperty.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'NaturalSelectionModel does not support dispose' );
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
   * Steps the model one time step. Used by the time controls Step button.
   * @param {number} dt - time step, in seconds
   * @public
   */
  stepOnce( dt ) {
    this.environmentModel.step( dt );
  }
}

naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
export default NaturalSelectionModel;