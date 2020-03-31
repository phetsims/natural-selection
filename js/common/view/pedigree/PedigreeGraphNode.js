// Copyright 2019-2020, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import naturalSelection from '../../../naturalSelection.js';
import PedigreeModel from '../../model/PedigreeModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';

class PedigreeGraphNode extends Node {

  /**
   * @param {PedigreeModel} pedigreeModel
   * @param {Object} [options]
   */
  constructor( pedigreeModel, options ) {

    assert && assert( pedigreeModel instanceof PedigreeModel, 'invalid pedigreeModel' );

    options = merge( {
      graphWidth: 100,
      graphHeight: 100
    }, options );

    //TODO placeholder
    const rectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      fill: NaturalSelectionColors.PEDIGREE_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    const selectABunnyText = new Text( naturalSelectionStrings.selectABunny, {
      font: new PhetFont( 20 ),
      center: rectangle.center
    } );

    assert && assert( !options.children, 'PedigreeGraphNode sets children' );
    options.children = [ rectangle, selectABunnyText ];

    super( options );

    pedigreeModel.selectedBunnyProperty.link( bunny => {
      selectABunnyText.visible = !bunny;
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