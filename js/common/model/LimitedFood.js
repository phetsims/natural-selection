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

  class LimitedFood extends SelectionAgent {

    constructor() {
      super();
    }
  }

  return naturalSelection.register( 'LimitedFood', LimitedFood );
} );