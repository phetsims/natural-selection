// Copyright 2020, University of Colorado Boulder

/**
 * GenePairIO is the IO Type for GenePair. It delegates most of its implementation to GenePair.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import GenePair from './GenePair.js';

class GenePairIO extends ObjectIO {

  /**
   * Serializes a GenePair instance.
   * @param {GenePair} genePair
   * @returns {Object}
   * @public
   * @override
   */
  static toStateObject( genePair ) {
    validate( genePair, this.validator );
    return genePair.toStateObject();
  }

  /**
   * Deserializes a GenePair instance.
   * @param {Object} stateObject
   * @returns {Object}
   * @public
   * @override
   */
  static fromStateObject( stateObject ) {
    return GenePair.fromStateObject( stateObject );
  }

  /**
   * Restores GenePair state after instantiation.
   * @param {GenePair} genePair
   * @param {Object} state
   * @public
   * @override
   */
  static applyState( genePair, state ) {
    validate( genePair, this.validator );
    genePair.applyState( state );
  }
}

GenePairIO.documentation = 'IO Type for GenePair';
GenePairIO.validator = { isValidValue: value => value instanceof GenePair };
GenePairIO.typeName = 'GenePairIO';
ObjectIO.validateSubtype( GenePairIO );

naturalSelection.register( 'GenePairIO', GenePairIO );
export default GenePairIO;