// Copyright 2019, University of Colorado Boulder

/**
 * EarsGenePair is a pair of genes for the ears trait, inherited from parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import EarsGene from './EarsGene.js';
import GenePair from './GenePair.js';

class EarsGenePair extends GenePair {

  /**
   * @param {EarsGene} fatherGene
   * @param {EarsGene} motherGene
   */
  constructor( fatherGene, motherGene ) {
    assert && assert( fatherGene instanceof EarsGene, 'invalid fatherGene' );
    assert && assert( motherGene instanceof EarsGene, 'invalid motherGene' );

    super( fatherGene, motherGene );
  }
}

naturalSelection.register( 'EarsGenePair', EarsGenePair );
export default EarsGenePair;