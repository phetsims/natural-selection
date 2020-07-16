// Copyright 2020, University of Colorado Boulder

/**
 * GenotypeIO is the IO Type for Genotype. It delegates most of its implementation to Genotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import Genotype from './Genotype.js';

class GenotypeIO extends ObjectIO {

  /**
   * Serializes a Genotype to a state object.
   * @param {GenotypeIO} genotype
   * @returns {Object}
   * @public
   * @override
   */
  static toStateObject( genotype ) {
    validate( genotype, this.validator );
    return genotype.toStateObject();
  }

  /**
   * Restores Genotype state after instantiation.
   * @param {Genotype} genotype
   * @param {Object} state
   * @public
   * @override
   */
  static applyState( genotype, state ) {
    validate( genotype, this.validator );
    genotype.applyState( state );
  }
}

GenotypeIO.documentation = 'IO Type for Genotype';
GenotypeIO.validator = { isValidValue: value => value instanceof Genotype };
GenotypeIO.typeName = 'GenotypeIO';
ObjectIO.validateSubtype( GenotypeIO );

naturalSelection.register( 'GenotypeIO', GenotypeIO );
export default GenotypeIO;