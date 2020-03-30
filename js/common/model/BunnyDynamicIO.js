// Copyright 2020, University of Colorado Boulder

/**
 * BunnyDynamicIO is the IO type for Bunny instances that are dynamically created by BunnyGroup.
 * It is the interface that PhET-iO uses for serialization and deserialization.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import SpriteIO from './SpriteIO.js';

// NOTE: This extends SpriteIO for symmetry with the non-IO class hierarchy, but uses nothing from SpriteIO and
// would work if it extends ObjectIO.
class BunnyDynamicIO extends SpriteIO {

  /**
   * Serializes a Bunny to a state object.
   *
   * @param {Bunny} bunny
   * @returns {Object}
   */
  static toStateObject( bunny ) {
    validate( bunny, this.validator );
    return bunny.toStateObject();
  }

  /**
   * Deserializes the state needed by stateToArgsForConstructor.
   * @param {Object} stateObject
   * @returns {Object}
   */
  static fromStateObject( stateObject ) {
    return Bunny.fromStateObject( stateObject );
  }

  /**
   * Creates the args to BunnyGroup.createNextMember that creates Bunny instances.
   * @param state
   * @returns {Object[]}
   */
  static stateToArgsForConstructor( state ) {
    return Bunny.stateToArgsForConstructor( state );
  }

  /**
   * Restores Bunny state after instantiation.
   * @param {Bunny} bunny
   * @param {Object} state
   */
  static setValue( bunny, state ) {
    bunny.setValue( state );
  }
}

BunnyDynamicIO.documentation = 'TODO';
BunnyDynamicIO.validator = { isValidValue: value => value instanceof Bunny };
BunnyDynamicIO.typeName = 'BunnyDynamicIO';
ObjectIO.validateSubtype( BunnyDynamicIO );

naturalSelection.register( 'BunnyDynamicIO', BunnyDynamicIO );
export default BunnyDynamicIO;