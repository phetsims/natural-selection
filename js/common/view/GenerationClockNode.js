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
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const RADIUS = 18;
  const START_ANGLE = -Math.PI / 2;

  class GenerationClockNode extends Node {

    /**
     * @param {Property.<number>} percentTimeProperty
     * @param {Property.<boolean>} selectionAgentsEnabledProperty
     * @param {Object} [options]
     */
    constructor( percentTimeProperty, selectionAgentsEnabledProperty, options ) {

      // The full center of the clock.
      const fullCircle = new Circle( RADIUS, {
        stroke: 'black',
        fill: 'rgb( 203, 120, 162 )'
      } );

      // The bottom half of the circle denotes the selection agent period. 
      // This is the time during which selection agents are active, and bunnies may die.
      const bottomHalfCircle = new Path( new Shape().moveTo( 0, 0 ).arc( 0, 0, RADIUS, 0, Math.PI ).close(), {
        fill: 'rgb( 102, 102, 102 )'
      } );

      // Overlay on the clock, sweeps out an arc to reveal what's under it.
      const revealArc = new Path( new Shape(), {
        fill: 'rgba( 255, 255, 255, 0.6 )' // transparent, to show colors underneath
      } );

      // The rim around the outside edge of the clock.
      const rimCircle = new Circle( RADIUS, {
        stroke: 'black'
      } );

      // The 'zero hand' on the clock is stationary, and denotes the time as which bunnies will mate.  
      const zeroHandNode = new Line( 0, 0, RADIUS, 0, {
        stroke: 'black',
        lineWidth: 1,
        rotation: START_ANGLE
      } );

      // The 'current hand' moves a time elapses, and denotes the current time.
      const currentHandNode = new Line( 0, 0, RADIUS, 0, {
        stroke: 'black',
        lineWidth: 1
      } );

      // Order here is very important!
      assert && assert( !options.children, 'GenerationClockNode sets children' );
      options.children = [ fullCircle, bottomHalfCircle, revealArc, zeroHandNode, currentHandNode, rimCircle ];

      super( options );

      // Reveal the part of the clock that corresponds to the percentage of a revolution that has elapsed.
      // unlink is unnecessary, exists for the lifetime of the sim.
      percentTimeProperty.link( percentTime => {

        // Position the rotating clock hand.
        currentHandNode.rotation = START_ANGLE + ( percentTime * 2 * Math.PI );

        // Draw the arc
        if ( percentTime === 0 || percentTime === 1 ) {
          revealArc.shape = Shape.circle( 0, 0, RADIUS );
        }
        else {
          revealArc.shape = new Shape()
            .moveTo( 0, 0 )
            .arc( 0, 0, RADIUS, START_ANGLE + ( percentTime * 2 * Math.PI ), START_ANGLE )
            .close();
        }
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