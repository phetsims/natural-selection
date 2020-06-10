// Copyright 2019-2020, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual. Origin at bottom center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import PedigreeModel from '../../model/PedigreeModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import PedigreeBranchNode from './PedigreeBranchNode.js';

// constants
const TREE_DEPTH = 4;
const X_MARGIN = 5;
const Y_MARGIN = 5;

class PedigreeGraphNode extends Node {

  /**
   * @param {PedigreeModel} pedigreeModel
   * @param {Object} [options]
   */
  constructor( pedigreeModel, options ) {

    assert && assert( pedigreeModel instanceof PedigreeModel, 'invalid pedigreeModel' );

    options = merge( {
      graphWidth: 100,
      graphHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    }, options );

    const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      fill: NaturalSelectionColors.PEDIGREE_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    const selectABunnyText = new Text( naturalSelectionStrings.selectABunny, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT,
      centerX: backgroundNode.centerX,
      centerY: backgroundNode.top + ( backgroundNode.height / 6 ),
      maxWidth: 0.5 * backgroundNode.width
    } );

    assert && assert( !options.children, 'PedigreeGraphNode sets children' );
    options.children = [ backgroundNode, selectABunnyText ];

    super( options );

    // {PedigreeBranchNode|null} The branch of the Pedigree tree that is currently displayed.
    let branchNode = null;

    // When a bunny is selected, display its pedigree. unlink is not necessary.
    pedigreeModel.selectedBunnyProperty.link( bunny => {
      selectABunnyText.visible = !bunny;

      if ( branchNode ) {
        branchNode.dispose();
        branchNode = null;
      }

      if ( bunny ) {

        // Create the graph
        branchNode = new PedigreeBranchNode( bunny, TREE_DEPTH,
          pedigreeModel.selectedBunnyProperty,
          pedigreeModel.furAllelesVisibleProperty,
          pedigreeModel.earsAllelesVisibleProperty,
          pedigreeModel.teethAllelesVisibleProperty, {
            x: backgroundNode.centerX,
            bottom: backgroundNode.bottom - Y_MARGIN
          } );
        this.addChild( branchNode );

        // Ensure that the graph fits inside the background
        const scale = _.min(
          ( backgroundNode.width - 2 * X_MARGIN ) / branchNode.width,
          ( backgroundNode.height - 2 * Y_MARGIN ) / branchNode.height
        );
        if ( scale < 1 ) {
          branchNode.setScaleMagnitude( scale );
        }
      }
    } );

    // Create a link to selectedBunnyProperty
    this.addLinkedElement( pedigreeModel.selectedBunnyProperty, {
      tandem: options.tandem.createTandem( 'selectedBunnyProperty' )
    } );
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

naturalSelection.register( 'PedigreeGraphNode', PedigreeGraphNode );
export default PedigreeGraphNode;