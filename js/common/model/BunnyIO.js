// Copyright 2020, University of Colorado Boulder

/**
 * BunnyIO is the IO type for Bunny. It is the interface that PhET-iO uses for serialization and deserialization.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import Vector3IO from '../../../../dot/js/Vector3IO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';

class BunnyIO extends ObjectIO {

  /**
   * Serializes a Bunny to a state object.
   *
   * @param {Bunny} bunny
   * @returns {*}
   */
  static toStateObject( bunny ) {
    validate( bunny, this.validator );
    return bunny.toStateObject();
  }

  /**
   * Deserializes the state needed by stateToArgsForConstructor.
   * @param {*} stateObject
   * @returns {*}
   */
  static fromStateObject( stateObject ) {
    return {

      // This is the options arg to Bunny constructor
      options: {
        generation: NumberIO.fromStateObject( stateObject.generation )
      },

      // This will be restored via BunnyIO.setValue, after a Bunny is instantiated.
      privateState: {
        stepsCount: NumberIO.fromStateObject( stateObject.stepsCount ),
        restSteps: NumberIO.fromStateObject( stateObject.restSteps ),
        hopSteps: NumberIO.fromStateObject( stateObject.hopSteps ),
        hopDelta: NullableIO( Vector3IO ).fromStateObject( stateObject.hopDelta )
      }
    };
  }

  /**
   * Creates the args to BunnyGroup.createNextMember that creates Bunny instances.
   * @param state
   * @returns {Object[]}
   */
  static stateToArgsForConstructor( state ) {
    assert && assert( state.options, 'missing state.options' );
    return [ state.options ];
  }

  /**
   * Restores Bunny state after instantiation.
   * @param {Bunny} bunny
   * @param {*} state
   */
  static setValue( bunny, state ) {
    assert && assert( state.privateState, 'missing state.privateState' );
    bunny.restorePrivateState( state.privateState );
  }
}

BunnyIO.documentation = 'TODO';
BunnyIO.validator = { isValidValue: value => value instanceof Bunny };
BunnyIO.typeName = 'BunnyIO';
ObjectIO.validateSubtype( BunnyIO );

naturalSelection.register( 'BunnyIO', BunnyIO );
export default BunnyIO;