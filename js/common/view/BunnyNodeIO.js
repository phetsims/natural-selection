// Copyright 2020, University of Colorado Boulder

/**
 * BunnyNodeIO is the IO type for BunnyNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyNode from './BunnyNode.js';

class BunnyNodeIO extends ReferenceIO {}

BunnyNodeIO.documentation = 'TODO';
BunnyNodeIO.validator = { isValidValue: value => value instanceof BunnyNode };
BunnyNodeIO.typeName = 'BunnyNodeIO';
ObjectIO.validateSubtype( BunnyNodeIO );

naturalSelection.register( 'BunnyNodeIO', BunnyNodeIO );
export default BunnyNodeIO;