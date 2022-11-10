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
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Node, NodeOptions, NodeTranslationOptions, Path, TColor, Text } from '../../../../scenery/js/imports.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import GenerationClock from '../model/GenerationClock.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
const START_ANGLE = -Math.PI / 2; // 12:00
const RADIUS = 18;
const LINE_WIDTH = 1;
const GENERATION_FONT = new PhetFont( 14 );

type SelfOptions = EmptySelfOptions;

type GenerationClockNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class GenerationClockNode extends Node {

  public constructor( generationClock: GenerationClock,
                      foodEnabledProperty: TReadOnlyProperty<boolean>,
                      wolvesEnabledProperty: TReadOnlyProperty<boolean>,
                      providedOptions: GenerationClockNodeOptions ) {

    const options = optionize<GenerationClockNodeOptions, SelfOptions, NodeOptions>()( {
      // empty optionize because we will be setting options.children below
    }, providedOptions );

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
    const foodSliceNode = createSliceNode( NaturalSelectionConstants.CLOCK_FOOD_RANGE, NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR, RADIUS );

    // The clock slice that denotes when the wolves are active
    const wolvesSliceNode = createSliceNode( NaturalSelectionConstants.CLOCK_WOLVES_RANGE, NaturalSelectionColors.CLOCK_WOLVES_SLICE_COLOR, RADIUS );

    // Overlay on the clock, sweeps out an arc to reveal what's under it.
    // The portion revealed corresponds to the percentage of a revolution that has elapsed.
    const revealArc = new Path( new Shape(), {
      fill: NaturalSelectionColors.CLOCK_REVEAL_COLOR,
      stroke: NaturalSelectionColors.CLOCK_STROKE,
      lineWidth: LINE_WIDTH
    } );

    // The current generation number, displayed below the circle.
    const generationNumberTextTandem = options.tandem.createTandem( 'generationNumberText' );
    const generationDerivedStringProperty = new PatternStringProperty( NaturalSelectionStrings.generationValueStringProperty, {
      value: generationClock.clockGenerationProperty
    }, {
      tandem: generationNumberTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
      phetioValueType: StringIO
    } );
    const generationNumberText = new Text( generationDerivedStringProperty, {
      font: GENERATION_FONT,
      fill: 'black',
      top: circle.bottom + 3,
      maxWidth: 100, // determined empirically
      tandem: generationNumberTextTandem
    } );

    // Keep the generation number centered below the circular part of the clock.
    generationNumberText.boundsProperty.link( () => {
      generationNumberText.centerX = circle.centerX;
    } );

    // Layering order is important here!
    options.children = [ circle, foodSliceNode, wolvesSliceNode, revealArc, rimNode, generationNumberText ];

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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Creates an icon with one slice of the clock filled in.
   */
  public static createSliceIcon( sliceRange: Range, sliceColor: TColor, radius = 10 ): Node {

    const sliceNode = createSliceNode( sliceRange, sliceColor, radius );

    const rimNode = new Circle( radius, {
      stroke: NaturalSelectionColors.CLOCK_STROKE
    } );

    return new Node( {
      children: [ sliceNode, rimNode ]
    } );
  }
}

/**
 * Creates a slice of the pie that is the generation clock.
 * @param radius
 * @param range - range between 0 and 1, starting at 12:00 and going clockwise
 * @param color
 */
function createSliceNode( range: Range, color: TColor, radius: number ): Node {

  assert && assert( range.min >= 0 && range.max <= 1, 'invalid range' );
  assert && assert( radius > 0 );

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