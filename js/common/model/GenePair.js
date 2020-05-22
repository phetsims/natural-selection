// Copyright 2020, University of Colorado Boulder

/**
 * GenePair is a pair of alleles for a specific Gene.
 *
 * Genes come in pairs, called alleles, and each pair is located in a specific position (or locus) on a chromosome.
 * If the two alleles at a locus are identical to each other, they are homozygous; if they are different from one
 * another, they are heterozygous.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import AlleleIO from './AlleleIO.js';
import Gene from './Gene.js';
import GeneIO from './GeneIO.js';
import GenePairIO from './GenePairIO.js';

class GenePair extends PhetioObject {

  /**
   * @param {Gene} gene - the associated gene
   * @param {Allele} fatherAllele - the allele that is inherited from the father
   * @param {Allele} motherAllele - the allele that is inherited from the mother
   * @param {Object} [options]
   */
  constructor( gene, fatherAllele, motherAllele, options ) {

    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && assert( fatherAllele instanceof Allele, 'invalid fatherAllele' );
    assert && assert( motherAllele instanceof Allele, 'invalid motherAllele' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: GenePairIO
    }, options );

    super( options );

    // @public (read-only)
    this.gene = gene;
    this.fatherAllele = fatherAllele;
    this.motherAllele = motherAllele;

    // @private {Allele[]} alleles that will be passed on to children
    this.childAlleles = phet.joist.random.shuffle( [ fatherAllele, fatherAllele, motherAllele, motherAllele ] );
    this.childAllelesIndex = 0;

    this.validateInstance();
  }

  /**
   * Mutates the gene pair.
   * @param {Allele} mutantAllele
   */
  mutate( mutantAllele ) {

    // Both alleles are set to the mutant allele, so that the mutation will appear in the phenotype regardless of
    // whether the mutation is dominant or recessive.  This differs from reality, where mutation would occur for one
    // of the inherited alleles.
    this.fatherAllele = mutantAllele;
    this.motherAllele = mutantAllele;

    // The only allele that will be passed on is the mutant.
    this.childAlleles = [ mutantAllele ];
    this.childAllelesIndex = 0;
  }

  /**
   * Is this gene pair homozygous (same alleles)?
   * @returns {boolean}
   * @public
   */
  isHomozygous() {
    return ( this.fatherAllele === this.motherAllele );
  }

  /**
   * Is this gene pair heterozygous (different alleles)?
   * @returns {boolean}
   * @public
   */
  isHeterozygous() {
    return ( this.fatherAllele !== this.motherAllele );
  }

  /**
   * Gets the next allele for a child. This simulates Mendelian inheritance, where father and mother gene pairs are
   * combined to produce a child's gene pair. That is, gametes are created by random segregation, and heterozygous
   * individuals produce gametes with an equal frequency of the two alleles.
   * @returns {Allele}
   * @public
   */
  getNextChildAllele() {
    if ( this.childAllelesIndex >= this.childAlleles.length ) {
      this.childAllelesIndex = 0;
    }
    return this.childAlleles[ this.childAllelesIndex++ ];
  }

  /**
   * Gets the allele that determines the bunny's appearance. This is how genotype manifests as phenotype.
   * @returns {Allele}
   * @public
   */
  getVisibleAllele() {
    if ( this.isHomozygous() ) {
      return this.fatherAllele;
    }
    else {
      const dominantAllele = this.gene.dominantAlleleProperty.value;
      assert && assert( dominantAllele !== null, 'dominantAllele should not be null' );
      return dominantAllele;
    }
  }

  /**
   * Gets the abbreviation of the alleles in this gene pair. If there is no dominant gene,
   * then an abbreviation is meaningless, and the empty string is returned.
   * @param {boolean} translated - true = translated (default), false = untranslated
   * @returns {string}
   * @public
   */
  getAllelesAbbreviation( translated = true ) {

    const dominantAbbreviation = translated ? this.gene.dominantAbbreviationTranslated : this.gene.dominantAbbreviationEnglish;
    const recessiveAbbreviation = translated ? this.gene.recessiveAbbreviationTranslated : this.gene.recessiveAbbreviationEnglish;

    let s = '';
    const dominantAllele = this.gene.dominantAlleleProperty.value;
    if ( dominantAllele ) {
      s = ( this.fatherAllele === dominantAllele ) ? dominantAbbreviation : recessiveAbbreviation;
      s += ( this.motherAllele === dominantAllele ) ? dominantAbbreviation : recessiveAbbreviation;
    }
    return s;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by GenePairIO to save and restore PhET-iO state.
  // NOTE! If you add a field to GenePair that is not itself a PhET-iO element, you will like need to add it to
  // toStateObject, fromStateObject, setValue, and validateInstance.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this GenePair instance.
   * @returns {Object}
   * @public for use by GenePairIO only
   */
  toStateObject() {
    return {
      gene: GeneIO.toStateObject( this.gene ),
      fatherAllele: AlleleIO.toStateObject( this.fatherAllele ),
      motherAllele: AlleleIO.toStateObject( this.motherAllele ),

      // state that is not part of the public API, and will not be shown in Studio
      private: {
        childAlleles: ArrayIO( AlleleIO ).toStateObject( this.childAlleles ),
        childAllelesIndex: NumberIO.toStateObject( this.childAllelesIndex )
      }
    };
  }

  /**
   * Deserializes the state needed by GenePairIO.setValue.
   * @param {Object} stateObject
   * @returns {Object}
   * @public for use by GenePairIO only
   */
  static fromStateObject( stateObject ) {
    return {
      gene: GeneIO.fromStateObject( stateObject.gene ),
      fatherAllele: AlleleIO.fromStateObject( stateObject.fatherAllele ),
      motherAllele: AlleleIO.fromStateObject( stateObject.motherAllele ),
      childAlleles: ArrayIO( AlleleIO ).fromStateObject( stateObject.private.childAlleles ),
      childAllelesIndex: NumberIO.fromStateObject( stateObject.private.childAllelesIndex )
    };
  }

  /**
   * Restores GenePair state after instantiation.
   * @param {Object} state
   * @public for use by GenePairIO only
   */
  setValue( state ) {
    required( state );
    this.gene = required( state.gene );
    this.fatherAllele = required( state.fatherAllele );
    this.motherAllele = required( state.motherAllele );
    this.childAlleles = required( state.childAlleles );
    this.childAllelesIndex = required( state.childAllelesIndex );
    this.validateInstance();
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( this.gene instanceof Gene, 'invalid gene' );
    assert && assert( this.fatherAllele instanceof Allele, 'invalid fatherAllele' );
    assert && assert( this.motherAllele instanceof Allele, 'invalid motherAllele' );
    assert && assert( Array.isArray( this.childAlleles ), 'invalid childAlleles' );
    assert && assert( typeof this.childAllelesIndex === 'number', 'invalid childAllelesIndex' );
  }
}

naturalSelection.register( 'GenePair', GenePair );
export default GenePair;
