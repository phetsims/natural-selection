// Copyright 2019-2022, University of Colorado Boulder

/**
 * MutationComingNode is a popup 'alert' that informs the user that a mutation is about to occur,
 * and gives the user an opportunity to cancel the mutation.  It is not implemented using SUN/Dialog because
 * (at the time of implementation) non-modal dialogs are not supported.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../../kite/js/imports.js';
import { HBox, Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import Gene from '../model/Gene.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import CancelMutationButton from './CancelMutationButton.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
const X_MARGIN = 8;
const Y_MARGIN = 4;
const POINTER_WIDTH = 15;

type SelfOptions = EmptySelfOptions;

type MutationComingNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class MutationComingNode extends Node {

  public readonly gene: Gene;

  public constructor( gene: Gene, providedOptions: MutationComingNodeOptions ) {

    const options = optionize<MutationComingNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    const cancelButton = new CancelMutationButton( {
      listener: () => gene.cancelMutation()
    } );

    const labelText = new Text( NaturalSelectionStrings.mutationComingStringProperty, {
      font: NaturalSelectionConstants.MUTATION_COMING_FONT,
      maxWidth: 128, // determined empirically
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const hBox = new HBox( {
      spacing: 6,
      children: [ cancelButton, labelText ]
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

    options.children = [ backgroundPath, hBox ];

    super( options );

    this.gene = gene;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'MutationComingNode', MutationComingNode );