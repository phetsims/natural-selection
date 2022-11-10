// Copyright 2020-2022, University of Colorado Boulder

/**
 * NaturalSelectionTimeControlNode is the time control for this sim. It has a play/pause button and a fast-forward
 * button. To make the sim run faster, press and hold the fast-forward button.  It has nothing in common with PhET's
 * standard TimeControlNode other than a PlayPauseButton, so it does not extend TimeControlNode.
 * See https://github.com/phetsims/natural-selection/issues/179 for some design history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import { HBox, HBoxOptions, NodeTranslationOptions, SceneryConstants } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import FastForwardButton from './FastForwardButton.js';

// constants
const PLAY_BUTTON_RADIUS = 20;
const FAST_FORWARD_BUTTON_RADIUS = 16;

type SelfOptions = EmptySelfOptions;

type NaturalSelectionTimeControlNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class NaturalSelectionTimeControlNode extends HBox {

  public constructor( isPlayingProperty: Property<boolean>, timeSpeedProperty: EnumerationProperty<TimeSpeed>,
                      providedOptions: NaturalSelectionTimeControlNodeOptions ) {

    const options = optionize<NaturalSelectionTimeControlNodeOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: 10,
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,
      phetioEnabledPropertyInstrumented: true // opt into default PhET-iO instrumented enabledProperty
    }, providedOptions );

    const playPauseButton = new PlayPauseButton( isPlayingProperty, {
      radius: PLAY_BUTTON_RADIUS,
      tandem: options.tandem.createTandem( 'playPauseButton' )
    } );

    const fastForwardButton = new FastForwardButton( timeSpeedProperty, {
      radius: FAST_FORWARD_BUTTON_RADIUS,
      touchAreaDilation: PLAY_BUTTON_RADIUS - FAST_FORWARD_BUTTON_RADIUS,
      tandem: options.tandem.createTandem( 'fastForwardButton' )
    } );

    options.children = [ playPauseButton, fastForwardButton ];

    super( options );

    // Save state of whether the sim is playing, so it can be restored when fast-forward is released.
    // This value does not need to be captured in the PhET-iO state because it is driven by the buttonModel.downProperty
    // which is not captured in the PhET-iO state, and hence will be overwritten on next down.
    let isPlayingSaved = isPlayingProperty.value;

    // unlink is not necessary.
    fastForwardButton.fastForwardButtonModel.downProperty.link( down => {
      playPauseButton.enabled = !down;
      if ( down ) {

        // Disable playPauseButton when fastForwardButton is pressed.
        playPauseButton.enabled = false;
        isPlayingSaved = isPlayingProperty.value;
        isPlayingProperty.value = true;
      }
      else {

        // Restore state of playPauseButton when fastForwardButton is released.
        playPauseButton.enabled = true;

        // But when playing back states, the ground truth is specified by the state and should not be overwritten by this listener
        if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
          isPlayingProperty.value = isPlayingSaved;
        }
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'NaturalSelectionTimeControlNode', NaturalSelectionTimeControlNode );