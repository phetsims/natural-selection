// Copyright 2019-2020, University of Colorado Boulder

/**
 * Main entry point for the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Utils from '../../scenery/js/util/Utils.js';
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

    // OrganismSprites uses WebGL, with a fallback of Canvas.
    // See https://github.com/phetsims/natural-selection/issues/128
    webgl: true,

    //TODO https://github.com/phetsims/natural-selection/issues/2 complete the credits
    credits: {
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Wendy Adams, Megan Hoffman, Oliver Nix, Jonathan Olson, Ariel Paul, Kathy Perkins, Noah Podolefsky, Carl Wieman',
      qualityAssurance: 'Logan Bray, Steele Dalton, Katie Woessner',
      graphicArts: 'Megan Lai'
    }
  } );

  // Log whether we're using WebGL, which is the preferred rendering option for OrganismSprites
  phet.log && phet.log( `using WebGL = ${phet.chipper.queryParameters.webgl && Utils.isWebGLSupported}` );

  // Log the name of the active screen, to make the console logging easier to grok.
  // unlink is not necessary.
  if ( phet.log ) {
    sim.screenProperty.link( screen =>
      phet.log && phet.log( `>>>>>> ${screen.nameProperty.value} screen is active` )
    );
  }

  sim.start();
} );