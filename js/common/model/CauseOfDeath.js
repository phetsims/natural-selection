// Copyright 2020, University of Colorado Boulder

/**
 * CauseOfDeath enumerates the possible causes of death for a Bunny.  This is used internally, for debugging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const CauseOfDeath = Enumeration.byKeys( [ 'OLD_AGE', 'WOLF', 'TOUGH_FOOD', 'LIMITED_FOOD', 'TOUGH_LIMITED_FOOD' ] );

naturalSelection.register( 'CauseOfDeath', CauseOfDeath );
export default CauseOfDeath;