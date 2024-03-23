// Copyright 2020-2024, University of Colorado Boulder

/**
 * GenePair is a pair of alleles for a specific Gene, one inherited from each parent.
 * If an individual's alleles are identical, it is homozygous. If its alleles are different, it is heterozygous.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import naturalSelection from '../../naturalSelection.js';
import Allele, { AlleleStateObject } from './Allele.js';
import Gene, { GeneStateObject } from './Gene.js';

type SelfOptions = EmptySelfOptions;

type GenePairOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

type GenePairStateObject = {
  gene: GeneStateObject;
  fatherAllele: AlleleStateObject;
  motherAllele: AlleleStateObject;
};

export default class GenePair extends PhetioObject {

  // Private because applyState must restore it, but clients should not be able to set it.
  private _gene: Gene;

  public fatherAllele: Allele;
  public motherAllele: Allele;

  public constructor( gene: Gene, fatherAllele: Allele, motherAllele: Allele, providedOptions: GenePairOptions ) {

    const options = optionize<GenePairOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioType: GenePair.GenePairIO
    }, providedOptions );

    super( options );

    this._gene = gene;
    this.fatherAllele = fatherAllele;
    this.motherAllele = motherAllele;
  }

  public get gene(): Gene { return this._gene; }

  /**
   * Mutates the gene pair.
   */
  public mutate( mutantAllele: Allele ): void {

    // The mutation is randomly applied to either the father or mother allele, but not both. If the mutant allele is
    // recessive, the mutation will not immediately affect appearance. It appears in the phenotype in some later
    // generation, when a homozygous recessive bunny is born.
    if ( dotRandom.nextBoolean() ) {
      this.fatherAllele = mutantAllele;
    }
    else {
      this.motherAllele = mutantAllele;
    }
  }

  /**
   * Is this gene pair homozygous (same alleles)?
   */
  public isHomozygous(): boolean {
    return ( this.fatherAllele === this.motherAllele );
  }

  /**
   * Is this gene pair heterozygous (different alleles)?
   */
  public isHeterozygous(): boolean {
    return ( this.fatherAllele !== this.motherAllele );
  }

  /**
   * Gets the allele that determines the bunny's appearance. This is how genotype manifests as phenotype.
   */
  public getVisibleAllele(): Allele {
    if ( this.isHomozygous() ) {
      return this.fatherAllele;
    }
    else {
      const dominantAllele = this.gene.dominantAlleleProperty.value!;
      assert && assert( dominantAllele !== null, 'dominantAllele should not be null' );
      return dominantAllele;
    }
  }

  /**
   * Does this gene pair contain a specific allele?
   */
  public hasAllele( allele: Allele | null ): boolean {
    return ( this.fatherAllele === allele || this.motherAllele === allele );
  }

  /**
   * Gets the genotype abbreviation for the alleles in this gene pair. If there is no dominant gene (and therefore
   * no dominance relationship), then an abbreviation is meaningless, and the empty string is returned.
   * @param translated - true = translated (default), false = untranslated
   */
  public getGenotypeAbbreviation( translated = true ): string {

    const dominantAbbreviation = translated ? this.gene.dominantAbbreviationTranslatedProperty.value : this.gene.dominantAbbreviationEnglish;
    const recessiveAbbreviation = translated ? this.gene.recessiveAbbreviationTranslatedProperty.value : this.gene.recessiveAbbreviationEnglish;

    let s = '';
    const dominantAllele = this.gene.dominantAlleleProperty.value;
    if ( dominantAllele ) {
      s = ( this.fatherAllele === dominantAllele ) ? dominantAbbreviation : recessiveAbbreviation;
      s += ( this.motherAllele === dominantAllele ) ? dominantAbbreviation : recessiveAbbreviation;
    }
    return s;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by GenePairIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * GenePairIO implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Reference type serialization is appropriate because Genotype creates 3 instances of GenePair (one for each Allele).
   * Genotype is itself created by Bunny; there is one Genotype instance per Bunny. And Bunny instances are dynamically
   * created.
   */
  public static readonly GenePairIO = new IOType<GenePair, GenePairStateObject>( 'GenePairIO', {
    valueType: GenePair,
    stateSchema: {
      gene: Gene.GeneIO,
      fatherAllele: Allele.AlleleIO,
      motherAllele: Allele.AlleleIO
    }
    // toStateObject: The default works fine here, and handles serializing this._gene to stateObject.gene.
    // applyStateObject: The default works fine here, and handles deserializing stateObject.gene to this._gene.
  } );
}

naturalSelection.register( 'GenePair', GenePair );