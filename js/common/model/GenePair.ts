// Copyright 2020-2022, University of Colorado Boulder

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
   * Serializes a GenePair instance.
   * Because this._gene is private, it does not match the gene field name in stateSchema, and we cannot use
   * the default implementation of toStateObject.
   */
  private toStateObject(): GenePairStateObject {
    return {
      gene: Gene.GeneIO.toStateObject( this._gene ),
      fatherAllele: Allele.AlleleIO.toStateObject( this.fatherAllele ),
      motherAllele: Allele.AlleleIO.toStateObject( this.motherAllele )
    };
  }

  /**
   * Restores GenePair state after instantiation.
   */
  private applyState( stateObject: GenePairStateObject ): void {
    this._gene = Gene.GeneIO.fromStateObject( stateObject.gene );
    this.fatherAllele = Allele.AlleleIO.fromStateObject( stateObject.fatherAllele );
    this.motherAllele = Allele.AlleleIO.fromStateObject( stateObject.motherAllele );
  }

  /**
   * GenePairIO handles PhET-iO serialization of GenePair.
   * It implements 'Dynamic element serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly GenePairIO = new IOType<GenePair, GenePairStateObject>( 'GenePairIO', {
    valueType: GenePair,
    stateSchema: {
      gene: Gene.GeneIO,
      fatherAllele: Allele.AlleleIO,
      motherAllele: Allele.AlleleIO
    },
    toStateObject: genePair => genePair.toStateObject(),
    applyState: ( genePair, stateObject ) => genePair.applyState( stateObject )
  } );
}

naturalSelection.register( 'GenePair', GenePair );
