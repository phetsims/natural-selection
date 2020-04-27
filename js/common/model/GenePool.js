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
import GenePair from './GenePair.js';

class GenePool {

  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @pubic (read-only)
    this.furGene = new Gene( naturalSelectionStrings.fur, AlleleInstances.WHITE_FUR, AlleleInstances.BROWN_FUR,
      naturalSelectionStrings.furDominant, naturalSelectionStrings.furRecessive, {
        tandem: options.tandem.createTandem( 'furGene' )
      } );

    // @pubic (read-only)
    this.earsGene = new Gene( naturalSelectionStrings.fur, AlleleInstances.STRAIGHT_EARS, AlleleInstances.FLOPPY_EARS,
      naturalSelectionStrings.earsDominant, naturalSelectionStrings.earsRecessive, {
        tandem: options.tandem.createTandem( 'earsGene' )
      } );

    // @pubic (read-only)
    this.teethGene = new Gene( naturalSelectionStrings.teeth, AlleleInstances.SHORT_TEETH, AlleleInstances.LONG_TEETH,
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
   * @public
   */
  dispose() {
    throw new Error( 'dispose is not supported' );
  }

  /**
   * Create the default fur gene pair for generation 0 bunnies that have no parents.
   * @param {Object} [options] - GenePair constructor options
   * @returns {GenePair}
   * @public
   */
  createFurGenePair0( options ) {
    return new GenePair( this.furGene, AlleleInstances.WHITE_FUR, AlleleInstances.WHITE_FUR, options );
  }

  /**
   * Create the default ears gene pair for generation 0 bunnies that have no parents.
   * @param {Object} [options] - GenePair constructor options
   * @returns {GenePair}
   * @public
   */
  createEarsGenePair0( options ) {
    return new GenePair( this.earsGene, AlleleInstances.STRAIGHT_EARS, AlleleInstances.STRAIGHT_EARS, options );
  }

  /**
   * Create the default teeth gene pair for generation 0 bunnies that have no parents.
   * @param {Object} [options] - GenePair constructor options
   * @returns {GenePair}
   * @public
   */
  createTeethGenePair0( options ) {
    return new GenePair( this.teethGene, AlleleInstances.SHORT_TEETH, AlleleInstances.SHORT_TEETH, options );
  }
}

naturalSelection.register( 'GenePool', GenePool );
export default GenePool;