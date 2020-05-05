// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCountsNode is a debugging node used to display the counts of live, dead, and total bunnies.
 * Since this is for debugging, i18n is not required.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import naturalSelection from '../../naturalSelection.js';

class BunnyCountsNode extends VBox {

  /**
   * @param {Property.<number>} liveBunnyCountProperty
   * @param {Property.<number>} deadBunnyCountProperty
   * @param {Object} [options]
   */
  constructor( liveBunnyCountProperty, deadBunnyCountProperty, options ) {

    options = merge( {
      spacing: 5,
      align: 'left'
    }, options );

    const textOptions = {
      font: new PhetFont( 14 )
    };

    const liveCountNode = new Text( '', textOptions );
    const deadCountNode = new Text( '', textOptions );
    const totalCountNode = new Text( '', textOptions );

    assert && assert( !options.children, 'BunnyCountsNode sets children' );
    options.children = [ liveCountNode, deadCountNode, totalCountNode ];

    super( options );

    liveBunnyCountProperty.link( count => {
      liveCountNode.text = `live = ${count}`;
      totalCountNode.text = `total = ${count + deadBunnyCountProperty.value}`;
    } );

    deadBunnyCountProperty.link( count => {
      deadCountNode.text = `dead = ${count}`;
      totalCountNode.text = `total = ${count + liveBunnyCountProperty.value}`;
    } );
  }
}

naturalSelection.register( 'LiveDeadCountsNode', BunnyCountsNode );
export default BunnyCountsNode;