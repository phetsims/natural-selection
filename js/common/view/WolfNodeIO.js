// Copyright 2020, University of Colorado Boulder

/**
 * WolfNodeIO is the IO type for WolfNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import WolfNode from './WolfNode.js';

class WolfNodeIO extends ReferenceIO( ObjectIO ) {}

WolfNodeIO.documentation = 'IO Type for WolfNode';
WolfNodeIO.validator = { isValidValue: value => value instanceof WolfNode };
WolfNodeIO.typeName = 'WolfNodeIO';
ObjectIO.validateSubtype( WolfNodeIO );

naturalSelection.register( 'WolfNodeIO', WolfNodeIO );
export default WolfNodeIO;