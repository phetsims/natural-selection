// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionTimeControl is the time control for this sim. It has a play/pause button and a fast-forward button.
 * To make the sim run faster, press and hold the fast-forward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RoundMomentaryButton from '../../../../sun/js/buttons/RoundMomentaryButton.js';
import EnabledNode from '../../../../sun/js/EnabledNode.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 20;
const FAST_FORWARD_BUTTON_RADIUS = 16;

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
      spacing: 10
    }, options );

    const playPauseButton = new PlayPauseButton( isPlayingProperty, {
      radius: PLAY_PAUSE_BUTTON_RADIUS,
      listener: () => fastForwardButton.interruptSubtreeInput()
    } );

    const fastForwardButton = new RoundMomentaryButton( 1, NaturalSelectionQueryParameters.fastForwardScale,
      fastForwardScaleProperty, {
      radius: FAST_FORWARD_BUTTON_RADIUS,
      content: new Path( createFastForwardShape( FAST_FORWARD_BUTTON_RADIUS ), {
        fill: 'black'
      } )
    } );

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

    assert && assert( !options.children, 'NaturalSelectionTimeControl sets children' );
    options.children = [ playPauseButton, fastForwardButton ];

    super( options );
    this.initializeEnabledNode( options );
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

/**
 * Creates the Shape for the fast-forward icon. Drawn clockwise from the top-left corner.
 * @param {number} radius
 * @returns {Shape}
 */
function createFastForwardShape( radius ) {
  return new Shape()
    .moveTo( 0, 0 )
    .lineTo( radius / 2, radius / 2 )
    .lineTo( radius / 2, 0 )
    .lineTo( radius, radius / 2 )
    .lineTo( radius / 2, radius )
    .lineTo( radius / 2, radius / 2 )
    .lineTo( 0, radius )
    .close();
}

naturalSelection.register( 'NaturalSelectionTimeControl', NaturalSelectionTimeControl );
export default NaturalSelectionTimeControl;