// Copyright 2020-2022, University of Colorado Boulder

/**
 * SimulationMode enumerates the simulation modes. The mode determines which UI components are available,
 * whether the clock is running, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import naturalSelection from '../../naturalSelection.js';

export default class SimulationMode extends EnumerationValue {

  // the simulation is staged, but waiting for the user press 'Add a Mate' or 'Play' button
  public static readonly STAGED = new SimulationMode();

  // the simulation is active
  public static readonly ACTIVE = new SimulationMode();

  // the simulation has completed and the user is reviewing results
  public static readonly COMPLETED = new SimulationMode();

  public static readonly enumeration = new Enumeration( SimulationMode );
}

naturalSelection.register( 'SimulationMode', SimulationMode );