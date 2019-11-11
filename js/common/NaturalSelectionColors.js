// Copyright 2019, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  const NaturalSelectionColors = {

    SCREEN_VIEW_BACKGROUND: 'rgb( 220, 231, 184 )',

    WORLD_NODE_STROKE: 'rgb( 190, 200, 150 )', // darker version of SCREEN_VIEW_BACKGROUND

    // traits
    FUR: '#1b9e77', // green
    EARS: '#d95f02', // red
    TEETH: '#7570b3', // purple

    // Panels
    PANEL_FILL: 'white',
    PANEL_STROKE: 'rgb( 150, 160, 110 )', // much darker version of SCREEN_VIEW_BACKGROUND
    SEPARATOR_STROKE: 'rgb( 200, 200, 200 )',

    // buttons
    ADD_A_MATE_BUTTON: PhetColorScheme.BUTTON_YELLOW,
    CANCEL_BUTTON: PhetColorScheme.BUTTON_YELLOW,
    ZOOM_BUTTONS: 'rgb( 203, 203, 203 )',
    MUTATION_BUTTONS: 'rgb( 203, 203, 203 )',

    // Graphs
    GRAPHS_STROKE: 'rgb( 190, 200, 150 )', // darker version of SCREEN_VIEW_BACKGROUND
    TOTAL_POPULATION: 'black'
  };

  return naturalSelection.register( 'NaturalSelectionColors', NaturalSelectionColors );
} );