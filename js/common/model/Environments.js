// Copyright 2019, University of Colorado Boulder

/**
 * Environments is an enumeration of the abiotic environments where the bunnies may live.
 * The abiotic environment includes the non-living chemical and physical parts of an environment,
 * e.g. water, light, radiation, temperature, humidity, atmosphere, acidity, and soil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const Environments = Enumeration.byKeys( [ 'EQUATOR', 'ARCTIC' ] );

naturalSelection.register( 'Environments', Environments );
export default Environments;