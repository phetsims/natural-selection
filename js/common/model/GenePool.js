// Copyright 2020, University of Colorado Boulder

/**
 * GenePool is the pool of genes for the bunny population.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import Allele from './Allele.js';
import Gene from './Gene.js';
import GenePair from './GenePair.js';

class GenePool {

  constructor() {

    // @pubic (read-only)
    this.furGene = new Gene( naturalSelectionStrings.fur, Allele.WHITE_FUR, Allele.BROWN_FUR,
      naturalSelectionStrings.furDominant, naturalSelectionStrings.furRecessive );

    // @pubic (read-only)
    this.earsGene = new Gene( naturalSelectionStrings.fur, Allele.STRAIGHT_EARS, Allele.FLOPPY_EARS,
      naturalSelectionStrings.earsDominant, naturalSelectionStrings.earsRecessive );

    // @pubic (read-only)
    this.teethGene = new Gene( naturalSelectionStrings.teeth, Allele.SHORT_TEETH, Allele.LONG_TEETH,
      naturalSelectionStrings.teethDominant, naturalSelectionStrings.teethRecessive );
  }

  /**
   * @public
   */
  reset() {
    this.furGene.reset();
    this.earsGene.reset();
    this.teethGene.reset();
  }

  /**
   * Create the default fur gene pair for generation 0 bunnies that have no parents.
   * @returns {GenePair}
   * @public
   */
  createFurGenePair0() {
    return new GenePair( this.furGene, Allele.WHITE_FUR, Allele.WHITE_FUR );
  }

  /**
   * Create the default ears gene pair for generation 0 bunnies that have no parents.
   * @returns {GenePair}
   * @public
   */
  createEarsGenePair0() {
    return new GenePair( this.earsGene, Allele.STRAIGHT_EARS, Allele.STRAIGHT_EARS );
  }

  /**
   * Create the default teeth gene pair for generation 0 bunnies that have no parents.
   * @returns {GenePair}
   * @public
   */
  createTeethGenePair0() {
    return new GenePair( this.teethGene, Allele.SHORT_TEETH, Allele.SHORT_TEETH );
  }
}

naturalSelection.register( 'GenePool', GenePool );
export default GenePool;