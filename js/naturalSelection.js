// Copyright 2019-2020, University of Colorado Boulder

/**
 * Creates the namespace for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Namespace from '../../phet-core/js/Namespace.js';

const naturalSelection = new Namespace( 'naturalSelection' );

/**
 * Gets the PhET-iO element for a specified phetioID.
 * Intended to be used as a debugging method, to inspect a PhET-iO element in the console.
 * Example: phet.naturalSelection.getElement( 'naturalSelection.labScreen.model.environmentModel.bunnyGroup.bunny_0' )
 * @param {string} phetioID
 * @returns {null|PhetioObject}
 */
naturalSelection.getElement = phetioID => {
  if ( phet.phetIo ) {
    return phet.phetIo.phetioEngine.phetioObjectMap[ phetioID ];
  }
  else {
    console.log( 'PhET-iO is not initialized' );
    return undefined;
  }
};

export default naturalSelection;