// Copyright 2019, University of Colorado Boulder

/**
 * IntroViewProperties contains view-specific Properties for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionViewProperties = require( 'NATURAL_SELECTION/common/view/NaturalSelectionViewProperties' );

  class IntroViewProperties extends NaturalSelectionViewProperties {

    constructor() {
      super();

      // @public visibility of traits on the Population graph
      this.populationWhiteFurVisibleProperty = new BooleanProperty( false );
      this.populationBrownFurVisibleProperty = new BooleanProperty( false );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.populationWhiteFurVisibleProperty.reset();
      this.populationBrownFurVisibleProperty.reset();
    }
  }

  return naturalSelection.register( 'IntroViewProperties', IntroViewProperties );
} );