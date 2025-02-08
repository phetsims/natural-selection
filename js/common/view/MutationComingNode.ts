// Copyright 2019-2025, University of Colorado Boulder

/**
 * MutationComingNode is a popup 'alert' that informs the user that a mutation is about to occur,
 * and gives the user an opportunity to cancel the mutation.  It is not implemented using SUN/Dialog because
 * (at the time of implementation) non-modal dialogs are not supported.
 *
 * @deprecated - PhET needs a non-modal dialog, see https://github.com/phetsims/sun/issues/916
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import Gene from '../model/Gene.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import CancelMutationButton from './CancelMutationButton.js';

const X_MARGIN = 8;
const Y_MARGIN = 4;
const POINTER_WIDTH = 15;

type SelfOptions = EmptySelfOptions;

type MutationComingNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class MutationComingNode extends Node {

  public readonly gene: Gene;

  public constructor( gene: Gene, providedOptions: MutationComingNodeOptions ) {

    const options = optionize<MutationComingNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      visiblePropertyOptions: { phetioReadOnly: true },
      isDisposable: false
    }, providedOptions );

    const cancelButton = new CancelMutationButton( {
      listener: () => gene.cancelMutation()
    } );

    const labelText = new Text( NaturalSelectionStrings.mutationComingStringProperty, {
      font: NaturalSelectionConstants.MUTATION_COMING_FONT,
      maxWidth: 128 // determined empirically
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
}

naturalSelection.register( 'MutationComingNode', MutationComingNode );