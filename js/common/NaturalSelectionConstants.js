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
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
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

    // ViewportNode
    VIEWPORT_NODE_X_MARGIN: 8, // margins at left and right edges of the viewport
    VIEWPORT_NODE_Y_MARGIN: 8, // margins at top and bottom edges of the viewport

    CORNER_RADIUS: CORNER_RADIUS,

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
      fill: NaturalSelectionColors.PANEL_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    },

    // RectangularPushButton
    RECTANGULAR_PUSH_BUTTON_OPTIONS: {
      cornerRadius: CORNER_RADIUS
    },

    // VBox
    VBOX_OPTIONS: {
      spacing: 9,
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