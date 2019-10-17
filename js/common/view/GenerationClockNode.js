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
  const CLOCK_START_ANGLE = -Math.PI / 2;
  const LINE_NODE_OPTIONS = {
    stroke: 'black',
    lineWidth: 1
  };

  class GenerationClockNode extends Node {

    /**
     * @param {GenerationClock} generationClock
     * @param {Object} [options]
     */
    constructor( generationClock, options ) {

      // The center of the clock is pink, other colors are put on top of this. 
      const pinkCircle = new Circle( RADIUS, {
        stroke: 'black',
        fill: 'rgb( 231, 200, 217 )'
      } );

      // The dark pink arc denotes the portion of a full revolution that has elapsed.
      const darkPinkArc = new Path( new Shape(), {
        fill: 'rgb( 203, 120, 162 )'
      } );

      // The gray (bottom) half of the circle denotes the selection agent period. This is the time during which 
      // selection agents are active, and bunnies may die.
      const grayHalfCircle = new Path( new Shape().moveTo( 0, 0 ).arc( 0, 0, RADIUS, 0, Math.PI ).close(), {
        fill: 'rgb( 193, 193, 193 )'
      } );

      // The dark gray arc denotes the portion of the selection agent period that has elapsed. 
      const darkGrayElapseArc = new Path( new Shape(), {
        fill: 'rgb( 102, 102, 102 )'
      } );

      // This is the rim around the outside edge of the clock.
      const rimCircle = new Circle( RADIUS, {
        stroke: 'black'
      } );

      // The 'zero hand' on the clock is stationary, and denotes the time as which bunnies will mate.  
      const zeroHandNode = new Line( 0, 0, 0, -RADIUS, LINE_NODE_OPTIONS );

      // The 'current hand' moves a time elapses, and denotes the current time.
      const currentHandNode = new Line( 0, 0, 0, -RADIUS, LINE_NODE_OPTIONS );

      // Order here is very important!
      assert && assert( !options.children, 'GenerationClockNode sets children' );
      options.children = [ pinkCircle, darkPinkArc, grayHalfCircle, darkGrayElapseArc, zeroHandNode, currentHandNode, rimCircle ];

      super( options );

      generationClock.percentTimeProperty.link( percentTime => {

        // Update the part of the clock that corresponds to elapsed time.
        currentHandNode.rotation = percentTime * 2 * Math.PI;
        if ( percentTime === 0 ) {
          darkPinkArc.visible = false;
        }
        else {
          const darkPinkAngle = CLOCK_START_ANGLE + ( percentTime * 2 * Math.PI );
          darkPinkArc.shape = new Shape().moveTo( 0, 0 ).arc( 0, 0, RADIUS, -Math.PI / 2, darkPinkAngle ).close();
          darkPinkArc.visible = true;
        }

        // Update the part of the clock that corresponds to the selection agent period.
        if ( percentTime > generationClock.selectionAgentPercentRange.min ) {
          const darkGrayAngle = ( Math.min( generationClock.selectionAgentPercentRange.max, percentTime ) - generationClock.selectionAgentPercentRange.min ) * Math.PI /
                                generationClock.selectionAgentPercentRange.getLength();
          darkGrayElapseArc.shape = new Shape().moveTo( 0, 0 ).arc( 0, 0, RADIUS, 0, darkGrayAngle ).close();
          darkGrayElapseArc.visible = true;
        }
        else {
          darkGrayElapseArc.visible = false;
        }
      } );
    }
  }

  return naturalSelection.register( 'GenerationClockNode', GenerationClockNode );
} );