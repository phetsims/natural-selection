// Copyright 2019, University of Colorado Boulder

/**
 * Colors used in this sim.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  const PANEL_STROKE = 'rgb( 180, 190, 140 )'; // darker version of SCREEN_VIEW_BACKGROUND

  const NaturalSelectionColors = {

    // ScreenView
    SCREEN_VIEW_BACKGROUND: 'rgb( 220, 231, 184 )',

    // ViewportNode
    VIEWPORT_NODE_STROKE: PANEL_STROKE,

    // traits
    FUR: '#1b9e77', // green
    EARS: '#d95f02', // red
    TEETH: '#7570b3', // purple

    // Panels
    PANEL_FILL: 'white',
    PANEL_STROKE: PANEL_STROKE,
    SEPARATOR_STROKE: 'rgb( 200, 200, 200 )',

    // Push buttons
    ADD_A_MATE_BUTTON: PhetColorScheme.BUTTON_YELLOW,
    CANCEL_BUTTON: PhetColorScheme.BUTTON_YELLOW,
    ZOOM_BUTTONS: 'white',
    ARROW_BUTTONS: 'white',
    MUTATION_BUTTONS: 'rgb( 203, 203, 203 )',

    // Radio buttons
    RADIO_BUTTON_SELECTED_STROKE: 'rgb( 254, 225, 5 )',
    EQUATOR_BUTTON_FILL: 'rgb( 207, 125, 66 )',
    ARCTIC_BUTTON_FILL: 'rgb( 54, 137, 239 )',

    // graphs
    GRAPHS_STROKE: PANEL_STROKE,
    TOTAL_POPULATION: 'black'
  };

  return naturalSelection.register( 'NaturalSelectionColors', NaturalSelectionColors );
} );