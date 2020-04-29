// Copyright 2020, University of Colorado Boulder

/**
 * GenePool is the pool of genes for the bunny population.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import AlleleInstances from './AlleleInstances.js';
import Gene from './Gene.js';

class GenePool {

  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @pubic (read-only)
    this.furGene = new Gene( naturalSelectionStrings.fur,
      AlleleInstances.WHITE_FUR, AlleleInstances.BROWN_FUR,
      naturalSelectionStrings.furDominant, naturalSelectionStrings.furRecessive, {
        tandem: options.tandem.createTandem( 'furGene' )
      } );

    // @pubic (read-only)
    this.earsGene = new Gene( naturalSelectionStrings.fur,
      AlleleInstances.STRAIGHT_EARS, AlleleInstances.FLOPPY_EARS,
      naturalSelectionStrings.earsDominant, naturalSelectionStrings.earsRecessive, {
        tandem: options.tandem.createTandem( 'earsGene' )
      } );

    // @pubic (read-only)
    this.teethGene = new Gene( naturalSelectionStrings.teeth,
      AlleleInstances.SHORT_TEETH, AlleleInstances.LONG_TEETH,
      naturalSelectionStrings.teethDominant, naturalSelectionStrings.teethRecessive, {
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