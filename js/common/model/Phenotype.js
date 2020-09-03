// Copyright 2020, University of Colorado Boulder

/**
 * Phenotype describes the appearance of a bunny, the manifestation of its genotype.
 * See the 'Genotype and Phenotype' section of model.md at
 * https://github.com/phetsims/natural-selection/blob/master/doc/model.md#genotype-and-phenotype
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import createIOType from './createIOType.js';
import Genotype from './Genotype.js';

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
      phetioType: Phenotype.PhenotypeIO,
      phetioDocumentation: 'the appearance of the bunny, the manifestation of its genotype'
    }, options );

    super( options );

    // @public (read-only) the alleles that determine the bunny's appearance
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
  hasWhiteFur() { return this.furAllele === Allele.WHITE_FUR; }

  /**
   * Does the phenotype show brown fur?
   * @returns {boolean}
   * @public
   */
  hasBrownFur() { return this.furAllele === Allele.BROWN_FUR; }

  /**
   * Does the phenotype show straight ears?
   * @returns {boolean}
   * @public
   */
  hasStraightEars() { return this.earsAllele === Allele.STRAIGHT_EARS; }

  /**
   * Does the phenotype show floppy ears?
   * @returns {boolean}
   * @public
   */
  hasFloppyEars() { return this.earsAllele === Allele.FLOPPY_EARS; }

  /**
   * Does the phenotype show short teeth?
   * @returns {boolean}
   * @public
   */
  hasShortTeeth() { return this.teethAllele === Allele.SHORT_TEETH; }

  /**
   * Does the phenotype show long teeth?
   * @returns {boolean}
   * @public
   */
  hasLongTeeth() { return this.teethAllele === Allele.LONG_TEETH; }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( this.furAllele instanceof Allele, 'invalid furAllele' );
    assert && assert( this.earsAllele instanceof Allele, 'invalid earsAllele' );
    assert && assert( this.teethAllele instanceof Allele, 'invalid teethAllele' );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by PhenotypeIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes a Phenotype.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      furAllele: Allele.AlleleIO.toStateObject( this.furAllele ),
      earsAllele: Allele.AlleleIO.toStateObject( this.earsAllele ),
      teethAllele: Allele.AlleleIO.toStateObject( this.teethAllele )
    };
  }

  /**
   * Restores Phenotype state after instantiation.
   * @param {Object} stateObject
   * @public
   */
  applyState( stateObject ) {
    required( stateObject );
    this.furAllele = required( Allele.AlleleIO.fromStateObject( stateObject.furAllele ) );
    this.earsAllele = required( Allele.AlleleIO.fromStateObject( stateObject.earsAllele ) );
    this.teethAllele = required( Allele.AlleleIO.fromStateObject( stateObject.teethAllele ) );
    this.validateInstance();
  }
}

Phenotype.PhenotypeIO = createIOType( Phenotype, 'PhenotypeIO', {
  toStateObject: phenotype => phenotype.toStateObject(),
  applyState: ( phenotype, stateObject ) => phenotype.applyState( stateObject )
} );

naturalSelection.register( 'Phenotype', Phenotype );
export default Phenotype;