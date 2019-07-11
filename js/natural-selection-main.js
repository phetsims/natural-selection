// Copyright 2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const NaturalSelectionScreen = require( 'NATURAL_SELECTION/natural-selection/NaturalSelectionScreen' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const naturalSelectionTitleString = require( 'string!NATURAL_SELECTION/natural-selection.title' );

  const simOptions = {
    credits: {
      //TODO #2 fill in credits
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  // launch the sim - beware that scenery Image nodes created outside of SimLauncher.launch() will have zero bounds
  // until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
  SimLauncher.launch( () => {
    const sim = new Sim( naturalSelectionTitleString, [
      new NaturalSelectionScreen( Tandem.rootTandem.createTandem( 'naturalSelectionScreen' ) )
    ], simOptions );
    sim.start();
  } );
} );