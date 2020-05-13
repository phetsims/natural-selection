// Copyright 2019-2020, University of Colorado Boulder

/**
 * Graphs is an enumeration of the graph choices that are available in the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import naturalSelection from '../../naturalSelection.js';

const Graphs = Enumeration.byKeys( [ 'POPULATION', 'PROPORTIONS', 'PEDIGREE', 'NONE' ] );

naturalSelection.register( 'Graphs', Graphs );
export default Graphs;