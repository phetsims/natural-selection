// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );

  // constants

  // For things with a corner radius
  const CORNER_RADIUS = 5;

  const NaturalSelectionConstants = {

    // Model ===========================================================================================================

    // number of bunnies required to 'take over the world'
    MAX_BUNNIES: 1000,

    // clock
    SECONDS_PER_GENERATION: 10,
    SECONDS_PER_STEP: 0.1, // dt for when the Step button is pressed, in seconds

    // View ============================================================================================================

    // ScreenView
    SCREEN_VIEW_X_MARGIN: 15, // margins at left and right edges of the ScreenView
    SCREEN_VIEW_Y_MARGIN: 15, // margins at top and bottom edges of the ScreenView
    SCREEN_VIEW_X_SPACING: 15, // horizontal spacing between UI components in the ScreenView
    SCREEN_VIEW_Y_SPACING: 15, // vertical spacing between UI components in the ScreenView

    // ViewportNode
    VIEWPORT_NODE_SIZE: new Dimension2( 770, 310 ),
    VIEWPORT_HORIZON_Y: 95, // where the horizon is, determined empirically from background PNG files //TODO move to model
    VIEWPORT_NODE_X_MARGIN: 15, // margins at left and right edges of the viewport
    VIEWPORT_NODE_Y_MARGIN: 15, // margins at top and bottom edges of the viewport

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
    DIALOG_CONTENT_SCALE: 0.75, //TODO to compensate for https://github.com/phetsims/joist/issues/586

    // Fonts
    CHECKBOX_FONT: new PhetFont( 16 ),
    PUSH_BUTTON_FONT: new PhetFont( 16 ),
    RADIO_BUTTON_FONT: new PhetFont( 16 ),
    TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
    ADD_MUTATION_TRAIT_FONT: new PhetFont( 16 ),
    ADD_MUTATION_COLUMN_HEADING_FONT: new PhetFont( 14 ),
    MUTATION_COMING_FONT: new PhetFont( 16 ),
    POPULATION_AXIS_FONT: new PhetFont( 14 ),
    PROPORTIONS_GENERATION_CONTROL_FONT: new PhetFont( 16 ),
    PROPORTIONS_LEGEND_FONT: new PhetFont( 16 ),
    DIALOG_FONT: new PhetFont( 16 )
  };

  return naturalSelection.register( 'NaturalSelectionConstants', NaturalSelectionConstants );
} );