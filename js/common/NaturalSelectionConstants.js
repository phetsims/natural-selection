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

  const NaturalSelectionConstants = {

    SCREEN_VIEW_X_MARGIN: 15,
    SCREEN_VIEW_Y_MARGIN: 15

    //TODO
  };

  return naturalSelection.register( 'NaturalSelectionConstants', NaturalSelectionConstants );
} );