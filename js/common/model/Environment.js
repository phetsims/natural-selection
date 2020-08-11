// Copyright 2019-2020, University of Colorado Boulder

/**
 * Environment is an enumeration of the abiotic environments where the bunnies may live.
 * The abiotic environment includes the non-living chemical and physical parts of an environment,
 * e.g. water, light, radiation, temperature, humidity, atmosphere, acidity, and soil.
 * The user selects one of these via EnvironmentRadioButtonGroup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const Environment = Enumeration.byKeys( [ 'EQUATOR', 'ARCTIC' ] );

naturalSelection.register( 'Environment', Environment );
export default Environment;