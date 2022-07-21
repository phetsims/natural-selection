// Copyright 2019-2022, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual. Origin at bottom center.
 * Note that this graph is not a performance concern, so it is currently updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import { Node, Rectangle, Text } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import BunnyImageMap from '../BunnyImageMap.js';
import PedigreeBranchNode from './PedigreeBranchNode.js';

// constants
const X_MARGIN = 5;
const Y_MARGIN = 5;

class PedigreeGraphNode extends Node {

  /**
   * @param {SelectedBunnyProperty} selectedBunnyProperty
   * @param {BunnyImageMap} bunnyImageMap
   * @param {Property.<boolean>} furAllelesVisibleProperty
   * @param {Property.<boolean>} earsAllelesVisibleProperty
   * @param {Property.<boolean>} teethAllelesVisibleProperty
   * @param {Object} [options]
   */
  constructor( selectedBunnyProperty, bunnyImageMap,
               furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, options ) {

    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty, 'invalid selectedBunnyProperty' );
    assert && assert( bunnyImageMap instanceof BunnyImageMap, 'invalid bunnyImageMap' );
    assert && AssertUtils.assertPropertyOf( furAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( earsAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( teethAllelesVisibleProperty, 'boolean' );

    options = merge( {
      graphWidth: 100,
      graphHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED,
      visiblePropertyOptions: { phetioReadOnly: true }
    }, options );

    const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      fill: NaturalSelectionColors.PEDIGREE_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    // 'Select a Bunny' is displayed when there is no selected bunny.
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
    selectedBunnyProperty.link( bunny => {
      selectABunnyText.visible = !bunny;

      if ( branchNode ) {
        branchNode.dispose();
        branchNode = null;
      }

      if ( bunny ) {

        // Create the graph
        branchNode = new PedigreeBranchNode( bunny, bunnyImageMap, NaturalSelectionConstants.PEDIGREE_TREE_DEPTH,
          selectedBunnyProperty, furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
            bunnyIsSelected: true,
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

    // Create a Studio link to the model Property that controls which bunny's pedigree is displayed
    this.addLinkedElement( selectedBunnyProperty, {
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