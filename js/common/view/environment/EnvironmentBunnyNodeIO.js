// Copyright 2020, University of Colorado Boulder

/**
 * EnvironmentBunnyNodeIO is the IO type for EnvironmentBunnyNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../../naturalSelection.js';
import EnvironmentBunnyNode from './EnvironmentBunnyNode.js';

class EnvironmentBunnyNodeIO extends ReferenceIO( ObjectIO ) {}

EnvironmentBunnyNodeIO.documentation = 'IO Type for EnvironmentBunnyNodeIO';
EnvironmentBunnyNodeIO.validator = { isValidValue: value => value instanceof EnvironmentBunnyNode };
EnvironmentBunnyNodeIO.typeName = 'EnvironmentBunnyNodeIO';
ObjectIO.validateSubtype( EnvironmentBunnyNodeIO );

naturalSelection.register( 'EnvironmentBunnyNodeIO', EnvironmentBunnyNodeIO );
export default EnvironmentBunnyNodeIO;