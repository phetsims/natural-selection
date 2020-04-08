// Copyright 2020, University of Colorado Boulder

/**
 * Genotype is a bunny's full genetic information.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import GenePair from './GenePair.js';
import GenePool from './GenePool.js';

class Genotype {

  /**
   * @param {Bunny|null} father
   * @param {Bunny|null} mother
   * @param {GenePool} genePool
   */
  constructor( father, mother, genePool ) {

    assert && assert( father instanceof Bunny || father === null, 'invalid father' );
    assert && assert( mother instanceof Bunny || mother === null, 'invalid mother' );
    assert && assert( ( father && mother ) || ( !father && !mother ), 'bunny cannot have 1 parent' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    // @public (read-only) gene pairs for each trait, initialize below
    this.furGenePair = null;
    this.earsGenePair = null;
    this.teethGenePair = null;
    
    if ( father && mother ) {

      // we have both parents, so determine the child's genotype using Mendelian inheritance
      this.furGenePair = GenePair.combine( father.furGenePair, mother.furGenePair ) ;
      this.earsGenePair = GenePair.combine( father.earsGenePair, mother.earsGenePair ) ;
      this.teethGenePair = GenePair.combine( father.teethGenePair, mother.teethGenePair ) ;
    }
    else {

      // no parents, so this bunny gets the genotype for generation 0
      this.furGenePair = genePool.createFurGenePair0();
      this.earsGenePair = genePool.createEarsGenePair0();
      this.teethGenePair = genePool.createTeethGenePair0();
    }
  }
}

naturalSelection.register( 'Genotype', Genotype );
export default Genotype;