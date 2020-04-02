// Copyright 2020, University of Colorado Boulder

/**
 * FoodIO is the IO type for Food.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Food from './Food.js';

class FoodIO extends ReferenceIO( ObjectIO ) {}

FoodIO.documentation = 'TODO';
FoodIO.validator = { isValidValue: value => value instanceof Food };
FoodIO.typeName = 'FoodIO';
ObjectIO.validateSubtype( FoodIO );

naturalSelection.register( 'FoodIO', FoodIO );
export default FoodIO;