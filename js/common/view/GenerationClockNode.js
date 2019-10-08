// Copyright 2019, University of Colorado Boulder

/**
 * GenerationClockNode is the clock that does one complete revolution per generation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Line = require( 'SCENERY/nodes/Line' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const RADIUS = 18;

  class GenerationClockNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      const backgroundCircle = new Circle( RADIUS, {
        stroke: 'black',
        fill: 'rgb( 231, 200, 217 )' // pink
      } );

      const lineNode = new Line( 0, 0, 0, -RADIUS, {
        stroke: 'black'
      } );

      assert && assert( !options.children, 'GenerationClockNode sets children' );
      options.children = [ backgroundCircle, lineNode ];
      
      super( options );
    }
  }

  return naturalSelection.register( 'GenerationClockNode', GenerationClockNode );
} );