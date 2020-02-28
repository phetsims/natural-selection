// Copyright 2019-2020, University of Colorado Boulder

/**
 * BunnyGenotype is the complete set of genes for a bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import EarsGenePair from './EarsGenePair.js';
import FurGenePair from './FurGenePair.js';
import LongTeethAllele from './LongTeethAllele.js';
import StraightEarsAllele from './StraightEarsAllele.js';
import TeethGenePair from './TeethGenePair.js';
import WhiteFurAllele from './WhiteFurAllele.js';

class BunnyGenotype {

  /**
   * @param {FurGenePair} furGenePair
   * @param {EarsGenePair} earsGenePair
   * @param {TeethGenePair} teethGenePair
   */
  constructor( furGenePair, earsGenePair, teethGenePair ) {
    assert && assert( furGenePair instanceof FurGenePair, 'invalid furGenePair' );
    assert && assert( earsGenePair instanceof EarsGenePair, 'invalid earsGenePair' );
    assert && assert( teethGenePair instanceof TeethGenePair, 'invalid teethGenePair' );

    // @public (read-only)
    this.furGenePair = furGenePair;
    this.earsGenePair = earsGenePair;
    this.teethGenePair = teethGenePair;
  }

  /**
   * Creates the default genotype for a bunny.
   * This genotype is used for the bunnies that have no ancestors, the lone bunny and its mate.
   * @returns {BunnyGenotype}
   * @public
   */
  static createDefault() {

    const furGenePair = new FurGenePair( new WhiteFurAllele(), new WhiteFurAllele() );
    const earsGenePair = new EarsGenePair( new StraightEarsAllele(), new StraightEarsAllele() );
    const teethGenePair = new TeethGenePair( new LongTeethAllele(), new LongTeethAllele() );

    return new BunnyGenotype( furGenePair, earsGenePair, teethGenePair );
  }
}

naturalSelection.register( 'BunnyGenotype', BunnyGenotype );
export default BunnyGenotype;