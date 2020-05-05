// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import PedigreeBunnyNode from './PedigreeBunnyNode.js';

// constants
const PARENTS_SCALE = 0.8; // how much the parents are scaled relative to the child

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
    assert && assert( furAllelesVisibleProperty instanceof Property, 'invalid furAllelesVisibleProperty' );
    assert && assert( earsAllelesVisibleProperty instanceof Property, 'invalid earsAllelesVisibleProperty' );
    assert && assert( teethAllelesVisibleProperty instanceof Property, 'invalid teethAllelesVisibleProperty' );

    const children = [];

    options = merge( {
      bunnyIsSelected: false,
      parentsXSpacing: 350,
      parentsYOffset: 175
    }, options );

    const bunnyNode = new PedigreeBunnyNode( bunny,
      furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
        isSelected: options.bunnyIsSelected,
        centerX: 0,
        bottom: 0
      } );
    children.push( bunnyNode );

    let fatherNode = null;
    let motherNode = null;
    if ( depth > 0 && bunny.father && bunny.mother ) {

      fatherNode = new PedigreeBranchNode( bunny.father, depth - 1,
        furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
          parentsXSpacing: 0.6 * options.parentsXSpacing,
          parentsYSpacing: 0.6 * options.parentsYSpacing,
          scale: PARENTS_SCALE,
          centerX: bunnyNode.centerX - options.parentsXSpacing,
          bottom: bunnyNode.bottom - options.parentsYOffset
        } );
      children.push( fatherNode );

      motherNode = new PedigreeBranchNode( bunny.mother, depth - 1,
        furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, {
          parentsXSpacing: 0.7 * options.parentsXSpacing,
          parentsYSpacing: 0.7 * options.parentsYSpacing,
          scale: PARENTS_SCALE,
          centerX: bunnyNode.centerX + options.parentsXSpacing,
          bottom: bunnyNode.bottom - options.parentsYOffset
        } );
      children.push( motherNode );

      const tShape = new Shape()
        .moveTo( fatherNode.x + 50, fatherNode.y )
        .lineTo( motherNode.x - 50, fatherNode.y )
        .moveTo( bunnyNode.centerX, fatherNode.y )
        .lineTo( bunnyNode.centerX, fatherNode.y + 15 );
      const tPath = new Path( tShape, {
        lineWidth: 1,
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