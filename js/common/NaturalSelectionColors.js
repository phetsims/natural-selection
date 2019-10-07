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

    ADD_A_MATE_BUTTON: PhetColorScheme.BUTTON_YELLOW,

    TOTAL_GRAPH_COLOR: 'black',
    FUR_GRAPH_COLOR: '#1b9e77', // green
    EARS_GRAPH_COLOR: '#d95f02', // red
    TEETH_GRAPH_COLOR: '#7570b3' // purple
  };

  return naturalSelection.register( 'NaturalSelectionColors', NaturalSelectionColors );
} );