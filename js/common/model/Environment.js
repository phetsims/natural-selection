// Copyright 2019-2022, University of Colorado Boulder

/**
 * Environment is an enumeration of the environments where the bunnies may live.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import naturalSelection from '../../naturalSelection.js';

const Environment = EnumerationDeprecated.byKeys( [ 'EQUATOR', 'ARCTIC' ] );

naturalSelection.register( 'Environment', Environment );
export default Environment;