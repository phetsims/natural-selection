// Copyright 2019-2022, University of Colorado Boulder

/**
 * PopulationNode is the parent for all parts of the 'Population' view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeOptions, NodeTranslationOptions } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Gene from '../../model/Gene.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import PopulationGraphNode from './PopulationGraphNode.js';
import PopulationPanel from './PopulationPanel.js';

type SelfOptions = EmptySelfOptions;

type PopulationNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class PopulationNode extends Node {

  private readonly populationPanel: PopulationPanel;

  /**
   * @param populationModel
   * @param size - dimensions of the rectangle available for this Node and its children
   * @param [providedOptions]
   */
  public constructor( populationModel: PopulationModel, size: Dimension2, providedOptions: PopulationNodeOptions ) {

    const options = optionize<PopulationNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      phetioDocumentation: 'the Population graph and its control panel',
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    // Divvy up the width
    const panelWidth = 175; // determined empirically
    const graphWidth = size.width - panelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

    const populationPanel = new PopulationPanel( populationModel, {
      fixedWidth: panelWidth,
      maxHeight: size.height,
      tandem: options.tandem.createTandem( 'populationPanel' )
    } );

    const populationGraphNode = new PopulationGraphNode( populationModel, {
      graphWidth: graphWidth,
      graphHeight: size.height,
      y: populationPanel.top,
      left: populationPanel.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      tandem: options.tandem.createTandem( 'populationGraphNode' )
    } );

    options.children = [ populationPanel, populationGraphNode ];

    super( options );

    // Create a Studio link to the model
    this.addLinkedElement( populationModel, {
      tandem: options.tandem.createTandem( 'populationModel' )
    } );

    this.populationPanel = populationPanel;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {
    this.populationPanel.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'PopulationNode', PopulationNode );