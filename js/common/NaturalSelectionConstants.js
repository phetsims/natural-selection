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

  const NaturalSelectionConstants = {

    SCREEN_VIEW_X_MARGIN: 15,
    SCREEN_VIEW_Y_MARGIN: 15,

    WORLD_NODE_X_MARGIN: 8,
    WORLD_NODE_Y_MARGIN: 8,

    CHECKBOX_OPTIONS: {
      //TODO
    },

    PUSH_BUTTON_OPTIONS: {
      //TODO
    },

    RADIO_BUTTON_GROUP_OPTIONS: {
      //TODO
    },

    // Fonts
    CHECKBOX_FONT: new PhetFont( 14 ),
    PUSH_BUTTON_FONT: new PhetFont( 14 )
  };

  return naturalSelection.register( 'NaturalSelectionConstants', NaturalSelectionConstants );
} );