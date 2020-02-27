// Copyright 2019, University of Colorado Boulder

/**
 * MutationIconNode is the mutation icon that appears in the Pedigree tree and 'Add Mutations' panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import naturalSelection from '../../naturalSelection.js';

class MutationIconNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      radius: 10
    }, options );

    // Yellow circle
    const circle = new Circle( options.radius, {
      fill: 'rgb( 250, 244, 77 )',
      stroke: 'black'
    } );

    // DNA icon centered in the circle
    const icon = new FontAwesomeNode( 'dna_solid', {
      maxWidth: circle.width * 0.8,
      maxHeight: circle.height * 0.8,
      center: circle.center
    } );

    assert && assert( !options.children, 'MutationIconNode sets children' );
    options.children = [ circle, icon ];

    super( options );
  }
}

naturalSelection.register( 'MutationIconNode', MutationIconNode );
export default MutationIconNode;