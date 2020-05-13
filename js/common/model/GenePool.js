// Copyright 2020, University of Colorado Boulder

/**
 * GenePool is the pool of genes for the bunny population.
 * There is one instance of GenePool per screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Gene from './Gene.js';

class GenePool {

  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @pubic (read-only)
    this.furGene = Gene.createFurGene( {
      tandem: options.tandem.createTandem( 'furGene' )
    } );

    // @pubic (read-only)
    this.earsGene = Gene.createEarsGene( {
      tandem: options.tandem.createTandem( 'earsGene' )
    } );

    // @pubic (read-only)
    this.teethGene = Gene.createTeethGene( {
      tandem: options.tandem.createTandem( 'teethGene' )
    } );
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
   * Resets mutationComingProperty for all genes in the pool. This is called after a mating cycle has completed, and
   * mutations have been applied.
   * @public
   */
  resetMutationComing() {
    this.furGene.mutationComingProperty.reset();
    this.earsGene.mutationComingProperty.reset();
    this.teethGene.mutationComingProperty.reset();
  }

  /**
   * @public
   */
  dispose() {
    throw new Error( 'dispose is not supported' );
  }
}

naturalSelection.register( 'GenePool', GenePool );
export default GenePool;