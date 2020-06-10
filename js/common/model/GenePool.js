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

    // @public (read-only) for situations where it's possible to iterate over genes
    this.genes = [ this.furGene, this.earsGene, this.teethGene ];
  }

  /**
   * @public
   */
  reset() {
    this.genes.forEach( gene => gene.reset() );
  }

  /**
   * Resets mutationComingProperty for all genes in the pool. This is called after a mating cycle has completed, and
   * mutations have been applied.
   * @public
   */
  resetMutationComing() {
    this.genes.forEach( gene => gene.mutationComingProperty.reset() );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

naturalSelection.register( 'GenePool', GenePool );
export default GenePool;