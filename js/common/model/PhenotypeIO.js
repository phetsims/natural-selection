// Copyright 2020, University of Colorado Boulder

/**
 * PhenotypeIO is the IO Type for Phenotype. It delegates most of its implementation to Phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Phenotype from './Phenotype.js';

class PhenotypeIO extends ObjectIO {

  /**
   * Serializes a Phenotype instance.
   * @param {PhenotypeIO} phenotype
   * @returns {Object}
   * @public
   * @override
   */
  static toStateObject( phenotype ) {
    validate( phenotype, this.validator );
    return phenotype.toStateObject();
  }

  /**
   * Deserializes a Phenotype instance.
   * @param {Object} stateObject
   * @returns {Object}
   * @public
   * @override
   */
  static fromStateObject( stateObject ) {
    return Phenotype.fromStateObject( stateObject );
  }

  /**
   * Restores Phenotype state after instantiation.
   * @param {Phenotype} phenotype
   * @param {Object} state
   * @public
   * @override
   */
  static applyState( phenotype, state ) {
    validate( phenotype, this.validator );
    phenotype.applyState( state );
  }
}

PhenotypeIO.documentation = 'IO Type for Phenotype';
PhenotypeIO.validator = { isValidValue: value => value instanceof Phenotype };
PhenotypeIO.typeName = 'PhenotypeIO';
ObjectIO.validateSubtype( PhenotypeIO );

naturalSelection.register( 'PhenotypeIO', PhenotypeIO );
export default PhenotypeIO;