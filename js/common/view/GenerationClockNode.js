// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationClockNode is the clock that does one complete revolution per generation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import GenerationClock from '../model/GenerationClock.js';

// constants
const START_ANGLE = -Math.PI / 2; // 12:00
const RADIUS = 18;
const STROKE = 'black';
const LINE_WIDTH = 1;

class GenerationClockNode extends Node {

  /**
   * @param {GenerationClock} generationClock
   * @param {Property.<boolean>} environmentalFactorEnabledProperty
   * @param {Object} [options]
   */
  constructor( generationClock, environmentalFactorEnabledProperty, options ) {

    assert && assert( generationClock instanceof GenerationClock, 'invalid generationClock' );
    assert && assert( environmentalFactorEnabledProperty instanceof Property, 'invalid environmentalFactorEnabledProperty' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // The full center of the clock.
    const fullCircle = new Circle( RADIUS, {
      fill: 'rgb( 203, 120, 162 )', // pink
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    } );

    // The part of the circle that denotes when the environmental factors are active, and bunnies may die.
    // Visible only when some environmental factor is enabled.
    const environmentalFactorStartAngle = START_ANGLE + generationClock.environmentalFactorPercentRange.min * 2 * Math.PI;
    const environmentalFactorEndAngle = START_ANGLE + generationClock.environmentalFactorPercentRange.max * 2 * Math.PI;
    const environmentalFactorShape = new Shape()
      .moveTo( 0, 0 )
      .arc( 0, 0, RADIUS, environmentalFactorStartAngle, environmentalFactorEndAngle )
      .close();
    const environmentalFactorPath = new Path( environmentalFactorShape, {
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
    options.children = [ fullCircle, environmentalFactorPath, revealArc ];

    super( options );

    // Display the current generation number below the generation clock.
    const generationNode = new Text( '', {
      font: new PhetFont( 16 ),
      fill: 'black',
      top: fullCircle.bottom + 3
    } );
    this.addChild( generationNode );
    generationClock.currentGenerationProperty.link( currentGeneration => {
      generationNode.text = currentGeneration;
      generationNode.centerX = fullCircle.centerX;
    } );

    // Reveal part of the clock. unlink is unnecessary, exists for the lifetime of the sim.
    generationClock.percentTimeProperty.link( percentTime => {
      revealArc.shape = new Shape()
        .moveTo( 0, 0 )
        .arc( 0, 0, RADIUS, START_ANGLE + ( percentTime * 2 * Math.PI ), START_ANGLE + 2 * Math.PI )
        .close();
    } );

    // Show environmentalFactorPath if some environmental factor is enabled.
    // unlink is unnecessary, exists for the lifetime of the sim.
    environmentalFactorEnabledProperty.link( environmentalFactorEnabled => {
      environmentalFactorPath.visible = environmentalFactorEnabled;
    } );

    // Create a link to the model that this Node displays
    this.addLinkedElement( generationClock, {
      tandem: options.tandem.createTandem( 'generationClock' )
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'GenerationClockNode does not support dispose' );
  }
}

naturalSelection.register( 'GenerationClockNode', GenerationClockNode );
export default GenerationClockNode;