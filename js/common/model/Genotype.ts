// Copyright 2020-2022, University of Colorado Boulder

/**
 * Genotype is the genetic blueprint for an individual bunny. It consists of a gene pair for each gene, and
 * can be abbreviated as a string of letters.  See the 'Genotype and Phenotype' section of model.md at
 * https://github.com/phetsims/natural-selection/blob/master/doc/model.md#genotype-and-phenotype
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import required from '../../../../phet-core/js/required.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import Allele, { AlleleStateObject } from './Allele.js';
import GenePair from './GenePair.js';
import GenePool from './GenePool.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {

  // alleles that make up the genotype, all of which default to the normal allele
  fatherFurAllele?: Allele;
  motherFurAllele?: Allele;
  fatherEarsAllele?: Allele;
  motherEarsAllele?: Allele;
  fatherTeethAllele?: Allele;
  motherTeethAllele?: Allele;

  // which genes to mutate
  mutateFur?: boolean;
  mutateEars?: boolean;
  mutateTeeth?: boolean;
};

export type GenotypeOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

type GenotypeStateObject = {
  mutation: AlleleStateObject;
};

export default class Genotype extends PhetioObject {

  public readonly genePool: GenePool;
  public readonly furGenePair: GenePair;
  public readonly earsGenePair: GenePair;
  public readonly teethGenePair: GenePair;

  // optional mutation that modified this genotype
  public mutation: Allele | null;

  private readonly disposeGenotype: () => void;

  public constructor( genePool: GenePool, providedOptions: GenotypeOptions ) {

    const options = optionize<GenotypeOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      fatherFurAllele: genePool.furGene.normalAllele,
      motherFurAllele: genePool.furGene.normalAllele,
      fatherEarsAllele: genePool.earsGene.normalAllele,
      motherEarsAllele: genePool.earsGene.normalAllele,
      fatherTeethAllele: genePool.teethGene.normalAllele,
      motherTeethAllele: genePool.teethGene.normalAllele,
      mutateFur: false,
      mutateEars: false,
      mutateTeeth: false,

      // PhetioObjectOptions
      phetioType: Genotype.GenotypeIO,
      phetioDocumentation: 'the genetic blueprint for a bunny'
    }, providedOptions );

    assert && assert( _.filter( [ options.mutateFur, options.mutateEars, options.mutateTeeth ] ).length <= 1,
      'mutations are mutually exclusive' );

    super( options );

    this.genePool = genePool;

    this.furGenePair = new GenePair( genePool.furGene, options.fatherFurAllele, options.motherFurAllele, {
      tandem: options.tandem.createTandem( 'furGenePair' ),
      phetioDocumentation: 'gene pair that determines the fur trait'
    } );

    this.earsGenePair = new GenePair( genePool.earsGene, options.fatherEarsAllele, options.motherEarsAllele, {
      tandem: options.tandem.createTandem( 'earsGenePair' ),
      phetioDocumentation: 'gene pair that determines the ears trait'
    } );

    this.teethGenePair = new GenePair( genePool.teethGene, options.fatherTeethAllele, options.motherTeethAllele, {
      tandem: options.tandem.createTandem( 'teethGenePair' ),
      phetioDocumentation: 'gene pair that determines the teeth trait'
    } );

    this.mutation = null;

    // After gene pairs have been created, apply an optional mutation. This ensures that an allele is inherited and
    // then modified, so that the distribution of alleles in the population is correct.
    if ( options.mutateFur ) {
      this.mutation = genePool.furGene.mutantAllele;
      this.furGenePair.mutate( this.mutation );
    }
    if ( options.mutateEars ) {
      this.mutation = genePool.earsGene.mutantAllele;
      this.earsGenePair.mutate( this.mutation );
    }
    if ( options.mutateTeeth ) {
      this.mutation = genePool.teethGene.mutantAllele;
      this.teethGenePair.mutate( this.mutation );
    }

    // The translated abbreviation of the Genotype. PhET-iO only, not used in brand=phet.
    // dispose is required.
    const abbreviationProperty = DerivedProperty.deriveAny(
      [
        genePool.furGene.dominantAlleleProperty,
        genePool.earsGene.dominantAlleleProperty,
        genePool.teethGene.dominantAlleleProperty,
        ...this.getAbbreviationStringDependencies()
      ],
      () => {
        return this.furGenePair.getGenotypeAbbreviation() +
               this.earsGenePair.getGenotypeAbbreviation() +
               this.teethGenePair.getGenotypeAbbreviation();
      }, {
        tandem: options.tandem.createTandem( 'abbreviationProperty' ),
        phetioValueType: StringIO,
        phetioDocumentation: 'the abbreviation that describes the genotype, the empty string if there are no dominant alleles'
      } );

    this.disposeGenotype = () => {
      this.furGenePair.dispose();
      this.earsGenePair.dispose();
      this.teethGenePair.dispose();
      abbreviationProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeGenotype();
    super.dispose();
  }

  /**
   * Does this genotype contain a specific allele?
   */
  public hasAllele( allele: Allele | null ): boolean {
    return ( this.furGenePair.hasAllele( allele ) ||
             this.earsGenePair.hasAllele( allele ) ||
             this.teethGenePair.hasAllele( allele ) );
  }

  /**
   * Converts a Genotype to its untranslated abbreviation, e.g. 'FfEEtt'.
   * This is intended for debugging only. Do not rely on the format!
   */
  public toAbbreviation(): string {
    return this.furGenePair.getGenotypeAbbreviation( false ) +
           this.earsGenePair.getGenotypeAbbreviation( false ) +
           this.teethGenePair.getGenotypeAbbreviation( false );
  }

  /**
   * Gets the dependencies on dynamic strings that are used to derive the abbreviations for this genotype.
   * These strings may be changed via PhET-iO, or by changing the global localeProperty.
   */
  public getAbbreviationStringDependencies(): TReadOnlyProperty<string>[] {
    return this.genePool.getGenotypeAbbreviationStringDependencies();
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by GenotypeIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this Genotype instance.
   */
  private toStateObject(): GenotypeStateObject {
    return {
      mutation: NullableIO( Allele.AlleleIO ).toStateObject( this.mutation )
      // furGenePair, earsGenePair, and teethGenePair are stateful and will be serialized automatically.
    };
  }

  /**
   * Restores Genotype stateObject after instantiation.
   */
  private applyState( stateObject: GenotypeStateObject ): void {
    required( stateObject );
    this.mutation = required( NullableIO( Allele.AlleleIO ).fromStateObject( stateObject.mutation ) );
  }

  /**
   * GenotypeIO handles PhET-iO serialization of Genotype.
   * It implements 'Dynamic element serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly GenotypeIO = new IOType<Genotype, GenotypeStateObject>( 'GenotypeIO', {
    valueType: Genotype,
    stateSchema: {
      mutation: NullableIO( Allele.AlleleIO )
    },
    toStateObject: genotype => genotype.toStateObject(),
    applyState: ( genotype, stateObject ) => genotype.applyState( stateObject )
  } );
}

naturalSelection.register( 'Genotype', Genotype );