// Copyright 2020, University of Colorado Boulder

/**
 * Phenotype describes the appearance of a Bunny, how its genotype manifests.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import AlleleInstances from './AlleleInstances.js';
import AlleleIO from './AlleleIO.js';
import Genotype from './Genotype.js';
import PhenotypeIO from './PhenotypeIO.js';

class Phenotype extends PhetioObject {

  /**
   * @param {Genotype} genotype
   * @param {Object} [options]
   */
  constructor( genotype, options ) {

    assert && assert( genotype instanceof Genotype, 'invalid genotype' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhenotypeIO,
      phetioDocumentation: 'the appearance of the bunny, the manifestation of its genotype'
    }, options );

    super( options );

    // @public (read-only) the alleles that correspond to the bunny's appearance
    this.furAllele = genotype.furGenePair.getVisibleAllele();
    this.earsAllele = genotype.earsGenePair.getVisibleAllele();
    this.teethAllele = genotype.teethGenePair.getVisibleAllele();

    this.validateInstance();
  }

  /**
   * Does the phenotype show white fur?
   * @returns {boolean}
   * @public
   */
  hasWhiteFur() { return this.furAllele === AlleleInstances.WHITE_FUR; }

  /**
   * Does the phenotype show brown fur?
   * @returns {boolean}
   * @public
   */
  hasBrownFur() { return this.furAllele === AlleleInstances.BROWN_FUR; }

  /**
   * Does the phenotype show straight ears?
   * @returns {boolean}
   * @public
   */
  hasStraightEars() { return this.earsAllele === AlleleInstances.STRAIGHT_EARS; }

  /**
   * Does the phenotype show floppy ears?
   * @returns {boolean}
   * @public
   */
  hasFloppyEars() { return this.earsAllele === AlleleInstances.FLOPPY_EARS; }

  /**
   * Does the phenotype show short teeth?
   * @returns {boolean}
   * @public
   */
  hasShortTeeth() { return this.teethAllele === AlleleInstances.SHORT_TEETH; }

  /**
   * Does the phenotype show long teeth?
   * @returns {boolean}
   * @public
   */
  hasLongTeeth() { return this.teethAllele === AlleleInstances.LONG_TEETH; }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by PhenotypeIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this Phenotype instance.
   * @returns {Object}
   * @public for use by PhenotypeIO only
   */
  toStateObject() {
    return {
      furAllele: AlleleIO.toStateObject( this.furAllele ),
      earsAllele: AlleleIO.toStateObject( this.earsAllele ),
      teethAllele: AlleleIO.toStateObject( this.teethAllele )
    };
  }

  /**
   * Deserializes the state needed by PhenotypeIO.setValue.
   * @param {Object} stateObject
   * @returns {Object}
   * @public for use by PhenotypeIO only
   */
  static fromStateObject( stateObject ) {
    return {
      furAllele: AlleleIO.fromStateObject( stateObject.furAllele ),
      earsAllele: AlleleIO.fromStateObject( stateObject.earsAllele ),
      teethAllele: AlleleIO.fromStateObject( stateObject.teethAllele )
    };
  }

  /**
   * Restores Phenotype state after instantiation.
   * @param {Object} state
   * @public for use by PhenotypeIO only
   */
  setValue( state ) {
    required( state );
    this.furAllele = required( state.furAllele );
    this.earsAllele = required( state.earsAllele );
    this.teethAllele = required( state.teethAllele );
    this.validateInstance();
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( this.furAllele instanceof Allele, 'invalid furAllele' );
    assert && assert( this.earsAllele instanceof Allele, 'invalid earsAllele' );
    assert && assert( this.teethAllele instanceof Allele, 'invalid teethAllele' );
  }
}

naturalSelection.register( 'Phenotype', Phenotype );
export default Phenotype;