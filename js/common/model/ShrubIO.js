// Copyright 2020, University of Colorado Boulder

/**
 * ShrubIO is the IO Type for Shrub.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Shrub from './Shrub.js';

class ShrubIO extends ReferenceIO( ObjectIO ) {}

ShrubIO.documentation = 'TODO';
ShrubIO.validator = { isValidValue: value => value instanceof Shrub };
ShrubIO.typeName = 'ShrubIO';
ObjectIO.validateSubtype( ShrubIO );

naturalSelection.register( 'ShrubIO', ShrubIO );
export default ShrubIO;