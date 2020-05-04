// Copyright 2019-2020, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual.
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
import PedigreeTreeNode from './PedigreeTreeNode.js';

// constants
const TREE_DEPTH = 4;
const SELECTED_BUNNY_SCALE = 0.35;

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

    //TODO placeholder
    const rectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      fill: NaturalSelectionColors.PEDIGREE_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    const selectABunnyText = new Text( naturalSelectionStrings.selectABunny, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT,
      centerX: rectangle.centerX,
      centerY: rectangle.top + ( rectangle.height / 6 )
    } );

    assert && assert( !options.children, 'PedigreeGraphNode sets children' );
    options.children = [ rectangle, selectABunnyText ];

    super( options );

    let treeNode = null;

    pedigreeModel.selectedBunnyProperty.link( bunny => {
      selectABunnyText.visible = !bunny;

      if ( treeNode ) {
        treeNode.dispose();
        treeNode = null;
      }

      if ( bunny ) {
        treeNode = new PedigreeTreeNode( bunny, TREE_DEPTH, {
          scale: SELECTED_BUNNY_SCALE,
          center: rectangle.center
        } );
        this.addChild( treeNode );
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'PedigreeGraphNode does not support dispose' );
  }
}

naturalSelection.register( 'PedigreeGraphNode', PedigreeGraphNode );
export default PedigreeGraphNode;