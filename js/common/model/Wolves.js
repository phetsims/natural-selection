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

  // strings
  const wolvesString = require( 'string!NATURAL_SELECTION/wolves' );

  class Wolves extends SelectionAgent {

    constructor() {
      super( wolvesString );
    }
  }

  return naturalSelection.register( 'Wolves', Wolves );
} );