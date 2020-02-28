// Copyright 2019-2020, University of Colorado Boulder

/**
 * FurGenePair is a pair of genes for the fur trait, inherited from parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import FurGene from './FurGene.js';
import GenePair from './GenePair.js';

class FurGenePair extends GenePair {

  /**
   * @param {FurGene} fatherGene
   * @param {FurGene} motherGene
   */
  constructor( fatherGene, motherGene ) {
    assert && assert( fatherGene instanceof FurGene, 'invalid fatherGene' );
    assert && assert( motherGene instanceof FurGene, 'invalid motherGene' );

    super( fatherGene, motherGene );
  }
}

naturalSelection.register( 'FurGenePair', FurGenePair );
export default FurGenePair;