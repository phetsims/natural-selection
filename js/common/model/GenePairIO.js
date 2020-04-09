// Copyright 2020, University of Colorado Boulder

/**
 * GenePairIO is the IO type for GenePair.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import GenePair from './GenePair.js';

class GenePairIO extends ObjectIO {

  /**
   * Serializes a GenePair to a state object.
   * @param {GenePairIO} genePair
   * @returns {Object}
   */
  static toStateObject( genePair ) {
    validate( genePair, this.validator );
    return genePair.toStateObject();
  }

  /**
   * Deserializes the state needed by GenePairIO.setValue.
   * @param {Object} stateObject
   * @returns {Object}
   */
  static fromStateObject( stateObject ) {
    return GenePair.fromStateObject( stateObject );
  }

  /**
   * Restores GenePair state after instantiation.
   * @param {GenePair} genePair
   * @param {Object} state
   */
  static setValue( genePair, state ) {
    validate( genePair, this.validator );
    genePair.setValue( state );
  }
}

GenePairIO.documentation = 'TODO';
GenePairIO.validator = { isValidValue: value => value instanceof GenePair };
GenePairIO.typeName = 'GenePairIO';
ObjectIO.validateSubtype( GenePairIO );

naturalSelection.register( 'GenePairIO', GenePairIO );
export default GenePairIO;