// Copyright 2019-2022, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual. Origin at bottom center.
 * Note that this graph is not a performance concern, so it is currently updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeOptions, Rectangle, Text } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import BunnyImageMap from '../BunnyImageMap.js';
import PedigreeBranchNode from './PedigreeBranchNode.js';

// constants
const X_MARGIN = 5;
const Y_MARGIN = 5;

type SelfOptions = {
  graphWidth?: number;
  graphHeight?: number;
};

type PedigreeGraphNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class PedigreeGraphNode extends Node {

  public constructor( selectedBunnyProperty: SelectedBunnyProperty,
                      bunnyImageMap: BunnyImageMap,
                      furAllelesVisibleProperty: Property<boolean>,
                      earsAllelesVisibleProperty: Property<boolean>,
                      teethAllelesVisibleProperty: Property<boolean>,
                      providedOptions: PedigreeGraphNodeOptions ) {

    const options = optionize<PedigreeGraphNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      graphWidth: 100,
      graphHeight: 100,

      // NodeOptions
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      fill: NaturalSelectionColors.PEDIGREE_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    // 'Select a Bunny' is displayed when there is no selected bunny.
    const selectABunnyText = new Text( NaturalSelectionStrings.selectABunnyStringProperty, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT,
      maxWidth: 0.5 * backgroundNode.width,
      tandem: options.tandem.createTandem( 'selectABunnyText' )
    } );
    selectABunnyText.boundsProperty.link( bounds => {
      selectABunnyText.centerX = backgroundNode.centerX;
      selectABunnyText.centerY = backgroundNode.top + ( backgroundNode.height / 6 );
    } );

    options.children = [ backgroundNode, selectABunnyText ];

    super( options );

    // The branch of the Pedigree tree that is currently displayed.
    let branchNode: PedigreeBranchNode | null = null;

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
        const scale = Math.min(
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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'PedigreeGraphNode', PedigreeGraphNode );