// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionTimeControlNode is the time control for this sim. It has a play/pause button and a fast-forward
 * button. To make the sim run faster, press and hold the fast-forward button.  It has nothing in common with PhET's
 * standard TimeControlNode other than a PlayPauseButton, so it does not extend TimeControlNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';

class NaturalSelectionTimeControlNode extends TimeControlNode {

  constructor( isPlayingProperty, timeScaleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( timeScaleProperty, 'number' );

    options = merge( {
      timeSpeeds: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      buttonGroupXSpacing: 15,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          //TODO https://github.com/phetsims/natural-selection/issues/179 this is a hack, would need to add TimeControlNode option to omit step button
          visible: false
        }
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.timeSpeedProperty, 'NaturalSelectionTimeControlNodes sets timeSpeedProperty' );
    options.timeSpeedProperty = new EnumerationProperty( TimeSpeed, TimeSpeed.NORMAL, {
      tandem: options.tandem.createTandem( 'timeSpeedProperty' )
    } );

    options.timeSpeedProperty.link( timeSpeed => {
      phet.log && phet.log( `timeSpeed=${timeSpeed}` );
      if ( timeSpeed === TimeSpeed.NORMAL ) {
        timeScaleProperty.value = 1;
      }
      else {
        timeScaleProperty.value = NaturalSelectionQueryParameters.fastForwardScale;
      }
    } );

    //TODO https://github.com/phetsims/natural-selection/issues/179 this doesn't handle the case where timeScaleProperty
    // changes and we need to adjust options.timeSpeedProperty.  If we go with this approach, replace model.timeScaleProperty
    // with timeSpeedProperty. Or maybe do that anyway?

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

// class NaturalSelectionTimeControlNode extends HBox {
//
//   /**
//    * @param {Property.<boolean>} isPlayingProperty
//    * @param {Property.<number>} timeScaleProperty
//    * @param {Object} [options]
//    */
//   constructor( isPlayingProperty, timeScaleProperty, options ) {
//     assert && AssertUtils.assertPropertyOf( isPlayingProperty, 'boolean' );
//     assert && AssertUtils.assertPropertyOf( timeScaleProperty, 'number' );
//
//     options = merge( {
//       spacing: 10,
//
//       // phet-io
//       tandem: Tandem.REQUIRED
//     }, options );
//
//     const playPauseButton = new PlayPauseButton( isPlayingProperty, {
//       radius: 20,
//       listener: () => fastForwardButton.interruptSubtreeInput(),
//       tandem: options.tandem.createTandem( 'playPauseButton' )
//     } );
//
//     const fastForwardButton = new FastForwardButton( timeScaleProperty,
//       NaturalSelectionQueryParameters.fastForwardScale, {
//       tandem: options.tandem.createTandem( 'fastForwardButton' )
//     } );
//
//     assert && assert( !options.children, 'NaturalSelectionTimeControl sets children' );
//     options.children = [ playPauseButton, fastForwardButton ];
//
//     super( options );
//     this.initializeEnabledNode( options );
//
//     let isPlayingSaved = isPlayingProperty.value;
//     fastForwardButton.buttonModel.downProperty.link( down => {
//       playPauseButton.enabled = !down;
//       if ( down ) {
//
//         // Disable playPauseButton when fastForwardButton is pressed.
//         playPauseButton.enabled = false;
//         isPlayingSaved = isPlayingProperty.value;
//         isPlayingProperty.value = true;
//       }
//       else {
//
//         // Restore state of playPauseButton when fastForwardButton is released.
//         playPauseButton.enabled = true;
//         isPlayingProperty.value = isPlayingSaved;
//       }
//     } );
//   }
//
//   /**
//    * @public
//    * @override
//    */
//   dispose() {
//     assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
//     super.dispose();
//   }
// }
//
// // mix in enabled component into a Node
// EnabledNode.mixInto( NaturalSelectionTimeControlNode );

naturalSelection.register( 'NaturalSelectionTimeControlNode', NaturalSelectionTimeControlNode );
export default NaturalSelectionTimeControlNode;