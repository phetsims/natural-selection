// Copyright 2020, University of Colorado Boulder

/**
 * PedigreeBranchNode is a branch of the Pedigree graph.  It connects a child bunny to 2 parent bunnies via a T shape.
 * The parents are in turn instances of PedigreeBranchNode, so this is a recursively-defined structure.  If the bunny
 * has no parents, or we have reached the desired depth of the tree, then only the bunny is shown.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import naturalSelection from '../../../naturalSelection.js';
import AssertUtils from '../../AssertUtils.js';
import Bunny from '../../model/Bunny.js';
import PedigreeBunnyNode from './PedigreeBunnyNode.js';

// constants
const PARENTS_SCALE = 0.9; // how much the parents are scaled relative to the child
const DEFAULT_X_SPACING = 390; // x spacing between parents
const DEFAULT_Y_SPACING = 170; // y spacing between child and parents
const X_SPACING_SCALE = 0.55; // how much x spacing is scale for each generation
const Y_SPACING_SCALE = 0.7; // how much y spacing is scale for each generation
const T_HEIGHT = 20; // the height of the T that connects child to parents
const T_X_OFFSET = 70; // x offset of the T from the parent bunny's origin
const T_Y_OFFSET = 35; // y offset of the T from the parent bunny's origin

class PedigreeBranchNode extends Node {

  /**
   * @param {Bunny} bunny
   * @param {number} depth
   * @param {Property.<boolean>} furAllelesVisibleProperty
   * @param {Property.<boolean>} earsAllelesVisibleProperty
   * @param {Property.<boolean>} teethAllelesVisibleProperty
   * @param {Object} [options]
   */
  constructor( bunny, depth, furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( typeof depth === 'number', 'invalid depth' );
    assert && AssertUtils.assertPropertyTypeof( furAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyTypeof( earsAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyTypeof( teethAllelesVisibleProperty, 'boolean' );

    const children = [];

    options = merge( {
      bunnyIsSelected: false,
      xSpacing: DEFAULT_X_SPACING,
      ySpacing: DEFAULT_Y_SPACING
    }, options );

    const bunnyNode = new PedigreeBunnyNode( bunny,
      furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
        isSelected: options.bunnyIsSelected
      } );
    children.push( bunnyNode );

    let fatherNode = null;
    let motherNode = null;
    if ( depth > 1 && bunny.father && bunny.mother ) {

      fatherNode = new PedigreeBranchNode( bunny.father, depth - 1,
        furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
          xSpacing: X_SPACING_SCALE * options.xSpacing,
          parentsYSpacing: Y_SPACING_SCALE * options.parentsYSpacing,
          scale: PARENTS_SCALE,
          x: bunnyNode.centerX - options.xSpacing,
          bottom: bunnyNode.bottom - options.ySpacing
        } );
      children.push( fatherNode );

      motherNode = new PedigreeBranchNode( bunny.mother, depth - 1,
        furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
          xSpacing: X_SPACING_SCALE * options.xSpacing,
          parentsYSpacing: Y_SPACING_SCALE * options.parentsYSpacing,
          scale: PARENTS_SCALE,
          x: bunnyNode.centerX + options.xSpacing,
          bottom: bunnyNode.bottom - options.ySpacing
        } );
      children.push( motherNode );

      const tShape = new Shape()
        .moveTo( fatherNode.x + T_X_OFFSET, fatherNode.y - T_Y_OFFSET )
        .lineTo( motherNode.x - T_X_OFFSET, fatherNode.y - T_Y_OFFSET )
        .moveTo( bunnyNode.centerX, fatherNode.y - T_Y_OFFSET )
        .lineTo( bunnyNode.centerX, fatherNode.y + T_HEIGHT );
      const tPath = new Path( tShape, {
        lineWidth: 2,
        stroke: 'black'
      } );
      children.push( tPath );
    }

    assert && assert( !options.children, 'PedigreeBranchNode sets children' );
    options.children = children;

    super( options );

    // @private
    this.disposePedigreeBranchNode = () => {
      bunnyNode.dispose();
      fatherNode && fatherNode.dispose();
      motherNode && motherNode.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposePedigreeBranchNode();
    super.dispose();
  }
}

naturalSelection.register( 'PedigreeBranchNode', PedigreeBranchNode );
export default PedigreeBranchNode;