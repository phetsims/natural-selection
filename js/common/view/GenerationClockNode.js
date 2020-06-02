// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationClockNode is the clock that does one complete revolution per generation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

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
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';

// constants
const START_ANGLE = -Math.PI / 2; // 12:00
const RADIUS = 18;
const STROKE = 'black';
const LINE_WIDTH = 1;
const GENERATION_FONT = new PhetFont( 16 );

class GenerationClockNode extends Node {

  /**
   * @param {GenerationClock} generationClock
   * @param {Property.<boolean>} foodEnabledProperty
   * @param {Property.<boolean>} wolvesEnabledProperty
   * @param {Object} [options]
   */
  constructor( generationClock, foodEnabledProperty, wolvesEnabledProperty, options ) {

    assert && assert( generationClock instanceof GenerationClock, 'invalid generationClock' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( foodEnabledProperty, 'boolean' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( wolvesEnabledProperty, 'boolean' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // The full center of the clock.
    const fullCircle = new Circle( RADIUS, {
      fill: NaturalSelectionColors.CLOCK_COLOR,
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    } );

    // The slice of the circle that denotes when food is active
    const foodSlice = createSlice( generationClock.foodRange, NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR );

    // The slice of the circle that denotes when the wolves are active
    const wolvesSlice = createSlice( generationClock.wolvesRange, NaturalSelectionColors.CLOCK_WOLVES_SLICE_COLOR );

    // Overlay on the clock, sweeps out an arc to reveal what's under it.
    // The portion revealed corresponds to the percentage of a revolution that has elapsed.
    const revealArc = new Path( new Shape(), {
      fill: NaturalSelectionColors.CLOCK_REVEAL_COLOR,
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    } );

    // The current generation number, displayed below the circle.
    const generationNode = new Text( '', {
      font: GENERATION_FONT,
      fill: 'black',
      top: fullCircle.bottom + 3
    } );

    // Layering order is important here!
    assert && assert( !options.children, 'GenerationClockNode sets children' );
    options.children = [ fullCircle, foodSlice, wolvesSlice, revealArc, generationNode ];

    super( options );

    // Update the generation number. unlink is unnecessary, exists for the lifetime of the sim.
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

    // Makes the wolves slice visible. unlink is unnecessary, exists for the lifetime of the sim.
    wolvesEnabledProperty.link( enabled => {
      wolvesSlice.visible = enabled;
    } );

    // Makes the food slice visible. unlink is unnecessary, exists for the lifetime of the sim.
    foodEnabledProperty.link( enabled => {
      foodSlice.visible = enabled;
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

/**
 * Creates a slice of the pie that is the generation clock.
 * @param {Range} range
 * @param {Color|string} color
 * @returns {Path}
 */
function createSlice( range, color ) {
  const startAngle = START_ANGLE + range.min * 2 * Math.PI;
  const endAngle = START_ANGLE + range.max * 2 * Math.PI;
  const shape = new Shape()
    .moveTo( 0, 0 )
    .arc( 0, 0, RADIUS, startAngle, endAngle )
    .close();
  return new Path( shape, {
    fill: color
  } );
}

naturalSelection.register( 'GenerationClockNode', GenerationClockNode );
export default GenerationClockNode;