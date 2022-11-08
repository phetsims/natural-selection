// Copyright 2019-2022, University of Colorado Boulder

/**
 * Main entry point for the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { Utils } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import NaturalSelectionStrings from './NaturalSelectionStrings.js';

simLauncher.launch( () => {

  const screens = [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ];

  const sim = new Sim( NaturalSelectionStrings[ 'natural-selection' ].titleStringProperty, screens, {

    // OrganismSprites uses WebGL, with a fallback of Canvas.
    // See https://github.com/phetsims/natural-selection/issues/128
    webgl: true,

    credits: {
      leadDesign: 'Amanda McGarry, Noah Podolefsky',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.), Jonathan Olson',
      team: 'Wendy Adams, Megan Hoffman, Oliver Nix, Ariel Paul, Kathy Perkins, Carl Wieman',
      qualityAssurance: 'Logan Bray, Steele Dalton, Brooklyn Lash, Emily Miller, Liam Mulhall, Devon Quispe, Nancy Salpepi, Kathryn Woessner',
      graphicArts: 'Megan Lai'
    },

    // phet-io options
    phetioDesigned: true
  } );

  // Log whether we're using WebGL, which is the preferred rendering option for OrganismSprites
  phet.log && phet.log( `using WebGL = ${phet.chipper.queryParameters.webgl && Utils.isWebGLSupported}` );

  // Log the name of the active screen, to make the console logging easier to grok.
  // unlink is not necessary.
  if ( phet.log ) {
    sim.selectedScreenProperty.link( screen =>
      phet.log && phet.log( `>>>>>> ${screen.nameProperty.value} screen is active` )
    );
  }

  sim.start();
} );