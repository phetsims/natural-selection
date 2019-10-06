// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants

  // For things with a corner radius
  const CORNER_RADIUS = 5;

  // for all panel-like containers
  const PANEL_X_MARGIN = 15;
  const PANEL_Y_MARGIN = 10;

  const NaturalSelectionConstants = {

    // ScreenView
    SCREEN_VIEW_X_MARGIN: 15, // margins at left and right edges of the ScreenView
    SCREEN_VIEW_Y_MARGIN: 15, // margins at top and bottom edges of the ScreenView
    SCREEN_VIEW_X_SPACING: 15, // horizontal spacing between UI components in the ScreenView
    SCREEN_VIEW_Y_SPACING: 15, // vertical spacing between UI components in the ScreenView

    // WorldNode
    WORLD_NODE_X_MARGIN: 8, // margins at left and right edges of the WorldNode
    WORLD_NODE_Y_MARGIN: 8, // margins at top and bottom edges of the WorldNode

    // VerticalAquaRadioButtonGroup
    AQUA_RADIO_BUTTON_OPTIONS: {
      radius: 8,
      xSpacing: 10,
      spacing: 12
    },

    // Checkbox
    CHECKBOX_OPTIONS: {
      spacing: 4,
      boxWidth: 16
    },

    // Panel
    PANEL_OPTIONS: {
      align: 'left',
      cornerRadius: CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
      fill: 'white',
      stroke: 'black'
    },

    // RectangularPushButton
    PUSH_BUTTON_OPTIONS: {
      cornerRadius: CORNER_RADIUS,
      xMargin: 8,
      yMargin: 4
    },

    // RadioButtonGroup
    RADIO_BUTTON_GROUP_OPTIONS: {
      orientation: 'horizontal',
      spacing: 8,
      cornerRadius: CORNER_RADIUS,
      selectedLineWidth: 1.5,
      deselectedLineWidth: 1,
      deselectedButtonOpacity: 0.35,
      buttonContentXMargin: 8,
      buttonContentYMargin: 8
    },

    // VBox
    VBOX_OPTIONS: {
      spacing: 8,
      align: 'left'
    },

    // Fonts
    CHECKBOX_FONT: new PhetFont( 16 ),
    PUSH_BUTTON_FONT: new PhetFont( 16 ),
    RADIO_BUTTON_FONT: new PhetFont( 16 ),
    TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } )
  };

  return naturalSelection.register( 'NaturalSelectionConstants', NaturalSelectionConstants );
} );