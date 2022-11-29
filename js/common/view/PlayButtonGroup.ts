// Copyright 2020-2022, University of Colorado Boulder

/**
 * PlayButtonGroup contains the buttons that can be used to make the simulation begin playing. These buttons are
 * mutually exclusive - at most 1 is visible, depending on the state of the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Node, NodeOptions, Text, TextOptions } from '../../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import SimulationMode from '../model/SimulationMode.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

type SelfOptions = {

  // callbacks for the buttons
  addAMate?: () => void;
  play?: () => void;
  startOver?: () => void;
};

type PlayButtonGroupOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class PlayButtonGroup extends Node {

  public constructor( simulationModeProperty: EnumerationProperty<SimulationMode>,
                      bunnyCountProperty: Property<number>, providedOptions: PlayButtonGroupOptions ) {

    const options = optionize<PlayButtonGroupOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      addAMate: _.noop,
      play: _.noop,
      startOver: _.noop
    }, providedOptions );

    // 'Add a Mate' push button, for when the initial population consists of a single bunny.
    const addAMateButton = new TextPushButton( NaturalSelectionStrings.addAMateStringProperty, {
      listener: () => {
        options.addAMate();
        simulationModeProperty.value = SimulationMode.ACTIVE;
      },
      tandem: options.tandem.createTandem( 'addAMateButton' )
    } );

    // 'Play' push button, for when the initial population consists of more than one bunny.
    const playButton = new TextPushButton( NaturalSelectionStrings.playStringProperty, {
      listener: () => {
        options.play();
        simulationModeProperty.value = SimulationMode.ACTIVE;
      },
      tandem: options.tandem.createTandem( 'playButton' )
    } );

    // 'Start Over' push button, displayed after the game ends (bunnie take over the world, or all bunnies die),
    // while the user is reviewing the final state.
    const startOverButton = new TextPushButton( NaturalSelectionStrings.startOverStringProperty, {
      listener: () => {
        options.startOver();
        simulationModeProperty.value = SimulationMode.STAGED;
      },
      tandem: options.tandem.createTandem( 'startOverButton' )
    } );

    options.children = [ addAMateButton, playButton, startOverButton ];

    super( options );

    // Make all buttons have the same center
    Multilink.multilink( [ addAMateButton.boundsProperty, playButton.boundsProperty, startOverButton.boundsProperty ],
      () => {
        playButton.center = addAMateButton.center;
        startOverButton.center = addAMateButton.center;
      } );

    // Make at most 1 button visible. unlink is not necessary.
    simulationModeProperty.link( simulationMode => {

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

  public override dispose(): void {
    assert && assert( false, 'PlayButtonGroup does not support dispose' );
    super.dispose();
  }
}

type TextPushButtonSelfOptions = {
  textOptions?: StrictOmit<TextOptions, 'tandem'>;
};

type TextPushButtonOptions = TextPushButtonSelfOptions &
  PickRequired<RectangularPushButtonOptions, 'listener' | 'tandem'>;

class TextPushButton extends RectangularPushButton {

  public constructor( stringProperty: TReadOnlyProperty<string>, providedOptions: TextPushButtonOptions ) {

    const options = optionize<TextPushButtonOptions, TextPushButtonSelfOptions, RectangularPushButtonOptions>()( {

      // SelfOptions
      textOptions: {
        font: NaturalSelectionConstants.PUSH_BUTTON_FONT,
        maxWidth: 150 // determined empirically
      },

      // RectangularPushButtonOptions
      baseColor: NaturalSelectionColors.PLAY_BUTTON,
      cornerRadius: 5,
      xMargin: 12,
      yMargin: 8,
      phetioReadOnly: true // because sim state controls when this button is visible
    }, providedOptions );

    options.content = new Text( stringProperty, combineOptions<TextOptions>( {}, options.textOptions, {
      tandem: options.tandem.createTandem( 'labelText' )
    } ) );

    super( options );
  }
}

naturalSelection.register( 'PlayButtonGroup', PlayButtonGroup );