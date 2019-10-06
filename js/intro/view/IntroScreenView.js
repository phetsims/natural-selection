// Copyright 2019, University of Colorado Boulder

/**
 * IntroView is the view for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const IntroViewProperties = require( 'NATURAL_SELECTION/intro/view/IntroViewProperties' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionScreenView = require( 'NATURAL_SELECTION/common/view/NaturalSelectionScreenView' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class IntroScreenView extends NaturalSelectionScreenView {

    /**
     * @param {IntroModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      const viewProperties = new IntroViewProperties();

      const traits = [
        { label: whiteFurString, property: viewProperties.populationWhiteFurVisibleProperty },
        { label: brownFurString, property: viewProperties.populationBrownFurVisibleProperty }
      ];

      const alleles = [
        { label: furString, property: viewProperties.furAllelesVisibleProperty }
      ];

      super( model, viewProperties, traits, alleles, tandem );

      //TODO

      // @private
      this.viewProperties = viewProperties;
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.viewProperties.reset();
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {
      super.step( dt );
      //TODO
    }
  }

  return naturalSelection.register( 'IntroScreenView', IntroScreenView );
} );