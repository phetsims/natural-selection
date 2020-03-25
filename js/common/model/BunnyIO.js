// Copyright 2020, University of Colorado Boulder

/**
 * TODO
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
    return {
      generation: NumberIO.toStateObject( bunny.generation ),
      stepsCount: NumberIO.toStateObject( bunny.stepsCount ),
      restSteps: NumberIO.toStateObject( bunny.restSteps ),
      hopSteps: NumberIO.toStateObject( bunny.hopSteps ),
      hopDelta: NullableIO( Vector3IO ).toStateObject( bunny.hopDelta )
    };
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
        generation: NumberIO.fromStateObject( stateObject.generation ),
        stepsCount: NumberIO.fromStateObject( stateObject.stepsCount ),
        restSteps: NumberIO.fromStateObject( stateObject.restSteps ),
        hopSteps: NumberIO.fromStateObject( stateObject.hopSteps ),
        hopDelta: NullableIO( Vector3IO ).fromStateObject( stateObject.hopDelta )
      }
    };
  }

  /**
   * Creates the args to PhetioGroup.createNextMember that creates Bunny instances.
   * @param state
   * @returns {Object[]}
   */
  static stateToArgsForConstructor( state ) {
    return [ state.options ];
  }

  //TODO delete this reminder later
  // static setValue( bunny, state ) {
  //   bunny.setFoobar( state.foobar );
  // }
}

BunnyIO.documentation = 'TODO';
BunnyIO.validator = { isValidValue: value => value instanceof Bunny };
BunnyIO.typeName = 'BunnyIO';
ObjectIO.validateSubtype( BunnyIO );

naturalSelection.register( 'BunnyIO', BunnyIO );
export default BunnyIO;