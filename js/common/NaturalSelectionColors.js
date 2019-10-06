// Copyright 2019, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  const NaturalSelectionColors = {

    SCREEN_VIEW_BACKGROUND: 'rgb( 220, 231, 184 )'
  };

  return naturalSelection.register( 'NaturalSelectionColors', NaturalSelectionColors );
} );