// Copyright 2020, University of Colorado Boulder

/**
 * BunnyArrayIO is the IO Type for BunnyArray.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArrayIO from '../../../../axon/js/ObservableArrayIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyArray from './BunnyArray.js';
import BunnyIO from './BunnyIO.js';

class BunnyArrayIO extends ObservableArrayIO( ReferenceIO( BunnyIO ) ) {}

BunnyArrayIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
BunnyArrayIO.validator = { isValidValue: value => value instanceof BunnyArray };
BunnyArrayIO.typeName = 'BunnyArrayIO';
ObjectIO.validateSubtype( BunnyArrayIO );

naturalSelection.register( 'BunnyArrayIO', BunnyArrayIO );
export default BunnyArrayIO;