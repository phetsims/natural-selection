// Copyright 2020, University of Colorado Boulder

/**
 * BunnyIO is the IO type for Bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';

class BunnyIO extends ObjectIO {

  /**
   * Serializes a Bunny to a state object.
   *
   * @param {Bunny} bunny
   * @returns {Object}
   */
  static toStateObject( bunny ) {
    validate( bunny, this.validator ); //TODO how is this better than assert instanceof ?
    return bunny.toStateObject();
  }

  /**
   * Deserializes the state needed by stateToArgsForConstructor and setValue.
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
    validate( bunny, this.validator );
    bunny.setValue( state );
  }
}

BunnyIO.documentation = 'TODO';
BunnyIO.validator = { isValidValue: value => value instanceof Bunny };
BunnyIO.typeName = 'BunnyIO';
ObjectIO.validateSubtype( BunnyIO );

naturalSelection.register( 'BunnyIO', BunnyIO );
export default BunnyIO;