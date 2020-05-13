// Copyright 2020, University of Colorado Boulder

/**
 * WolfIO is the IO Type for Wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Wolf from './Wolf.js';

class WolfIO extends ReferenceIO( ObjectIO ) {}

WolfIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
WolfIO.validator = { isValidValue: value => value instanceof Wolf };
WolfIO.typeName = 'WolvesIO';
ObjectIO.validateSubtype( WolfIO );

naturalSelection.register( 'WolfIO', WolfIO );
export default WolfIO;