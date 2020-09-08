// Copyright 2019-2020, University of Colorado Boulder

/**
 * MutationComingNode is a popup 'alert' that informs the user that a mutation is about to occur,
 * and gives the user an opportunity to cancel the mutation.  It is not implemented using SUN/Dialog because
 * (at the time of implementation) non-modal dialogs are not supported.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import Gene from '../model/Gene.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import CancelMutationButton from './CancelMutationButton.js';

// constants
const X_MARGIN = 8;
const Y_MARGIN = 4;
const POINTER_WIDTH = 15;

class MutationComingNode extends Node {

  /**
   * @param {Gene} gene
   * @param {Object} [options]
   */
  constructor( gene, options ) {
    assert && assert( gene instanceof Gene, 'invalid gene' );

    options = options || {};

    const cancelButton = new CancelMutationButton( {
      listener: () => gene.cancelMutation()
    } );

    const textNode = new Text( naturalSelectionStrings.mutationComing, {
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

    // @public (read-only)
    this.gene = gene;
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

naturalSelection.register( 'MutationComingNode', MutationComingNode );
export default MutationComingNode;