// Copyright 2020, University of Colorado Boulder

/**
 * BunnyIO is the IO Type for Bunny. It delegates most of its implementation to Bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';

class BunnyIO extends ObjectIO {

  /**
   * Serializes a Bunny instance.
   * @param {Bunny} bunny
   * @returns {Object}
   * @public
   * @override
   */
  static toStateObject( bunny ) {
    validate( bunny, this.validator );
    return bunny.toStateObject();
  }

  /**
   * Deserializes a Bunny instance.
   * @param {Object} stateObject
   * @returns {Object}
   * @public
   * @override
   */
  static fromStateObject( stateObject ) {
    return Bunny.fromStateObject( stateObject );
  }

  /**
   * Creates the args to BunnyGroup.createNextElement that creates Bunny instances.
   * @param state
   * @returns {Object[]}
   * @public
   * @override
   */
  static stateToArgsForConstructor( state ) {
    return Bunny.stateToArgsForConstructor( state );
  }

  /**
   * Restores Bunny state after instantiation.
   * @param {Bunny} bunny
   * @param {Object} state
   * @public
   * @override
   */
  static setValue( bunny, state ) {
    validate( bunny, this.validator );
    bunny.setValue( state );
  }
}

BunnyIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
BunnyIO.validator = { isValidValue: value => value instanceof Bunny };
BunnyIO.typeName = 'BunnyIO';
ObjectIO.validateSubtype( BunnyIO );

naturalSelection.register( 'BunnyIO', BunnyIO );
export default BunnyIO;