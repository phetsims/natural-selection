// Copyright 2019-2020, University of Colorado Boulder

/**
 * Environment is an enumeration of the environments where the bunnies may live.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const Environment = Enumeration.byKeys( [ 'EQUATOR', 'ARCTIC' ] );

naturalSelection.register( 'Environment', Environment );
export default Environment;