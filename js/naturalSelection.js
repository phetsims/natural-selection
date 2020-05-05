// Copyright 2019-2020, University of Colorado Boulder

/**
 * Creates the namespace for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Namespace from '../../phet-core/js/Namespace.js';
import Tandem from '../../tandem/js/Tandem.js';

const naturalSelection = new Namespace( 'naturalSelection' );

/**
 * Gets the PhET-iO element for a specified phetioID.
 * Intended to be used as a debugging tool, to inspect a PhET-iO element in the console.
 * Do not use this to access elements via code!
 *
 * Example: phet.naturalSelection.getElement( 'naturalSelection.labScreen' )
 *
 * @param {string} phetioID
 * @returns {null|PhetioObject}
 */
naturalSelection.getElement = phetioID => {
  if ( Tandem.PHET_IO_ENABLED ) {
    return phet.phetio.phetioEngine.phetioObjectMap[ phetioID ];
  }
  else {
    console.warn( 'PhET-iO is not initialized' );
    return undefined;
  }
};

export default naturalSelection;