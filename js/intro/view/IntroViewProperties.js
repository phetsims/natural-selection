// Copyright 2019, University of Colorado Boulder

/**
 * IntroViewProperties contains view-specific Properties for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionViewProperties = require( 'NATURAL_SELECTION/common/view/NaturalSelectionViewProperties' );

  class IntroViewProperties extends NaturalSelectionViewProperties {

    constructor() {
      super();
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      //TODO
    }
  }

  return naturalSelection.register( 'IntroViewProperties', IntroViewProperties );
} );