// Copyright 2020, University of Colorado Boulder

/**
 * BunnyIO is the IO type for Bunny. It is the interface that PhET-iO uses for serialization and deserialization.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import SpriteIO from './SpriteIO.js';

// NOTE: This extends SpriteIO for symmetry with the non-IO class hierarchy, but uses nothing from SpriteIO and
// could just as easily extend ObjectIO.
class BunnyIO extends SpriteIO {

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

BunnyIO.documentation = 'TODO';
BunnyIO.validator = { isValidValue: value => value instanceof Bunny };
BunnyIO.typeName = 'BunnyIO';
ObjectIO.validateSubtype( BunnyIO );

naturalSelection.register( 'BunnyIO', BunnyIO );
export default BunnyIO;