// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionTimeControl is the time control for this sim. It has a play/pause button and a fast-forward button.
 * To make the sim run faster, press and hold the fast-forward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RoundMomentaryButton from '../../../../sun/js/buttons/RoundMomentaryButton.js';
import EnabledNode from '../../../../sun/js/EnabledNode.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 20;
const FAST_FORWARD_BUTTON_RADIUS = 16;
const FAST_FORWARD_SCALE = 2;

class NaturalSelectionTimeControl extends HBox {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, options ) {

    options = merge( {
      spacing: 10
    }, options );

    const playPauseButton = new PlayPauseButton( isPlayingProperty, {
      radius: PLAY_PAUSE_BUTTON_RADIUS
    } );

    //TODO move to sim model
    const timeSpeedProperty = new NumberProperty( NaturalSelectionConstants.SECONDS_PER_GENERATION );

    const fastForwardButton = new RoundMomentaryButton(
      NaturalSelectionConstants.SECONDS_PER_GENERATION,
      FAST_FORWARD_SCALE * NaturalSelectionConstants.SECONDS_PER_GENERATION,
      timeSpeedProperty, {
      radius: FAST_FORWARD_BUTTON_RADIUS,
      content: new Path( createFastForwardShape( FAST_FORWARD_BUTTON_RADIUS ), {
        fill: 'black'
      } )
    } );

    assert && assert( !options.children, 'NaturalSelectionTimeControl sets children' );
    options.children = [ playPauseButton, fastForwardButton ];

    super( options );
    this.initializeEnabledNode( options );

    // Fast-forward is enabled while playing
    isPlayingProperty.link( isPlaying => {
      fastForwardButton.enabled = isPlaying;
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