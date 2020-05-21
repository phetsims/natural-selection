// Copyright 2019-2020, University of Colorado Boulder

/**
 * Main entry point for the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import naturalSelectionStrings from './naturalSelectionStrings.js';

simLauncher.launch( () => {

  const screens = [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ];

  const sim = new Sim( naturalSelectionStrings[ 'natural-selection' ].title, screens, {

    //TODO https://github.com/phetsims/natural-selection/issues/2 complete the credits
    credits: {
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Wendy Adams, Megan Hoffman, Oliver Nix, Jonathan Olson, Ariel Paul, Kathy Perkins, Noah Podolefsky, Carl Wieman',
      qualityAssurance: 'Katie Woessner',
      graphicArts: 'Megan Lai'
    }
  } );

  sim.start();
} );