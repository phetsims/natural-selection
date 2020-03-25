// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Sprite from './Sprite.js';

class SpriteIO extends ReferenceIO {}

SpriteIO.documentation = 'TODO';
SpriteIO.validator = { isValidValue: value => value instanceof Sprite };
SpriteIO.typeName = 'SpriteIO';
ObjectIO.validateSubtype( SpriteIO );

naturalSelection.register( 'SpriteIO', SpriteIO );
export default SpriteIO;