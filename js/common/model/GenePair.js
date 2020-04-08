// Copyright 2020, University of Colorado Boulder

import naturalSelection from '../../naturalSelection.js';

/**
 * Genes come in pairs, called alleles, and each pair is located in a specific position (or locus) on a chromosome.
 * If the two alleles at a locus are identical to each other, they are homozygous; if they are different from one
 * another, they are heterozygous.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

class GenePair {

  /**
   * @param {Gene} gene - the associated gene
   * @param {Allele} fatherAllele - the allele that is inherited from the father
   * @param {Allele} motherAllele - the allele that is inherited from the mother
   */
  constructor( gene, fatherAllele, motherAllele ) {

    // @public (read-only)
    this.gene = gene;
    this.fatherAllele = fatherAllele;
    this.motherAllele = motherAllele;

    // @private alleles that will be passed on to children
    this.childAlleles = phet.joist.random.shuffle( [ fatherAllele, fatherAllele, motherAllele, motherAllele ] );
    this.childAllelesIndex = 0;
  }

  /**
   * Is this gene pair homozygous?
   * @returns {boolean}
   */
  isHomozygous() {
    return ( this.fatherAllele === this.motherAllele );
  }

  /**
   * Is this gene pair heterozygous?
   * @returns {boolean}
   */
  isHeterozygous() {
    return ( this.fatherAllele !== this.motherAllele );
  }

  /**
   * Gets the next allele for a child.
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
   * Returns the allele that determines how this genotype manifests as phenotype.
   * @returns {Allele}
   * @public
   */
  getPhenotype() {
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
   * Combines father and mother gene pairs to produce a child's gene pair, using Mendelian inheritance.  That is,
   * gametes are created by random segregation, and heterozygous individuals produce gametes with an equal frequency
   * of the two alleles.
   * @param {GenePair} fatherGenePair
   * @param {GenePair} motherGenePair
   * @returns {GenePair}
   * @public
   * @static
   */
  static combine( fatherGenePair, motherGenePair ) {
    assert && assert( fatherGenePair.gene === motherGenePair.gene, 'gene mismatch' );
    return new GenePair( fatherGenePair.gene, fatherGenePair.getNextChildAllele(), motherGenePair.getNextChildAllele() );
  }
}

naturalSelection.register( 'GenePair', GenePair );
export default GenePair;
