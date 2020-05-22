// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsDataIO is the IO Type for ProportionsData.
 * It delegates most of its implementation to ProportionsData.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import ProportionsData from './ProportionsData.js';

class ProportionsDataIO extends ObjectIO {

  /**
   * Serializes a ProportionsData instance.
   * @param {ProportionsData} proportionsData
   * @returns {Object}
   * @public
   * @override
   */
  static toStateObject( proportionsData ) {
    validate( proportionsData, this.validator );
    return proportionsData.toStateObject();
  }

  /**
   * Deserializes a ProportionsData instance.
   * @param {Object} stateObject
   * @returns {ProportionsData}
   * @public
   * @override
   */
  static fromStateObject( stateObject ) {
    return ProportionsData.fromStateObject( stateObject );
  }
}

ProportionsDataIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
ProportionsDataIO.validator = { isValidValue: value => value instanceof ProportionsData };
ProportionsDataIO.typeName = 'ProportionsDataIO';
ObjectIO.validateSubtype( ProportionsDataIO );

naturalSelection.register( 'ProportionsDataIO', ProportionsDataIO );
export default ProportionsDataIO;