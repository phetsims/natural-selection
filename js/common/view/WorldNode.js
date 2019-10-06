// Copyright 2019, University of Colorado Boulder

/**
 * WorldNode is our viewport in the world of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class WorldNode extends Node {

    /**
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     */
    constructor( width, height, options ) {

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: 'black'
      } );

      assert && assert( !options.children, 'WorldNode sets children' );
      options.children = [ rectangle ];

      super( options );
    }
  }

  return naturalSelection.register( 'WorldNode', WorldNode );
} );