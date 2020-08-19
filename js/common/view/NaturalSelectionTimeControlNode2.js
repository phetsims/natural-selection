// Copyright 2020, University of Colorado Boulder

//TODO https://github.com/phetsims/natural-selection/issues/179 delete this or NaturalSelectionTimeControlNode
/**
 * NaturalSelectionTimeControlNode is the time control for this sim. It has a play/pause button and a fast-forward
 * button. To make the sim run faster, press and hold the fast-forward button.  It has nothing in common with PhET's
 * standard TimeControlNode other than a PlayPauseButton, so it does not extend TimeControlNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

class NaturalSelectionTimeControlNode2 extends TimeControlNode {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {EnumerationProperty.<TimeSpeed>} timeSpeedProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, timeSpeedProperty, options ) {

    assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );
    assert && AssertUtils.assertEnumerationPropertyOf( timeSpeedProperty, TimeSpeed );

    options = merge( {
      timeSpeeds: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      buttonGroupXSpacing: 15,

      // exclude the step-forward button
      playPauseStepButtonOptions: {
        includeStepForwardButton: false
      },

      // set maxWidth for radio button labels
      speedRadioButtonGroupOptions: {
        labelOptions: {
          maxWidth: 50
        }
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.timeSpeedProperty, 'NaturalSelectionTimeControlNode2 sets timeSpeedProperty' );
    options.timeSpeedProperty = timeSpeedProperty;

    super( isPlayingProperty, options );
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

naturalSelection.register( 'NaturalSelectionTimeControlNode2', NaturalSelectionTimeControlNode2 );
export default NaturalSelectionTimeControlNode2;