// Copyright 2019-2021, University of Colorado Boulder

/**
 * ProportionsNode is the parent for all parts of the Proportions view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import merge from '../../../../../phet-core/js/merge.js';
import { HBox } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import GenePool from '../../model/GenePool.js';
import ProportionsModel from '../../model/ProportionsModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import ProportionsGraphNode from './ProportionsGraphNode.js';
import ProportionsPanel from './ProportionsPanel.js';

export default class ProportionsNode extends HBox {

  /**
   * @param {ProportionsModel} proportionsModel
   * @param {GenePool} genePool
   * @param {Dimension2} size - dimensions of the rectangle available for this Node and its children
   * @param {Object} [options]
   */
  constructor( proportionsModel, genePool, size, options ) {

    assert && assert( proportionsModel instanceof ProportionsModel, 'invalid proportionsModel' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( size instanceof Dimension2, 'invalid size' );

    options = merge( {

      // HBox options
      spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      align: 'center',
      excludeInvisibleChildrenFromBounds: false,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'the Proportions graph and its control panel',
      visiblePropertyOptions: { phetioReadOnly: true }
    }, options );

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

    assert && assert( !options.children, 'ProportionsNode sets children' );
    options.children = [ proportionsPanel, proportionsGraphNode ];

    super( options );

    // Create a Studio link to the model
    this.addLinkedElement( proportionsModel, {
      tandem: options.tandem.createTandem( 'proportionsModel' )
    } );

    // @private
    this.proportionsPanel = proportionsPanel; // {ProportionsPanel}
    this.proportionsGraphNode = proportionsGraphNode; // {ProportionsGraphNode}
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
    this.proportionsPanel.setGeneVisible( gene, visible );
    this.proportionsGraphNode.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'ProportionsNode', ProportionsNode );