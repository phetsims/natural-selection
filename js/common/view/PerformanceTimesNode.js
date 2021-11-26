// Copyright 2020, University of Colorado Boulder

/**
 * PerformanceTimesNode displays times related to performance critical parts of the simulation.
 * This is added via the ?showTimes query parameter.
 * See https://github.com/phetsims/natural-selection/issues/60 and https://github.com/phetsims/natural-selection/issues/140
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class PerformanceTimesNode extends VBox {

  /**
   * @param {Property.<number>} timeToMateProperty
   * @param {Property.<number>} timeToStartOverProperty
   * @param {Object} [options]
   */
  constructor( timeToMateProperty, timeToStartOverProperty, options ) {

    options = merge( {
      align: 'left',
      spacing: 5
    }, options );

    // Time that it last took to mate.
    // See See https://github.com/phetsims/natural-selection/issues/60
    const timeToMateNode = new Text( '', {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT
    } );

    // unlink is not necessary.
    timeToMateProperty.link( timeToMate => {
      const t = Utils.roundSymmetric( timeToMate );
      timeToMateNode.text = `time to mate = ${t} ms`;
      console.log( timeToMateNode.text );
    } );

    // Time that it last took to perform the 'Start Over' button callback.
    // See https://github.com/phetsims/natural-selection/issues/140
    const timeToStartOverNode = new Text( '', {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT
    } );

    // unlink is not necessary.
    timeToStartOverProperty.link( timeToStartOver => {
      const t = Utils.roundSymmetric( timeToStartOver );
      timeToStartOverNode.text = `time to Start Over = ${t} ms`;
      console.log( timeToStartOverNode.text );
    } );

    assert && assert( !options.children, 'PerformanceTimesNode sets children' );
    options.children = [ timeToMateNode, timeToStartOverNode ];

    super( options );
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

naturalSelection.register( 'PerformanceTimesNode', PerformanceTimesNode );
export default PerformanceTimesNode;