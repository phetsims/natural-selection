// Copyright 2019-2022, University of Colorado Boulder

/**
 * PedigreeNode is the parent for all parts of the 'Pedigree' view.
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
import PedigreeModel from '../../model/PedigreeModel.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import BunnyImageMap from '../BunnyImageMap.js';
import AllelesPanel from './AllelesPanel.js';
import PedigreeGraphNode from './PedigreeGraphNode.js';

type SelfOptions = EmptySelfOptions;

type PedigreeNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class PedigreeNode extends HBox {

  private readonly allelesPanel: AllelesPanel;
  
  public constructor( pedigreeModel: PedigreeModel,
                      selectedBunnyProperty: SelectedBunnyProperty,
                      genePool: GenePool,
                      bunnyImageMap: BunnyImageMap,
                      size: Dimension2,
                      providedOptions: PedigreeNodeOptions ) {

    const options = optionize<PedigreeNodeOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      align: 'center',
      excludeInvisibleChildrenFromBounds: false,
      phetioDocumentation: 'the Pedigree graph and its control panel',
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    // Divy up the width
    // If ?allelesVisible=false, the control panel is omitted, and the graph fills the width.
    const controlPanelWidth = 0.2 * size.width;
    const graphWidth = NaturalSelectionQueryParameters.allelesVisible ?
                       size.width - controlPanelWidth - options.spacing :
                       size.width;

    // Because it's instrumented for PhET-iO, the AllelesPanel must be instantiated regardless of the value
    // of ?allelesVisible. If ?allelesVisible=false, it will not be added to the scenegraph, but will
    // still appear in the Studio element tree.
    const allelesPanel = new AllelesPanel( genePool, pedigreeModel.furAllelesVisibleProperty,
      pedigreeModel.earsAllelesVisibleProperty, pedigreeModel.teethAllelesVisibleProperty, {
        fixedWidth: controlPanelWidth,
        maxHeight: size.height,
        tandem: options.tandem.createTandem( 'allelesPanel' ),
        phetioDocumentation: 'Note that if query parameter allelesVisible=false is specified, this panel will be ' +
                             'created but will not be added to the UI. It will appear in the API and Studio tree, ' +
                             'but changes to its elements and metadata will have no affect.'
      } );

    const pedigreeGraphNode = new PedigreeGraphNode( selectedBunnyProperty, bunnyImageMap,
      pedigreeModel.furAllelesVisibleProperty,
      pedigreeModel.earsAllelesVisibleProperty,
      pedigreeModel.teethAllelesVisibleProperty, {
        graphWidth: graphWidth,
        graphHeight: size.height,
        tandem: options.tandem.createTandem( 'pedigreeGraphNode' )
      } );

    options.children = NaturalSelectionQueryParameters.allelesVisible ?
      [ allelesPanel, pedigreeGraphNode ] :
      [ pedigreeGraphNode ];

    super( options );

    this.allelesPanel = allelesPanel;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {
    this.allelesPanel.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'PedigreeNode', PedigreeNode );