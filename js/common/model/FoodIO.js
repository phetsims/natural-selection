// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Food from './Food.js';
import SpriteIO from './SpriteIO.js';

class FoodIO extends SpriteIO {}

FoodIO.documentation = 'TODO';
FoodIO.validator = { isValidValue: value => value instanceof Food };
FoodIO.typeName = 'FoodIO';
ObjectIO.validateSubtype( FoodIO );

naturalSelection.register( 'FoodIO', FoodIO );
export default FoodIO;