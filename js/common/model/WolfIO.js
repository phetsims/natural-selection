// Copyright 2020, University of Colorado Boulder

//TODO delete if not needed
/**
 * WolfIO is the IO type for an individual wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import SpriteIO from './SpriteIO.js';
import Wolf from './Wolf.js';

class WolfIO extends SpriteIO {}

WolfIO.documentation = 'TODO';
WolfIO.validator = { isValidValue: value => value instanceof Wolf };
WolfIO.typeName = 'WolvesIO';
ObjectIO.validateSubtype( WolfIO );

naturalSelection.register( 'WolvesIO', WolfIO );
export default WolfIO;