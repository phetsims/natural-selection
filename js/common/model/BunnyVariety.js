// Copyright 2020, University of Colorado Boulder

/**
 * BunnyVariety is a data structure that describes one variety (genetic variation) of bunny that makes up
 * the initial population. An array of this data structure is created by parseInitialPopulation.js.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';

class BunnyVariety {

  /**
   * @param {number} count
   * @param {string} genotypeString
   * @param {Allele} fatherFurAllele
   * @param {Allele} motherFurAllele
   * @param {Allele} fatherEarsAllele
   * @param {Allele} motherEarsAllele
   * @param {Allele} fatherTeethAllele
   * @param {Allele} motherTeethAllele
   */
  constructor( count, genotypeString, fatherFurAllele, motherFurAllele, fatherEarsAllele, motherEarsAllele,
               fatherTeethAllele, motherTeethAllele ) {

    // @public (read-only) the number of bunnies of this variety to create
    this.count = count;

    // @public (read-only) the genotype abbreviation for this variety, for debugging purposes
    this.genotypeString = genotypeString;

    // @public (read-only) the alleles that will be used to create this variety's genotype
    this.fatherFurAllele = fatherFurAllele;
    this.motherFurAllele = motherFurAllele;
    this.fatherEarsAllele = fatherEarsAllele;
    this.motherEarsAllele = motherEarsAllele;
    this.fatherTeethAllele = fatherTeethAllele;
    this.motherTeethAllele = motherTeethAllele;
  }
}

naturalSelection.register( 'BunnyVariety', BunnyVariety );
export default BunnyVariety;