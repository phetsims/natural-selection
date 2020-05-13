// Copyright 2019-2020, University of Colorado Boulder

/**
 * GraphChoice is an enumeration of the graph choices that are available.
 * The user selects one of these choices via GraphChoiceRadioButtonGroup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const GraphChoice = Enumeration.byKeys( [ 'POPULATION', 'PROPORTIONS', 'PEDIGREE', 'NONE' ] );

naturalSelection.register( 'GraphChoice', GraphChoice );
export default GraphChoice;