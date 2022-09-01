// Copyright 2019-2022, University of Colorado Boulder

/**
 * GenerationClockNode is the clock that does one complete revolution per generation.
 * It displays a clock slice for each environmental factor, to denote when they will be active.
 * We commonly refer to times, like 12:00, as if this were a standard wall clock.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PatternStringProperty from '../../../../phetcommon/js/util/PatternStringProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Node, Path, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import GenerationClock from '../model/GenerationClock.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

// constants
const START_ANGLE = -Math.PI / 2; // 12:00
const RADIUS = 18;
const LINE_WIDTH = 1;
const GENERATION_FONT = new PhetFont( 14 );

class GenerationClockNode extends Node {

  /**
   * @param {GenerationClock} generationClock
   * @param {ReadOnlyProperty.<boolean>} foodEnabledProperty
   * @param {Property.<boolean>} wolvesEnabledProperty
   * @param {Object} [options]
   */
  constructor( generationClock, foodEnabledProperty, wolvesEnabledProperty, options ) {

    assert && assert( generationClock instanceof GenerationClock, 'invalid generationClock' );
    assert && AssertUtils.assertAbstractPropertyOf( foodEnabledProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( wolvesEnabledProperty, 'boolean' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // The full center of the clock.
    const circle = new Circle( RADIUS, {
      fill: NaturalSelectionColors.CLOCK_FILL
    } );

    // Rim around the outside edge
    const rimNode = new Circle( RADIUS, {
      stroke: NaturalSelectionColors.CLOCK_STROKE,
      lineWidth: LINE_WIDTH
    } );

    // The clock slice that denotes when food is active
    const foodSliceNode = createSliceNode( RADIUS, NaturalSelectionConstants.CLOCK_FOOD_RANGE, NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR );

    // The clock slice that denotes when the wolves are active
    const wolvesSliceNode = createSliceNode( RADIUS, NaturalSelectionConstants.CLOCK_WOLVES_RANGE, NaturalSelectionColors.CLOCK_WOLVES_SLICE_COLOR );

    // Overlay on the clock, sweeps out an arc to reveal what's under it.
    // The portion revealed corresponds to the percentage of a revolution that has elapsed.
    const revealArc = new Path( new Shape(), {
      fill: NaturalSelectionColors.CLOCK_REVEAL_COLOR,
      stroke: NaturalSelectionColors.CLOCK_STROKE,
      lineWidth: LINE_WIDTH
    } );

    // The current generation number, displayed below the circle.
    const generationNumberNodeTandem = options.tandem.createTandem( 'generationNumberNode' );
    const generationDerivedStringProperty = new PatternStringProperty( naturalSelectionStrings.generationValueStringProperty, {
      value: generationClock.clockGenerationProperty
    }, {
      tandem: generationNumberNodeTandem.createTandem( 'textProperty' ),
      phetioValueType: StringIO
    } );
    const generationNumberNode = new Text( generationDerivedStringProperty, {
      font: GENERATION_FONT,
      fill: 'black',
      top: circle.bottom + 3,
      maxWidth: 100, // determined empirically
      tandem: generationNumberNodeTandem
    } );

    // Keep the generation number centered below the circular part of the clock.
    generationNumberNode.boundsProperty.link( () => {
      generationNumberNode.centerX = circle.centerX;
    } );

    // Layering order is important here!
    assert && assert( !options.children, 'GenerationClockNode sets children' );
    options.children = [ circle, foodSliceNode, wolvesSliceNode, revealArc, rimNode, generationNumberNode ];

    super( options );

    // Reveal part of the clock. unlink is not necessary.
    generationClock.timeInPercentProperty.link( timeInPercent => {
      revealArc.shape = new Shape()
        .moveTo( 0, 0 )
        .arc( 0, 0, RADIUS, START_ANGLE + ( timeInPercent * 2 * Math.PI ), START_ANGLE + 2 * Math.PI )
        .close();
    } );

    // Makes the wolves clock slice visible. unlink is not necessary.
    wolvesEnabledProperty.link( enabled => {
      wolvesSliceNode.visible = enabled;
    } );

    // Makes the food clock slice visible. unlink is not necessary.
    foodEnabledProperty.link( enabled => {
      foodSliceNode.visible = enabled;
    } );

    // Create a Studio link to the model
    this.addLinkedElement( generationClock, {
      tandem: options.tandem.createTandem( 'generationClock' )
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Creates an icon with one slice of the clock filled in.
   * @param {Range} sliceRange
   * @param {Color|string} sliceColor
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static createSliceIcon( sliceRange, sliceColor, options ) {

    options = merge( {
      radius: 10
    }, options );

    const sliceNode = createSliceNode( options.radius, sliceRange, sliceColor );

    const rimNode = new Circle( options.radius, {
      stroke: NaturalSelectionColors.CLOCK_STROKE
    } );

    return new Node( {
      children: [ sliceNode, rimNode ]
    } );
  }
}

/**
 * Creates a slice of the pie that is the generation clock.
 * @param {number} radius
 * @param {Range} range - range between 0 and 1, starting at 12:00 and going clockwise
 * @param {Color|string} color
 * @returns {Node}
 */
function createSliceNode( radius, range, color ) {

  assert && AssertUtils.assertPositiveInteger( radius );
  assert && assert( range instanceof Range, 'invalid range' );
  assert && assert( range.min >= 0 && range.max <= 1, 'invalid range' );

  const startAngle = START_ANGLE + range.min * 2 * Math.PI;
  const endAngle = START_ANGLE + range.max * 2 * Math.PI;
  const shape = new Shape()
    .moveTo( 0, 0 )
    .arc( 0, 0, radius, startAngle, endAngle )
    .close();
  return new Path( shape, {
    fill: color
  } );
}

naturalSelection.register( 'GenerationClockNode', GenerationClockNode );
export default GenerationClockNode;