// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * MutationIconNode is the mutation icon that appears in the Pedigree tree and 'Add Mutations' panel.
 * It looks like a DNA helix.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Circle, Node, Path } from '../../../../scenery/js/imports.js';
import dnaSolidShape from '../../../../sherpa/js/fontawesome-5/dnaSolidShape.js';
import naturalSelection from '../../naturalSelection.js';

class MutationIconNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      radius: 12
    }, options );

    // Yellow circle
    const circle = new Circle( options.radius, {
      fill: 'rgb( 250, 244, 77 )',
      stroke: 'black'
    } );

    // DNA icon centered in the circle
    const icon = new Path( dnaSolidShape, {
      fill: 'black'
    } );
    const scale = ( 0.6 * circle.height ) / Math.max( icon.width, icon.height );
    icon.setScaleMagnitude( scale );
    icon.center = circle.center;

    assert && assert( !options.children, 'MutationIconNode sets children' );
    options.children = [ circle, icon ];

    super( options );
  }
}

naturalSelection.register( 'MutationIconNode', MutationIconNode );
export default MutationIconNode;