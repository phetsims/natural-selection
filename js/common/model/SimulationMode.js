// Copyright 2020, University of Colorado Boulder

/**
 * SimulationMode enumerates the simulation modes. The mode determines which UI components are available,
 * whether the clock is running, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const SimulationMode = Enumeration.byKeys( [
  'STAGED', // the simulation is staged, but waiting for the user press 'Add a Mate' or 'Play' button
  'ACTIVE', // the simulation is active
  'COMPLETED' // the simulation has completed and the user is reviewing results
] );

naturalSelection.register( 'SimulationMode', SimulationMode );
export default SimulationMode;