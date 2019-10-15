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
     * @param {GenerationClock} generationClock
     * @param {Object} [options]
     */
    constructor( generationClock, options ) {

      const backgroundCircle = new Circle( RADIUS, {
        stroke: 'black',
        fill: 'rgb( 231, 200, 217 )'
      } );

      const lineNode = new Line( 0, 0, 0, -RADIUS, {
        stroke: 'black',
        lineWidth: 2
      } );

      assert && assert( !options.children, 'GenerationClockNode sets children' );
      options.children = [ backgroundCircle, lineNode ];
      
      super( options );

      generationClock.percentTimeProperty.link( percentTime => {
        lineNode.rotation = percentTime * 2 * Math.PI;
      } );
    }
  }

  return naturalSelection.register( 'GenerationClockNode', GenerationClockNode );
} );