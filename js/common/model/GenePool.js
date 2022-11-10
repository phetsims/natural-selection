// Copyright 2020-2022, University of Colorado Boulder

/**
 * GenePool is the pool of genes for the bunny population.
 * There is one instance of GenePool per screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import Gene from './Gene.js';

export default class GenePool {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only) {Gene}
    this.furGene = Gene.createFurGene( options.tandem.createTandem( 'furGene' ) );

    // @public (read-only) {Gene}
    this.earsGene = Gene.createEarsGene( options.tandem.createTandem( 'earsGene' ) );

    // @public (read-only) {Gene}
    this.teethGene = Gene.createTeethGene( options.tandem.createTandem( 'teethGene' ) );

    // @public (read-only) {Gene[]} for situations where it's possible to iterate over genes
    // When we're able to iterate to create the UI, the order here determines the order of UI components.
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

  /**
   * Is the specified allele a recessive mutation?
   * @param {Allele} allele
   * @returns {boolean}
   * @public
   */
  isRecessiveMutation( allele ) {
    assert && assert( allele instanceof Allele, 'invalid allele' );

    let isRecessiveMutation = false;
    for ( let i = 0; i < this.genes.length && !isRecessiveMutation; i++ ) {
      isRecessiveMutation = ( this.genes[ i ].mutantAllele === allele ) &&
                            ( this.genes[ i ].recessiveAlleleProperty.value === allele );
    }
    return isRecessiveMutation;
  }

  /**
   * Gets the dependencies on dynamic strings that are used to derive the abbreviations for genes in the pool.
   * These strings may be changed via PhET-iO, or by changing the global localeProperty.
   * @returns {Property.<*>[]}
   * @public
   */
  getGenotypeAbbreviationStringDependencies() {
    const dependencies = [];
    this.genes.forEach( gene => {
      dependencies.push( gene.dominantAbbreviationTranslatedProperty );
      dependencies.push( gene.recessiveAbbreviationTranslatedProperty );
    } );
    return dependencies;
  }
}

naturalSelection.register( 'GenePool', GenePool );