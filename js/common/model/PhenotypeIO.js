// Copyright 2020, University of Colorado Boulder

/**
 * PhenotypeIO is the IO Type for Phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Phenotype from './Phenotype.js';

class PhenotypeIO extends ObjectIO {

  /**
   * Serializes a Genotype to a state object.
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
   * Deserializes the state needed by PhenotypeIO.setValue.
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
  static setValue( phenotype, state ) {
    validate( phenotype, this.validator );
    phenotype.setValue( state );
  }
}

PhenotypeIO.documentation = 'TODO';
PhenotypeIO.validator = { isValidValue: value => value instanceof Phenotype };
PhenotypeIO.typeName = 'PhenotypeIO';
ObjectIO.validateSubtype( PhenotypeIO );

naturalSelection.register( 'PhenotypeIO', PhenotypeIO );
export default PhenotypeIO;