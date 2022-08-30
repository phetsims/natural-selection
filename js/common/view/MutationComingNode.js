// Copyright 2019-2022, University of Colorado Boulder

/**
 * MutationComingNode is a popup 'alert' that informs the user that a mutation is about to occur,
 * and gives the user an opportunity to cancel the mutation.  It is not implemented using SUN/Dialog because
 * (at the time of implementation) non-modal dialogs are not supported.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Shape } from '../../../../kite/js/imports.js';
import { HBox, Node, Path, Text } from '../../../../scenery/js/imports.js';
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

    options = merge( {
      tandem: Tandem.REQUIRED,
      visiblePropertyOptions: { phetioReadOnly: true }
    }, options );

    const cancelButton = new CancelMutationButton( {
      listener: () => gene.cancelMutation()
    } );

    const textNode = new Text( naturalSelectionStrings.mutationComingStringProperty, {
      font: NaturalSelectionConstants.MUTATION_COMING_FONT,
      maxWidth: 128, // determined empirically
      tandem: options.tandem.createTandem( 'textNode' ),
      phetioVisiblePropertyInstrumented: false
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