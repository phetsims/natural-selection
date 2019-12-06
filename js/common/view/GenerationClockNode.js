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
  const Tandem = require( 'TANDEM/Tandem' );

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
        lineWidth: LINE_WIDTH,

        // phet-io
        tandem: Tandem.required
      } );

      // The part of the circle that denotes when the selection agents are active, and bunnies may die.
      // Visible only when some selection agent is enabled.
      const selectionAgentStartAngle = START_ANGLE + generationClock.selectionAgentPercentRange.min * 2 * Math.PI;
      const selectionAgentEndAngle = START_ANGLE + generationClock.selectionAgentPercentRange.max * 2 * Math.PI;
      const selectionAgentShape = new Shape()
        .moveTo( 0, 0 )
        .arc( 0, 0, RADIUS, selectionAgentStartAngle, selectionAgentEndAngle )
        .close();
      const selectionAgentPath = new Path( selectionAgentShape, {
        fill: 'rgb( 102, 102, 102 )' // dark gray
      } );

      // Overlay on the clock, sweeps out an arc to reveal what's under it.
      // The portion reveals corresponds to the percentage of a revolution that has elapsed.
      const revealArc = new Path( new Shape(), {
        fill: 'rgba( 255, 255, 255, 0.6 )', // transparent white
        stroke: STROKE,
        lineWidth: LINE_WIDTH
      } );

      // Layering order here is important!
      assert && assert( !options.children, 'GenerationClockNode sets children' );
      options.children = [ fullCircle, selectionAgentPath, revealArc ];

      super( options );

      // Reveal part of the clock. unlink is unnecessary, exists for the lifetime of the sim.
      generationClock.percentTimeProperty.link( percentTime => {
        revealArc.shape = new Shape()
          .moveTo( 0, 0 )
          .arc( 0, 0, RADIUS, START_ANGLE + ( percentTime * 2 * Math.PI ), START_ANGLE + 2 * Math.PI )
          .close();
      } );

      // Show selectionAgentPath if some selection agent is enabled.
      // unlink is unnecessary, exists for the lifetime of the sim.
      selectionAgentsEnabledProperty.link( selectionAgentsEnabled => {
        selectionAgentPath.visible = selectionAgentsEnabled;
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