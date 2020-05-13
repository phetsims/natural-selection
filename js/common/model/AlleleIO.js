// Copyright 2020, University of Colorado Boulder

/**
 * AlleleIO is the IO Type for Allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';

class AlleleIO extends ReferenceIO( ObjectIO ) {}

AlleleIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
AlleleIO.validator = { isValidValue: value => value instanceof Allele };
AlleleIO.typeName = 'AlleleIO';
ObjectIO.validateSubtype( AlleleIO );

naturalSelection.register( 'AlleleIO', AlleleIO );
export default AlleleIO;