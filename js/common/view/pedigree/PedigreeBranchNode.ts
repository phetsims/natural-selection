// Copyright 2020-2022, University of Colorado Boulder

/**
 * PedigreeBranchNode is a branch of the Pedigree graph. It connects a child bunny to 2 parent bunnies via a T shape:
 *
 *    father ----- mother
 *             |
 *          child
 *
 * The parents are in turn instances of PedigreeBranchNode, so this is a recursively-defined structure.  If the bunny
 * has no parents, or we have reached the desired depth of the tree, then only the bunny is shown.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import { Shape } from '../../../../../kite/js/imports.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, NodeTransformOptions, Path } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import BunnyImageMap from '../BunnyImageMap.js';
import PedigreeBunnyNode from './PedigreeBunnyNode.js';

// constants
const PARENTS_SCALE = 0.9; // how much the parents are scaled relative to the child
const DEFAULT_X_SPACING = 156; // x spacing between parents
const DEFAULT_Y_SPACING = 68; // y spacing between child and parents
const X_SPACING_SCALE = 0.55; // how much x spacing is scale for each generation
const T_HEIGHT = 16; // the height of the T that connects child to parents
const T_X_OFFSET = 28; // x offset of the T from the parent bunny's origin
const T_Y_OFFSET = 14; // y offset of the T from the parent bunny's origin

type SelfOptions = {
  bunnyIsSelected?: boolean;
  xSpacing?: number;
  ySpacing?: number;
};

type PedigreeBranchNodeOptions = SelfOptions & NodeTransformOptions;

export default class PedigreeBranchNode extends Node {

  private readonly disposePedigreeBranchNode: () => void;

  public constructor( bunny: Bunny, bunnyImageMap: BunnyImageMap, branchDepth: number,
                      selectedBunnyProperty: SelectedBunnyProperty,
                      furAllelesVisibleProperty: Property<boolean>,
                      earsAllelesVisibleProperty: Property<boolean>,
                      teethAllelesVisibleProperty: Property<boolean>,
                      providedOptions?: PedigreeBranchNodeOptions ) {

    const children = [];

    const options = optionize<PedigreeBranchNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      bunnyIsSelected: false,
      xSpacing: DEFAULT_X_SPACING,
      ySpacing: DEFAULT_Y_SPACING
    }, providedOptions );

    const bunnyNode = new PedigreeBunnyNode( bunny, bunnyImageMap,
      furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
        bunnyIsSelected: ( selectedBunnyProperty.value === bunny )
      } );
    children.push( bunnyNode );

    let fatherNode: PedigreeBranchNode;
    let motherNode: PedigreeBranchNode;
    if ( branchDepth > 1 && bunny.father && bunny.mother ) {

      fatherNode = new PedigreeBranchNode( bunny.father, bunnyImageMap, branchDepth - 1, selectedBunnyProperty,
        furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
          xSpacing: X_SPACING_SCALE * options.xSpacing,
          scale: PARENTS_SCALE,
          x: bunnyNode.centerX - options.xSpacing,
          bottom: bunnyNode.bottom - options.ySpacing
        } );
      children.push( fatherNode );

      motherNode = new PedigreeBranchNode( bunny.mother, bunnyImageMap, branchDepth - 1, selectedBunnyProperty,
        furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
          xSpacing: X_SPACING_SCALE * options.xSpacing,
          scale: PARENTS_SCALE,
          x: bunnyNode.centerX + options.xSpacing,
          bottom: bunnyNode.bottom - options.ySpacing
        } );
      children.push( motherNode );

      const tShape = new Shape()
        .moveTo( fatherNode.x + T_X_OFFSET, fatherNode.y - T_Y_OFFSET )
        .lineTo( motherNode.x - T_X_OFFSET, fatherNode.y - T_Y_OFFSET )
        .moveTo( bunnyNode.centerX, fatherNode.y - T_Y_OFFSET )
        .lineTo( bunnyNode.centerX, fatherNode.y - T_Y_OFFSET + T_HEIGHT );
      const tPath = new Path( tShape, {
        lineWidth: 1,
        stroke: 'black'
      } );
      children.push( tPath );
    }

    options.children = children;

    super( options );

    this.disposePedigreeBranchNode = () => {
      bunnyNode.dispose();
      fatherNode && fatherNode.dispose();
      motherNode && motherNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposePedigreeBranchNode();
    super.dispose();
  }
}

naturalSelection.register( 'PedigreeBranchNode', PedigreeBranchNode );