// Copyright 2019-2021, University of Colorado Boulder

/**
 * PedigreeNode is the parent for all parts of the 'Pedigree' view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import merge from '../../../../../phet-core/js/merge.js';
import { HBox } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import GenePool from '../../model/GenePool.js';
import PedigreeModel from '../../model/PedigreeModel.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import BunnyImageMap from '../BunnyImageMap.js';
import AllelesPanel from './AllelesPanel.js';
import PedigreeGraphNode from './PedigreeGraphNode.js';

export default class PedigreeNode extends HBox {

  /**
   * @param {PedigreeModel} pedigreeModel
   * @param {SelectedBunnyProperty} selectedBunnyProperty
   * @param {GenePool} genePool
   * @param {BunnyImageMap} bunnyImageMap
   * @param {Dimension2} size - dimensions of the rectangle available for this Node and its children
   * @param {Object} [options]
   */
  constructor( pedigreeModel, selectedBunnyProperty, genePool, bunnyImageMap, size, options ) {

    assert && assert( pedigreeModel instanceof PedigreeModel, 'invalid pedigreeModel' );
    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty, 'invalid selectedBunnyProperty' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( bunnyImageMap instanceof BunnyImageMap, 'invalid bunnyImageMap' );
    assert && assert( size instanceof Dimension2, 'invalid size' );

    options = merge( {

      // HBox options
      spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      align: 'center',
      excludeInvisibleChildrenFromBounds: false,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'the Pedigree graph and its control panel',
      visiblePropertyOptions: { phetioReadOnly: true }
    }, options );

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

    assert && assert( !options.children, 'PedigreeNode sets children' );
    options.children = NaturalSelectionQueryParameters.allelesVisible ?
      [ allelesPanel, pedigreeGraphNode ] :
      [ pedigreeGraphNode ];

    super( options );

    // @private {AllelesPanel}
    this.allelesPanel = allelesPanel;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   * @param {Gene} gene
   * @param {boolean} visible
   * @public
   */
  setGeneVisible( gene, visible ) {
    this.allelesPanel.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'PedigreeNode', PedigreeNode );