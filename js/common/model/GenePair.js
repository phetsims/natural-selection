// Copyright 2019, University of Colorado Boulder

/**
 * GenePair is a pair of genes for the same trait, inherited from parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';

class GenePair {

  /**
   * @param {Gene} fatherGene
   * @param {Gene} motherGene
   */
  constructor( fatherGene, motherGene ) {

    // @public (read-only)
    this.fatherGene = fatherGene;
    this.motherGene = motherGene;
  }
}

naturalSelection.register( 'GenePair', GenePair );
export default GenePair;