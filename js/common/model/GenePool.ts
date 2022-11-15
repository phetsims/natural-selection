// Copyright 2020-2022, University of Colorado Boulder

/**
 * GenePool is the pool of genes for the bunny population.
 * There is one instance of GenePool per screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import Gene from './Gene.js';

type SelfOptions = EmptySelfOptions;

type GenePoolOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GenePool {

  public readonly furGene: Gene;
  public readonly earsGene: Gene;
  public readonly teethGene: Gene;

  // For situations where it's possible to iterate over genes, the order here determines the order of UI components.
  public readonly genes: Gene[];

  public constructor( providedOptions: GenePoolOptions ) {

    const options = providedOptions;

    this.furGene = Gene.createFurGene( options.tandem.createTandem( 'furGene' ) );
    this.earsGene = Gene.createEarsGene( options.tandem.createTandem( 'earsGene' ) );
    this.teethGene = Gene.createTeethGene( options.tandem.createTandem( 'teethGene' ) );
    this.genes = [ this.furGene, this.earsGene, this.teethGene ];
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.genes.forEach( gene => gene.reset() );
  }

  /**
   * Resets mutationComingProperty for all genes in the pool. This is called after a mating cycle has completed, and
   * mutations have been applied.
   */
  public resetMutationComing(): void {
    this.genes.forEach( gene => gene.mutationComingProperty.reset() );
  }

  /**
   * Is the specified allele a recessive mutation?
   */
  public isRecessiveMutation( allele: Allele | null ): boolean {

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
   */
  public getGenotypeAbbreviationStringDependencies(): TReadOnlyProperty<string>[] {
    const dependencies: TReadOnlyProperty<string>[] = [];
    this.genes.forEach( gene => {
      dependencies.push( gene.dominantAbbreviationTranslatedProperty );
      dependencies.push( gene.recessiveAbbreviationTranslatedProperty );
    } );
    return dependencies;
  }
}

naturalSelection.register( 'GenePool', GenePool );