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
  const toughFoodString = require( 'string!NATURAL_SELECTION/toughFood' );

  class ToughFood extends SelectionAgent {

    constructor() {
      super( toughFoodString );
    }
  }

  return naturalSelection.register( 'ToughFood', ToughFood );
} );