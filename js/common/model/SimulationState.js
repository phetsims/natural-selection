// Copyright 2020, University of Colorado Boulder

/**
 * SimulationState enumerates the states of the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const SimulationState = Enumeration.byKeys( [
  'STAGED', // the simulation is staged, but waiting for the user to take action
  'ACTIVE', // the simulation is active
  'COMPLETED' // the simulation has completed and the user is reviewing results
] );

naturalSelection.register( 'SimState', SimulationState );
export default SimulationState;