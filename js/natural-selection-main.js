// Copyright 2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const IntroScreen = require( 'NATURAL_SELECTION/intro/IntroScreen' );
  const LabScreen = require( 'NATURAL_SELECTION/lab/LabScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const naturalSelectionTitleString = require( 'string!NATURAL_SELECTION/natural-selection.title' );

  const simOptions = {
    //TODO #2 complete the credits
    credits: {
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Wendy Adams, Megan Hoffman, Oliver Nix, Jonathan Olson, Ariel Paul, Kathy Perkins, Noah Podolefsky, Carl Wieman',
      qualityAssurance: 'Katie Woessner',
      graphicArts: 'Megan Lai'
    }
  };

  SimLauncher.launch( () => {

    // create the sim
    const sim = new Sim( naturalSelectionTitleString, [
      new IntroScreen( Tandem.rootTandem.createTandem( 'intro' ) ),
      new LabScreen( Tandem.rootTandem.createTandem( 'lab' ) )
    ], simOptions );

    // start the sim
    sim.start();
  } );
} );