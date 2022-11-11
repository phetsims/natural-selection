// Copyright 2019-2022, University of Colorado Boulder

/**
 * ProportionsNode is the parent for all parts of the Proportions view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { HBox, HBoxOptions, NodeTranslationOptions } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Gene from '../../model/Gene.js';
import GenePool from '../../model/GenePool.js';
import ProportionsModel from '../../model/ProportionsModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import ProportionsGraphNode from './ProportionsGraphNode.js';
import ProportionsPanel from './ProportionsPanel.js';

type SelfOptions = EmptySelfOptions;

type ProportionsNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class ProportionsNode extends HBox {

  private readonly proportionsPanel: ProportionsPanel;
  private readonly proportionsGraphNode: ProportionsGraphNode;

  public constructor( proportionsModel: ProportionsModel, genePool: GenePool, size: Dimension2, providedOptions: ProportionsNodeOptions ) {

    const options = optionize<ProportionsNodeOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      align: 'center',
      excludeInvisibleChildrenFromBounds: false,
      phetioDocumentation: 'the Proportions graph and its control panel',
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    // Divy up the width
    const panelWidth = 0.2 * size.width;
    const graphWidth = size.width - panelWidth - options.spacing;

    const proportionsPanel = new ProportionsPanel( genePool, proportionsModel.valuesVisibleProperty, {
      fixedWidth: panelWidth,
      maxHeight: size.height,
      tandem: options.tandem.createTandem( 'proportionsPanel' )
    } );

    const proportionsGraphNode = new ProportionsGraphNode( proportionsModel, genePool, {
      graphWidth: graphWidth,
      graphHeight: size.height,
      tandem: options.tandem.createTandem( 'proportionsGraphNode' )
    } );

    options.children = [ proportionsPanel, proportionsGraphNode ];

    super( options );

    // Create a Studio link to the model
    this.addLinkedElement( proportionsModel, {
      tandem: options.tandem.createTandem( 'proportionsModel' )
    } );

    this.proportionsPanel = proportionsPanel;
    this.proportionsGraphNode = proportionsGraphNode;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {
    this.proportionsPanel.setGeneVisible( gene, visible );
    this.proportionsGraphNode.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'ProportionsNode', ProportionsNode );