// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionTimeControl is the time control for this sim. It has a play/pause button and a fast-forward button.
 * To make the sim run faster, press and hold the fast-forward button.  It has nothing in common with PhET's standard
 * TimeControlNode other than a PlayPauseButton, so TimeControlNode is not used.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import EnabledNode from '../../../../sun/js/EnabledNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import FastForwardButton from './FastForwardButton.js';

class NaturalSelectionTimeControl extends HBox {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Property.<boolean>} fastForwardScaleProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, fastForwardScaleProperty, options ) {
    assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( fastForwardScaleProperty, 'number' );

    options = merge( {
      spacing: 10,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const playPauseButton = new PlayPauseButton( isPlayingProperty, {
      radius: 20,
      listener: () => fastForwardButton.interruptSubtreeInput(),
      tandem: options.tandem.createTandem( 'playPauseButton' )
    } );

    const fastForwardButton = new FastForwardButton( fastForwardScaleProperty,
      NaturalSelectionQueryParameters.fastForwardScale, {
      tandem: options.tandem.createTandem( 'fastForwardButton' )
    } );

    assert && assert( !options.children, 'NaturalSelectionTimeControl sets children' );
    options.children = [ playPauseButton, fastForwardButton ];

    super( options );
    this.initializeEnabledNode( options );

    let isPlayingSaved = isPlayingProperty.value;
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

// mix in enabled component into a Node
EnabledNode.mixInto( NaturalSelectionTimeControl );

naturalSelection.register( 'NaturalSelectionTimeControl', NaturalSelectionTimeControl );
export default NaturalSelectionTimeControl;