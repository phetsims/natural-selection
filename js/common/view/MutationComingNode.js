// Copyright 2019, University of Colorado Boulder

/**
 * MutationComingNode is a pseudo non-modal dialog. It informs the user that a mutation is about to be occur,
 * and gives the user an opportunity to cancel the mutation.  It is not implemented using SUN/Dialog because
 * (at the time of implementation) non-modal dialogs are not yet supported.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import CancelMutationButton from './CancelMutationButton.js';

const mutationComingString = naturalSelectionStrings.mutationComing;

// constants
const X_MARGIN = 8;
const Y_MARGIN = 4;
const POINTER_WIDTH = 15;

class MutationComingNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      cancelButtonListener: () => {}
    }, options );

    const cancelButton = new CancelMutationButton( {
      listener: options.cancelButtonListener
    } );

    const textNode = new Text( mutationComingString, {
      font: NaturalSelectionConstants.MUTATION_COMING_FONT,
      maxWidth: 200 // determined empirically
    } );

    const hBox = new HBox( {
      spacing: 6,
      children: [ cancelButton, textNode ]
    } );

    const backgroundWidth = hBox.width + 2 * X_MARGIN;
    const backgroundHeight = hBox.height + 2 * Y_MARGIN;
    const backgroundShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( backgroundWidth, 0 )
      .lineTo( backgroundWidth + POINTER_WIDTH, backgroundHeight / 2 )
      .lineTo( backgroundWidth, backgroundHeight )
      .lineTo( 0, backgroundHeight )
      .close();
    const backgroundPath = new Path( backgroundShape, {
      stroke: 'black',
      fill: 'rgba( 255, 255, 255, 0.75 )'
    } );

    // Center content in the background
    hBox.left = backgroundPath.left + X_MARGIN;
    hBox.centerY = backgroundPath.centerY;

    assert && assert( !options.children, 'MutationComingNode sets children' );
    options.children = [ backgroundPath, hBox ];

    super( options );
  }

  //TODO should this be disposed and created on demand? It's not phet-io instrumented.
  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'MutationComingNode does not support dispose' );
  }
}

naturalSelection.register( 'MutationComingNode', MutationComingNode );
export default MutationComingNode;