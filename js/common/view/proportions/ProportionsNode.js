// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsNode is the parent for all parts of the Proportions view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import merge from '../../../../../phet-core/js/merge.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import GenePool from '../../model/GenePool.js';
import ProportionsModel from '../../model/ProportionsModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import ProportionsGraphNode from './ProportionsGraphNode.js';
import ProportionsPanel from './ProportionsPanel.js';

class ProportionsNode extends HBox {

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

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'the Proportions graph and its control panel'
    }, options );

    // Divy up the width
    const panelWidth = 0.2 * size.width;
    const graphWidth = size.width - panelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

    const proportionsPanel = new ProportionsPanel( proportionsModel, genePool, {
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

    // Create a link to the model that this Node displays
    this.addLinkedElement( proportionsModel, {
      tandem: options.tandem.createTandem( 'proportionsModel' )
    } );

    // @public for configuring ScreenViews only
    this.proportionsPanel = proportionsPanel;
    this.proportionsGraphNode = proportionsGraphNode;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsNode does not support dispose' );
  }
}

naturalSelection.register( 'ProportionsNode', ProportionsNode );
export default ProportionsNode;