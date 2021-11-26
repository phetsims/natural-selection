// Copyright 2020-2021, University of Colorado Boulder

/**
 * NaturalSelectionTimeControlNode is the time control for this sim. It has a play/pause button and a fast-forward
 * button. To make the sim run faster, press and hold the fast-forward button.  It has nothing in common with PhET's
 * standard TimeControlNode other than a PlayPauseButton, so it does not extend TimeControlNode.
 * See https://github.com/phetsims/natural-selection/issues/179 for some design history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { SceneryConstants } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import FastForwardButton from './FastForwardButton.js';

// constants
const PLAY_BUTTON_RADIUS = 20;
const FAST_FORWARD_BUTTON_RADIUS = 16;

class NaturalSelectionTimeControlNode extends HBox {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {EnumerationProperty.<TimeSpeed>} timeSpeedProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, timeSpeedProperty, options ) {

    assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );
    assert && AssertUtils.assertEnumerationPropertyOf( timeSpeedProperty, TimeSpeed );

    options = merge( {
      spacing: 10,

      disabledOpacity: SceneryConstants.DISABLED_OPACITY,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioEnabledPropertyInstrumented: true // opt into default PhET-iO instrumented enabledProperty
    }, options );

    const playPauseButton = new PlayPauseButton( isPlayingProperty, {
      radius: PLAY_BUTTON_RADIUS,
      listener: () => fastForwardButton.interruptSubtreeInput(),
      tandem: options.tandem.createTandem( 'playPauseButton' )
    } );

    const fastForwardButton = new FastForwardButton( timeSpeedProperty, {
      radius: FAST_FORWARD_BUTTON_RADIUS,
      touchAreaDilation: PLAY_BUTTON_RADIUS - FAST_FORWARD_BUTTON_RADIUS,
      tandem: options.tandem.createTandem( 'fastForwardButton' )
    } );

    assert && assert( !options.children, 'NaturalSelectionTimeControl sets children' );
    options.children = [ playPauseButton, fastForwardButton ];

    super( options );

    // Save state of whether the sim is playing, so it can be restored when fast-forward is released.
    let isPlayingSaved = isPlayingProperty.value;

    // unlink is not necessary.
    fastForwardButton.buttonModel.downProperty.link( down => {
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
        isPlayingProperty.value = isPlayingSaved;
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'NaturalSelectionTimeControlNode', NaturalSelectionTimeControlNode );
export default NaturalSelectionTimeControlNode;