// Copyright 2020, University of Colorado Boulder

/**
 * Movable3Node is a Node that has an associated Movable3 model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Movable3 = require( 'NATURAL_SELECTION/common/model/Movable3' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );

  class Movable3Node extends Node {

    /**
     * @parma {Movable3} movable
     * @param {Object} [options]
     */
    constructor( movable, options ) {

      assert && assert( movable instanceof Movable3, 'invalid movable' );

      super( options );

      // @public (read-only)
      this.movable = movable;
    }
  }

  return naturalSelection.register( 'Movable3Node', Movable3Node );
} );