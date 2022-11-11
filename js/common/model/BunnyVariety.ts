// Copyright 2020-2022, University of Colorado Boulder

/**
 * BunnyVariety is a data structure that describes one variety (genetic variation) of bunny that makes up
 * the initial population. An array of this data structure is created by parseInitialPopulation.js based
 * on query parameters that describe the initial population.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';

export default class BunnyVariety {

  public constructor(

    // the number of bunnies of this variety to create
    public readonly count: number,

    // the genotype abbreviation for this variety, for debugging purposes
    public readonly genotypeString: string,

    // the alleles that will be used to create this variety's genotype
    public readonly fatherFurAllele: Allele,
    public readonly motherFurAllele: Allele,
    public readonly fatherEarsAllele: Allele,
    public readonly motherEarsAllele: Allele,
    public readonly fatherTeethAllele: Allele,
    public readonly motherTeethAllele: Allele
  ) {
    // fields are created via constructor assignment
  }
}

naturalSelection.register( 'BunnyVariety', BunnyVariety );