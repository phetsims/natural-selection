// Copyright 2020, University of Colorado Boulder

import naturalSelection from '../../naturalSelection.js';

/**
 * Genotype is the portion of the full genotype related to one gene or trait.  Since bunnies are diploid organisms,
 * they have 2 copies of each chromosome, and therefore 2 alleles for each gene.  One gene is inherited from the
 * father, the other from the mother.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

class Genotype {

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
   * Returns the allele that determines how this genotype manifests as phenotype.
   * @returns {Allele}
   * @public
   */
  getPhenotype() {
    if ( this.fatherAllele === this.motherAllele ) {
      return this.fatherAllele;
    }
    else {
      const dominantAllele = this.gene.dominantAlleleProperty.value;
      assert && assert( dominantAllele !== null, 'dominantAllele should not be null' );
      return dominantAllele;
    }
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
   * Combines father and mother genotypes to produce a child's genotype, using Mendelian inheritance.  That is,
   * gametes are created by random segregation, and heterozygotic individuals produce gametes with an equal frequency
   * of the two alleles.
   * @param {Genotype} fatherGenotype
   * @param {Genotype} motherGenotype
   * @returns {Genotype}
   * @public
   * @static
   */
  static combine( fatherGenotype, motherGenotype ) {
    assert && assert( fatherGenotype.gene === motherGenotype.gene, 'gene mismatch' );
    return new Genotype( fatherGenotype.gene, fatherGenotype.getNextChildAllele(), motherGenotype.getNextChildAllele() );
  }
}

naturalSelection.register( 'Genotype', Genotype );
export default Genotype;
