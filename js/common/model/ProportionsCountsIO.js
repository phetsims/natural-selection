// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsCountsIO is the IO Type for ProportionsCounts.
 * It delegates most of its implementation to ProportionsCounts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import ProportionsCounts from './ProportionsCounts.js';

class ProportionsCountsIO extends ObjectIO {

  /**
   * Serializes a ProportionsCounts instance.
   * @param {ProportionsCounts} proportionsCounts
   * @returns {Object}
   * @public
   * @override
   */
  static toStateObject( proportionsCounts ) {
    validate( proportionsCounts, this.validator );
    return proportionsCounts.toStateObject();
  }

  /**
   * Deserializes a ProportionsCounts instance.
   * @param {Object} stateObject
   * @returns {ProportionsCounts}
   * @public
   * @override
   */
  static fromStateObject( stateObject ) {
    return ProportionsCounts.fromStateObject( stateObject );
  }
}

ProportionsCountsIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
ProportionsCountsIO.validator = { isValidValue: value => value instanceof ProportionsCounts };
ProportionsCountsIO.typeName = 'ProportionsCountsIO';
ObjectIO.validateSubtype( ProportionsCountsIO );

naturalSelection.register( 'ProportionsCountsIO', ProportionsCountsIO );
export default ProportionsCountsIO;