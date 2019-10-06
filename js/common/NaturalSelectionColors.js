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

    SCREEN_VIEW_BACKGROUND: 'rgb( 220, 231, 184 )',

    WORLD_NODE_STROKE: 'rgb( 190, 200, 150 )' // darker version of SCREEN_VIEW_BACKGROUND
  };

  return naturalSelection.register( 'NaturalSelectionColors', NaturalSelectionColors );
} );