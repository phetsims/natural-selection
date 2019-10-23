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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const START_ANGLE = -Math.PI / 2; // 12:00
  const RADIUS = 18;
  const STROKE = 'black';
  const LINE_WIDTH = 1;

  class GenerationClockNode extends Node {

    /**
     * @param {GenerationClock} generationClock
     * @param {Property.<boolean>} selectionAgentsEnabledProperty
     * @param {Object} [options]
     */
    constructor( generationClock, selectionAgentsEnabledProperty, options ) {

      // The full center of the clock.
      const fullCircle = new Circle( RADIUS, {
        fill: 'rgb( 203, 120, 162 )', // pink
        stroke: STROKE,
        lineWidth: LINE_WIDTH
      } );

      // The bottom half of the circle denotes the selection agent period. 
      // This is the time during which selection agents are active, and bunnies may die.
      const bottomHalfCircle = new Path( new Shape().moveTo( 0, 0 ).arc( 0, 0, RADIUS, 0, Math.PI ).close(), {
        fill: 'rgb( 102, 102, 102 )' // dark gray
      } );

      // Overlay on the clock, sweeps out an arc to reveal what's under it.
      const revealArc = new Path( new Shape(), {
        fill: 'rgba( 255, 255, 255, 0.6 )', // transparent white
        stroke: STROKE,
        lineWidth: LINE_WIDTH
      } );

      // Order here is very important!
      assert && assert( !options.children, 'GenerationClockNode sets children' );
      options.children = [ fullCircle, bottomHalfCircle, revealArc ];

      super( options );

      // Reveal the part of the clock that corresponds to the percentage of a revolution that has elapsed.
      // unlink is unnecessary, exists for the lifetime of the sim.
      generationClock.percentTimeProperty.link( percentTime => {
        revealArc.shape = new Shape()
          .moveTo( 0, 0 )
          .arc( 0, 0, RADIUS, START_ANGLE + ( percentTime * 2 * Math.PI ), START_ANGLE + 2 * Math.PI )
          .close();
      } );

      // Show the bottom (gray) part of the clock only if some selection agent is enabled.
      // unlink is unnecessary, exists for the lifetime of the sim.
      selectionAgentsEnabledProperty.link( selectionAgentsEnabled => {
        bottomHalfCircle.visible = selectionAgentsEnabled;
      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'GenerationClockNode is not intended to be disposed' );
    }
  }

  return naturalSelection.register( 'GenerationClockNode', GenerationClockNode );
} );