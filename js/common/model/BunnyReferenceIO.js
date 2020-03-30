// Copyright 2020, University of Colorado Boulder

/**
 * BunnyReferenceIO is the IO Type for references to Bunny instances.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';

class BunnyReferenceIO extends ReferenceIO {}

BunnyReferenceIO.documentation = 'TODO';
BunnyReferenceIO.validator = { isValidValue: value => value instanceof Bunny };
BunnyReferenceIO.typeName = 'BunnyReferenceIO';
ObjectIO.validateSubtype( BunnyReferenceIO );

naturalSelection.register( 'BunnyReferenceIO', BunnyReferenceIO );
export default BunnyReferenceIO;