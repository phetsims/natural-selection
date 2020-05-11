// Copyright 2019-2020, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual. Origin at bottom center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import PedigreeBranchNode from './PedigreeBranchNode.js';

// constants
const TREE_DEPTH = 4;
const SELECTED_BUNNY_SCALE = 0.4;
const X_MARGIN = 5;
const Y_MARGIN = 5;

class PedigreeGraphNode extends Node {

  /**
   * @param {Property.<Bunny|null>} selectedBunnyProperty
   * @param {Property.<boolean>} furAllelesVisibleProperty
   * @param {Property.<boolean>} earsAllelesVisibleProperty
   * @param {Property.<boolean>} teethAllelesVisibleProperty
   * @param {Object} [options]
   */
  constructor( selectedBunnyProperty, furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, options ) {

    assert && assert( selectedBunnyProperty instanceof Property, 'invalid selectedBunnyProperty' );
    assert && assert( furAllelesVisibleProperty instanceof Property, 'invalid furAllelesVisibleProperty' );
    assert && assert( earsAllelesVisibleProperty instanceof Property, 'invalid earsAllelesVisibleProperty' );
    assert && assert( teethAllelesVisibleProperty instanceof Property, 'invalid teethAllelesVisibleProperty' );

    options = merge( {
      graphWidth: 100,
      graphHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    }, options );

    const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
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

    selectedBunnyProperty.link( bunny => {
      selectABunnyText.visible = !bunny;

      if ( branchNode ) {
        branchNode.dispose();
        branchNode = null;
      }

      if ( bunny ) {

        // Create the graph
        branchNode = new PedigreeBranchNode( bunny, TREE_DEPTH,
          furAllelesVisibleProperty,
          earsAllelesVisibleProperty,
          teethAllelesVisibleProperty, {
            bunnyIsSelected: true,
            scale: SELECTED_BUNNY_SCALE,

            // centered at the bottom of the background
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
          console.warn( `scaling Pedigree by ${scale}` );
          branchNode.setScaleMagnitude( scale );
        }
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