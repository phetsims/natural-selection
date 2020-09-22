// Copyright 2020, University of Colorado Boulder

/**
 * PlayButtonGroup contains the buttons that can be used to make the simulation begin playing. These buttons are
 * mutually exclusive - at most 1 is visible, depending on the state of the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import stepTimer from '../../../../axon/js/stepTimer.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import SimulationMode from '../model/SimulationMode.js';
import AddAMateButton from './AddAMateButton.js';
import PlayButton from './PlayButton.js';
import StartOverButton from './StartOverButton.js';

class PlayButtonGroup extends Node {

  /**
   * @param {EnumerationProperty.<SimulationMode>} simulationModeProperty
   * @param {Property.<number>} bunnyCountProperty
   * @param {Object} [options]
   */
  constructor( simulationModeProperty, bunnyCountProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( simulationModeProperty, SimulationMode );
    assert && AssertUtils.assertPropertyOf( bunnyCountProperty, 'number' );

    options = merge( {

      // {function} callbacks for the buttons, no parameters, no return values
      addAMate: () => {},
      play: () => {},
      startOver: () => {},

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // 'Add a Mate' push button, for when the initial population consists of a single bunny
    const addAMateButton = new AddAMateButton( {
      listener: () => {
        options.addAMate();
        simulationModeProperty.value = SimulationMode.ACTIVE;
      },
      tandem: options.tandem.createTandem( 'addAMateButton' )
    } );

    // 'Play' push button, for when the initial population consists of more than one bunny
    const playButton = new PlayButton( {
      listener: () => {
        options.play();
        simulationModeProperty.value = SimulationMode.ACTIVE;
      },
      center: addAMateButton.center,
      tandem: options.tandem.createTandem( 'playButton' )
    } );

    // 'Start Over' push button, displayed after the game ends, while the user is reviewing the final state
    const startOverButton = new StartOverButton( {
      listener: () => {
        options.startOver();
        simulationModeProperty.value = SimulationMode.STAGED;
      },
      center: addAMateButton.center,
      tandem: options.tandem.createTandem( 'startOverButton' )
    } );

    assert && assert( !options.children, 'PushButtonGroup sets children' );
    options.children = [ addAMateButton, playButton, startOverButton ];

    super( options );

    // Make at most 1 button visible. unlink is not necessary.
    simulationModeProperty.link( simulationMode => {

      console.log( `simulationMode=${simulationMode} bunnyCount=${bunnyCountProperty.value}` );

      // start with all buttons hidden
      addAMateButton.visible = false;
      playButton.visible = false;
      startOverButton.visible = false;

      if ( simulationMode === SimulationMode.STAGED ) {

        // Show 'Add a Mate' or 'Play' button, depending on the size of the population.
        // Make one of these buttons visible on the next frame, so that a double-click on the 'Start Over' button
          // doesn't fire the button that is made visible. See https://github.com/phetsims/natural-selection/issues/166
          const bunnyCount = bunnyCountProperty.value;
          stepTimer.runOnNextTick( () => {

            // Checking simulationModeProperty to make sure it hasn't changed again before this callback fires.
            // See https://github.com/phetsims/natural-selection/issues/235
            if ( simulationModeProperty.value === SimulationMode.STAGED ) {
              addAMateButton.visible = ( bunnyCount === 1 );
              playButton.visible = ( bunnyCount > 1 );
            }
          } );
        }
        else if ( simulationMode === SimulationMode.ACTIVE ) {
          // do nothing, all buttons remain hidden
        }
        else if ( simulationMode === SimulationMode.COMPLETED ) {

          // Show 'Start Over' button.
          startOverButton.visible = true;
        }
        else {
          throw new Error( `unsupported simulationMode: ${simulationMode}` );
        }
      }
    );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'PlayButtonGroup does not support dispose' );
    super.dispose();
  }
}

naturalSelection.register( 'PlayButtonGroup', PlayButtonGroup );
export default PlayButtonGroup;