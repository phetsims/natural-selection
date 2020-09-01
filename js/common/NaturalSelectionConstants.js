// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import AssertUtils from '../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import RectangularButtonView from '../../../sun/js/buttons/RectangularButtonView.js';
import naturalSelection from '../naturalSelection.js';
import NaturalSelectionColors from './NaturalSelectionColors.js';

// constants
const CORNER_RADIUS = 5;

const NaturalSelectionConstants = {

  // Model ===========================================================================================================

  // Generation Clock
  // slice of the generation clock for wolves, as a percentage range [0,1]. This correspond to 2:00-6:00 on the clock.
  CLOCK_WOLVES_RANGE: new Range( 2 / 12, 6 / 12 ),
  // slice of the generation clock for food, as a percentage range [0,1]. This correspond to 6:00-10:00 on the clock.
  CLOCK_FOOD_RANGE: new Range( 6 / 12, 10 / 12 ),

  // Shrubs
  // Seeds for random number generator used to position shrubs. These specific seeds were chosen because they
  // produce a desirable layout. See https://github.com/phetsims/natural-selection/issues/176
  INTRO_SHRUBS_SEED: 0.5286575215756223,
  LAB_SHRUBS_SEED: 0.9578375636205664,

  // View ============================================================================================================N

  // ScreenView
  SCREEN_VIEW_X_MARGIN: 15, // margins at left and right edges of the ScreenView
  SCREEN_VIEW_Y_MARGIN: 15, // margins at top and bottom edges of the ScreenView
  SCREEN_VIEW_X_SPACING: 10, // horizontal spacing between UI components in the ScreenView
  SCREEN_VIEW_Y_SPACING: 10, // vertical spacing between UI components in the ScreenView

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
    yMargin: 4,
    touchAreaXDilation: 10,
    touchAreaYDilation: 6
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
  DIALOG_OPTIONS: {
    closeButtonTouchAreaXDilation: 20,
    closeButtonTouchAreaYDilation: 20,
    closeButtonMouseAreaXDilation: 10,
    closeButtonMouseAreaYDilation: 10
  },

  // Fonts
  CHECKBOX_FONT: new PhetFont( 16 ),
  PUSH_BUTTON_FONT: new PhetFont( 16 ),
  RADIO_BUTTON_FONT: new PhetFont( 16 ),
  INSTRUCTIONS_FONT: new PhetFont( 16 ),
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  ADD_MUTATION_GENE_FONT: new PhetFont( 16 ),
  ADD_MUTATION_COLUMN_HEADING_FONT: new PhetFont( 14 ),
  MUTATION_COMING_FONT: new PhetFont( 16 ),
  POPULATION_AXIS_FONT: new PhetFont( 14 ),
  PROPORTIONS_GENERATION_CONTROL_FONT: new PhetFont( 16 ),
  PROPORTIONS_LEGEND_FONT: new PhetFont( 16 ),
  DIALOG_FONT: new PhetFont( 16 ),

  // Scale factors for images, determined empirically and dependent on image-file sizes
  BUNNY_IMAGE_SCALE: 0.4,
  WOLF_IMAGE_SCALE: 0.5,
  SHRUB_IMAGE_SCALE: 0.5,

  // Population graph
  POPULATION_POINT_RADIUS: 2.4, // point radius, in view coordinates
  POPULATION_LINE_WIDTH: 2,  // line segment width, in view coordinates
  POPULATION_MUTANT_LINE_DASH: [ 3, 2 ],

  // Pedigree graph
  PEDIGREE_TREE_DEPTH: 4
};

assert && AssertUtils.assertRangeBetween( NaturalSelectionConstants.CLOCK_FOOD_RANGE, 0, 1 );
assert && AssertUtils.assertRangeBetween( NaturalSelectionConstants.CLOCK_WOLVES_RANGE, 0, 1 );

naturalSelection.register( 'NaturalSelectionConstants', NaturalSelectionConstants );
export default NaturalSelectionConstants;