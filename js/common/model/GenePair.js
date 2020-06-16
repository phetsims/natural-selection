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
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
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

    this.validateInstance();
  }

  /**
   * Mutates the gene pair.
   * @param {Allele} mutantAllele
   * @public
   */
  mutate( mutantAllele ) {
    assert && assert( mutantAllele instanceof Allele, 'invalid mutantAllele' );

    if ( NaturalSelectionQueryParameters.homozygousMutants ) {

      // Both alleles are set to the mutant allele, so that the mutation will immediately affect appearance.
      this.fatherAllele = mutantAllele;
      this.motherAllele = mutantAllele;
    }
    else {

      // The mutation is randomly applied to either the father or mother allele, but not both. If the mutant allele is
      // recessive, the mutation will not immediately affect appearance, and will not appear in the phenotype until
      // some later generation, when a bunny is born with 2 mutant alleles.
      if ( phet.joist.random.nextBoolean() ) {
        this.fatherAllele = mutantAllele;
      }
      else {
        this.motherAllele = mutantAllele;
      }
    }
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
   * Gets the genotype abbreviation for the alleles in this gene pair. If there is no dominant gene,
   * then an abbreviation is meaningless, and the empty string is returned.
   * @param {boolean} translated - true = translated (default), false = untranslated
   * @returns {string}
   * @public
   */
  getGenotypeAbbreviation( translated = true ) {

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

  /**
   * Gets the Punnett square that predicts the possible genotypes (genetic cross) that result from breeding two bunnies.
   * This is based on Mendelian inheritance and the Law of Segregation. The array is shuffled to satisfy Mendel's
   * Law of Independence, which states that individual traits are inherited independently. For example, here's a
   * Punnett square that shows the 4 possible crosses of 2 bunnies that are heterozygous ('Ff') for the fur gene:
   *
   *        F    f
   *   F | FF | Ff |
   *   f | Ff | ff |
   *
   * @param {GenePair} fatherGenePair
   * @param {GenePair} motherGenePair
   * @returns {Array.<{fatherAllele:Allele, motherAllele:Allele}>}
   * @public
   */
  static getPunnettSquare( fatherGenePair, motherGenePair ) {
    assert && assert( fatherGenePair instanceof GenePair, 'invalid fatherGenePair' );
    assert && assert( motherGenePair instanceof GenePair, 'invalid motherGenePair' );

    return phet.joist.random.shuffle( [
      { fatherAllele: fatherGenePair.fatherAllele, motherAllele: motherGenePair.fatherAllele },
      { fatherAllele: fatherGenePair.fatherAllele, motherAllele: motherGenePair.motherAllele },
      { fatherAllele: fatherGenePair.motherAllele, motherAllele: motherGenePair.fatherAllele },
      { fatherAllele: fatherGenePair.motherAllele, motherAllele: motherGenePair.motherAllele }
    ] );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by GenePairIO to save and restore PhET-iO state.
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
      motherAllele: AlleleIO.toStateObject( this.motherAllele )
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
      motherAllele: AlleleIO.fromStateObject( stateObject.motherAllele )
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
  }
}

naturalSelection.register( 'GenePair', GenePair );
export default GenePair;
