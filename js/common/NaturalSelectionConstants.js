// Copyright 2019-2020, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HomeScreenView from '../../../joist/js/HomeScreenView.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import RectangularButtonView from '../../../sun/js/buttons/RectangularButtonView.js';
import naturalSelection from '../naturalSelection.js';
import NaturalSelectionColors from './NaturalSelectionColors.js';
import NaturalSelectionQueryParameters from './NaturalSelectionQueryParameters.js';

// constants
const CORNER_RADIUS = 5;

const NaturalSelectionConstants = {

  // Model ===========================================================================================================

  // number of bunnies in the initial (generation zero) population
  INITIAL_POPULATION: NaturalSelectionQueryParameters.population,

  // number of bunnies required to 'take over the world'
  MAX_POPULATION: NaturalSelectionQueryParameters.maxPopulation,

  // bunnies die when they reach this age, in generations
  MAX_AGE: NaturalSelectionQueryParameters.maxAge,

  // number of bunnies in each litter
  LITTER_SIZE: NaturalSelectionQueryParameters.litterSize,

  // percentage of newborn bunnies that will receive a mutation
  MUTATION_PERCENTAGE: 1/7, //TODO 7 is from the Java version

  // seconds per generation, one revolution of the generation clock
  SECONDS_PER_GENERATION: NaturalSelectionQueryParameters.secondsPerGeneration,

  // dt when the Step button is pressed, in seconds
  SECONDS_PER_STEP: NaturalSelectionQueryParameters.secondsPerStep,

  // View ============================================================================================================N

  // Whether the concept of alleles is present in the UI
  ALLELES_VISIBLE: NaturalSelectionQueryParameters.allelesVisible,

  // Debugging flags
  SHOW_ORIGIN: NaturalSelectionQueryParameters.showOrigin,
  SHOW_SPRITE_INFO: NaturalSelectionQueryParameters.showSpriteInfo,
  SHOW_HORIZON: NaturalSelectionQueryParameters.showHorizon,

  // ScreenView
  SCREEN_VIEW_X_MARGIN: 15, // margins at left and right edges of the ScreenView
  SCREEN_VIEW_Y_MARGIN: 15, // margins at top and bottom edges of the ScreenView
  SCREEN_VIEW_X_SPACING: 15, // horizontal spacing between UI components in the ScreenView
  SCREEN_VIEW_Y_SPACING: 15, // vertical spacing between UI components in the ScreenView

  // EnvironmentNode
  ENVIRONMENT_DISPLAY_X_MARGIN: 15, // margins at left and right edges of the viewport
  ENVIRONMENT_DISPLAY_Y_MARGIN: 15, // margins at top and bottom edges of the viewport

  CORNER_RADIUS: CORNER_RADIUS,

  // ArrowButton
  ARROW_BUTTON_OPTIONS: {
    baseColor: NaturalSelectionColors.ARROW_BUTTONS,
    stroke: 'black',
    buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
    cornerRadius: 2,
    lineWidth: 0.5,
    arrowWidth: 8, // width of base
    arrowHeight: 10, // from tip to base
    xMargin: 6,
    yMargin: 4
  },

  // Checkbox
  CHECKBOX_OPTIONS: {
    spacing: 4,
    boxWidth: 16
  },
  CHECKBOX_X_SPACING: 6,

  // Panel
  PANEL_OPTIONS: {
    align: 'left',
    cornerRadius: CORNER_RADIUS,
    xMargin: 15,
    yMargin: 10,
    fill: NaturalSelectionColors.PANEL_FILL,
    stroke: NaturalSelectionColors.PANEL_STROKE
  },

  // RectangularPushButton
  RECTANGULAR_PUSH_BUTTON_OPTIONS: {
    cornerRadius: CORNER_RADIUS
  },

  // VBox
  VBOX_OPTIONS: {
    spacing: 11,
    align: 'left'
  },

  // Dialog
  //TODO workaround for https://github.com/phetsims/joist/issues/586
  DIALOG_SCALE: HomeScreenView.LAYOUT_BOUNDS.width / ScreenView.DEFAULT_LAYOUT_BOUNDS.width,

  // Fonts
  CHECKBOX_FONT: new PhetFont( 16 ),
  PUSH_BUTTON_FONT: new PhetFont( 16 ),
  RADIO_BUTTON_FONT: new PhetFont( 16 ),
  INSTRUCTIONS_FONT: new PhetFont( 16 ),
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  ADD_MUTATION_TRAIT_FONT: new PhetFont( 16 ),
  ADD_MUTATION_COLUMN_HEADING_FONT: new PhetFont( 14 ),
  MUTATION_COMING_FONT: new PhetFont( 16 ),
  POPULATION_AXIS_FONT: new PhetFont( 14 ),
  PROPORTIONS_GENERATION_CONTROL_FONT: new PhetFont( 16 ),
  PROPORTIONS_LEGEND_FONT: new PhetFont( 16 ),
  DIALOG_FONT: new PhetFont( 16 )
};

// Validation
assert && assert( NaturalSelectionConstants.MUTATION_PERCENTAGE > 0 && NaturalSelectionConstants.MUTATION_PERCENTAGE <= 1/3,
  'MUTATION_PERCENTAGE must be > 0 and <= 1/numberOfTraits' );
assert && assert( NaturalSelectionConstants.SECONDS_PER_STEP < NaturalSelectionConstants.SECONDS_PER_GENERATION,
  'SECONDS_PER_STEP must be < SECONDS_PER_GENERATION' );
assert && assert( NaturalSelectionConstants.INITIAL_POPULATION < NaturalSelectionConstants.MAX_POPULATION,
  'INITIAL_POPULATION must be < MAX_POPULATION' );

//TODO https://github.com/phetsims/natural-selection/issues/49, validate mutations and population, call QueryStringMachine.addWarning

naturalSelection.register( 'NaturalSelectionConstants', NaturalSelectionConstants );
export default NaturalSelectionConstants;