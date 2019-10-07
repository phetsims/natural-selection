// Copyright 2019, University of Colorado Boulder

/**
 * SelectionAgent is the base class for all selection agents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class SelectionAgent {

    /**
     * @param {string} displayName - translated name, visible to the user
     * @param {HTMLImageElement} icon - icons used to represent the selection element on UI controls
     */
    constructor( displayName, icon ) {

      // @public (read-only)
      this.displayName = displayName;

      // @public (read-only)
     this.icon = icon;

      // @public
      this.enabledProperty = new BooleanProperty( false );
    }

    /**
     * @public
     */
    reset() {
      this.enabledProperty.reset();
    }
  }

  return naturalSelection.register( 'SelectionAgent', SelectionAgent );
} );