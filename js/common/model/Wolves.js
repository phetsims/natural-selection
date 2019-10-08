// Copyright 2019, University of Colorado Boulder

/**
 * TODO
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const SelectionAgent = require( 'NATURAL_SELECTION/common/model/SelectionAgent' );

  // images
  const wolfIcon = require( 'image!NATURAL_SELECTION/wolfIcon.png' );

  // strings
  const wolvesString = require( 'string!NATURAL_SELECTION/wolves' );

  class Wolves extends SelectionAgent {

    constructor() {
      super( wolvesString, wolfIcon );
    }
  }

  return naturalSelection.register( 'Wolves', Wolves );
} );