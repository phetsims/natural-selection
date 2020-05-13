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
   * Deserializes the state needed by GenotypeIO.setValue.
   * @param {Object} stateObject
   * @returns {Object}
   * @public
   * @override
   */
  static fromStateObject( stateObject ) {
    return Genotype.fromStateObject( stateObject );
  }

  /**
   * Restores Genotype state after instantiation.
   * @param {Genotype} genotype
   * @param {Object} state
   * @public
   * @override
   */
  static setValue( genotype, state ) {
    validate( genotype, this.validator );
    genotype.setValue( state );
  }
}

GenotypeIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
GenotypeIO.validator = { isValidValue: value => value instanceof Genotype };
GenotypeIO.typeName = 'GenotypeIO';
ObjectIO.validateSubtype( GenotypeIO );

naturalSelection.register( 'GenotypeIO', GenotypeIO );
export default GenotypeIO;