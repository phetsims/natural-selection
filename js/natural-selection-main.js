// Copyright 2019-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import naturalSelectionStrings from './natural-selection-strings.js';

const naturalSelectionTitleString = naturalSelectionStrings[ 'natural-selection' ].title;

const simOptions = {
  //TODO https://github.com/phetsims/natural-selection/issues/2 complete the credits
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
    team: 'Wendy Adams, Megan Hoffman, Oliver Nix, Jonathan Olson, Ariel Paul, Kathy Perkins, Noah Podolefsky, Carl Wieman',
    qualityAssurance: 'Katie Woessner',
    graphicArts: 'Megan Lai'
  }
};

SimLauncher.launch( () => {
  const screens = [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ];
  const sim = new Sim( naturalSelectionTitleString, screens, simOptions );
  sim.start();
} );