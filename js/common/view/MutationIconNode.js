// Copyright 2019, University of Colorado Boulder

/**
 * MutationIconNode is the mutation icon that appears in the Pedigree tree and 'Add Mutations' panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );

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

  return naturalSelection.register( 'MutationIconNode', MutationIconNode );
} );