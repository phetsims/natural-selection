// Copyright 2019-2020, University of Colorado Boulder

/**
 * TeethGenePair is a pair of genes for the teeth trait, inherited from parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import GenePair from './GenePair.js';
import TeethGene from './TeethGene.js';

class TeethGenePair extends GenePair {

  /**
   * @param {TeethGene} fatherGene
   * @param {TeethGene} motherGene
   */
  constructor( fatherGene, motherGene ) {
    assert && assert( fatherGene instanceof TeethGene, 'invalid fatherGene' );
    assert && assert( motherGene instanceof TeethGene, 'invalid motherGene' );

    super( fatherGene, motherGene );
  }
}

naturalSelection.register( 'TeethGenePair', TeethGenePair );
export default TeethGenePair;