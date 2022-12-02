// Copyright 2020-2022, University of Colorado Boulder

/**
 * Gene is the basic physical and functional unit of heredity that is transferred from a parent to its offspring,
 * and controls the expression of a trait. An allele is a variation of a gene. For this sim, we assume that there
 * will only be 2 alleles per gene. Note that gene and allele are often used interchangeably in the literature,
 * but we attempt to use them consistently in this implementation.
 *
 * There is one instance of each gene in the GenePool - i.e., 1 fur gene, 1 ears gene, and 1 teeth gene.
 * A Gene identifies the normal and mutant alleles for the gene, and (if the gene has mutated) defines the
 * dominance relationship between the alleles. See also the 'Mutation' section of model.md at
 * https://github.com/phetsims/natural-selection/blob/master/doc/model.md#mutation
 *
 * Dominance is the effect of one allele masking the expression of a different allele. The first allele is referred
 * to as dominant and the second is recessive. Note that since dominance is a relationship between 2 alleles, it
 * is impossible to have a dominance relationship until the mutation has occurred.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import Allele from './Allele.js';

// Untranslated (English) abbreviations of dominant alleles
type DominantAbbreviationEnglish = 'F' | 'E' | 'T';

// Untranslated (English) abbreviations of recessive alleles
type RecessiveAbbreviationEnglish = 'f' | 'e' | 't';

type SelfOptions = {

  // the name of the gene, visible in the UI
  nameProperty: TReadOnlyProperty<string>;

  // prefix used for tandem names for the gene, like 'fur' for 'furCheckbox'
  tandemPrefix: string;

  // the standard 'normal' or 'wild type' variant of the gene
  normalAllele: Allele;

  // the non-standard 'mutant' variant of the gene
  mutantAllele: Allele;

  // the untranslated (English) abbreviation of the dominant allele, used in query parameters
  dominantAbbreviationEnglish: DominantAbbreviationEnglish;

  // the translated abbreviation of the dominant allele, visible in the UI
  dominantAbbreviationTranslatedProperty: TReadOnlyProperty<string>;

  // {string} the untranslated (English) abbreviation of the recessive allele, used in query parameters
  recessiveAbbreviationEnglish: RecessiveAbbreviationEnglish;

  // {TReadOnlyProperty<string>} the translated abbreviation of the recessive allele, visible in the UI
  recessiveAbbreviationTranslatedProperty: TReadOnlyProperty<string>;

  // the color used to color-code things associated with this gene in the UI
  color: Color | string;
};

type GeneOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export type GeneStateObject = ReferenceIOState; // because GeneIO is a subtype of ReferenceIO

export default class Gene extends PhetioObject {

  // properties that are supplied via SelfOptions
  public readonly nameProperty: TReadOnlyProperty<string>;
  public readonly tandemPrefix: string;
  public readonly normalAllele: Allele;
  public readonly mutantAllele: Allele;
  public readonly dominantAbbreviationEnglish: DominantAbbreviationEnglish;
  public readonly dominantAbbreviationTranslatedProperty: TReadOnlyProperty<string>;
  public readonly recessiveAbbreviationEnglish: RecessiveAbbreviationEnglish;
  public readonly recessiveAbbreviationTranslatedProperty: TReadOnlyProperty<string>;
  public readonly color: Color | string;

  // The dominant allele, null until the gene has mutated.  Until a mutation occurs, only the normal allele exists
  // in the population, and the concepts of dominant and recessive are meaningless.
  public readonly dominantAlleleProperty: Property<Allele | null>;

  // The recessive allele, null until the gene has mutated. Until a mutation occurs, only the normal allele exists
  // in the population, and the concepts of dominant and recessive are meaningless.
  public readonly recessiveAlleleProperty: TReadOnlyProperty<Allele | null>;

  // Is a mutation coming in the next generation of bunnies?
  public readonly mutationComingProperty: Property<boolean>;

  /**
   * Constructor is private. Use the static factory methods: createFurGene, createEarsGene, createTeethGene
   */
  private constructor( providedOptions: GeneOptions ) {

    const options = optionize<GeneOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioType: Gene.GeneIO,
      phetioState: false
    }, providedOptions );

    // validate config fields
    assert && assert( options.tandem.name.startsWith( options.tandemPrefix ),
      `tandem name ${options.tandem.name} must start with ${options.tandemPrefix}` );

    super( options );

    // save options to properties
    this.nameProperty = options.nameProperty;
    this.tandemPrefix = options.tandemPrefix;
    this.normalAllele = options.normalAllele;
    this.mutantAllele = options.mutantAllele;
    this.dominantAbbreviationEnglish = options.dominantAbbreviationEnglish;
    this.dominantAbbreviationTranslatedProperty = options.dominantAbbreviationTranslatedProperty;
    this.recessiveAbbreviationEnglish = options.recessiveAbbreviationEnglish;
    this.recessiveAbbreviationTranslatedProperty = options.recessiveAbbreviationTranslatedProperty;
    this.color = options.color;

    this.dominantAlleleProperty = new Property( null, {
      validValues: [ null, this.normalAllele, this.mutantAllele ],
      tandem: options.tandem.createTandem( 'dominantAlleleProperty' ),
      phetioValueType: NullableIO( Allele.AlleleIO ),
      phetioReadOnly: true
    } );

    this.recessiveAlleleProperty = new DerivedProperty(
      [ this.dominantAlleleProperty ],
      dominantAllele => {
        let recessiveAllele = null;
        if ( dominantAllele ) {
          recessiveAllele = ( dominantAllele === this.normalAllele ) ? this.mutantAllele : this.normalAllele;
        }
        return recessiveAllele;
      }, {
        validValues: [ null, this.normalAllele, this.mutantAllele ],
        tandem: options.tandem.createTandem( 'recessiveAlleleProperty' ),
        phetioValueType: NullableIO( Allele.AlleleIO )
      } );

    this.mutationComingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'mutationComingProperty' ),
      phetioReadOnly: true
    } );
  }

  public reset(): void {
    this.dominantAlleleProperty.reset();
    this.mutationComingProperty.reset();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Cancels a mutation that has been scheduled.
   */
  public cancelMutation(): void {
    assert && assert( this.mutationComingProperty.value, `${this.nameProperty.value} mutation is not scheduled` );
    this.reset();
  }

  /**
   * Creates a gene for fur.
   */
  public static createFurGene( tandem: Tandem ): Gene {
    return new Gene( {
      nameProperty: NaturalSelectionStrings.furStringProperty,
      tandemPrefix: 'fur',
      normalAllele: Allele.WHITE_FUR,
      mutantAllele: Allele.BROWN_FUR,
      dominantAbbreviationEnglish: 'F',
      dominantAbbreviationTranslatedProperty: NaturalSelectionStrings.furDominantStringProperty,
      recessiveAbbreviationEnglish: 'f',
      recessiveAbbreviationTranslatedProperty: NaturalSelectionStrings.furRecessiveStringProperty,
      color: NaturalSelectionColors.FUR,
      tandem: tandem
    } );
  }

  /**
   * Creates a gene for ears.
   */
  public static createEarsGene( tandem: Tandem ): Gene {
    return new Gene( {
      nameProperty: NaturalSelectionStrings.earsStringProperty,
      tandemPrefix: 'ears',
      normalAllele: Allele.STRAIGHT_EARS,
      mutantAllele: Allele.FLOPPY_EARS,
      dominantAbbreviationEnglish: 'E',
      dominantAbbreviationTranslatedProperty: NaturalSelectionStrings.earsDominantStringProperty,
      recessiveAbbreviationEnglish: 'e',
      recessiveAbbreviationTranslatedProperty: NaturalSelectionStrings.earsRecessiveStringProperty,
      color: NaturalSelectionColors.EARS,
      tandem: tandem
    } );
  }

  /**
   * Creates a gene for teeth.
   */
  public static createTeethGene( tandem: Tandem ): Gene {
    return new Gene( {
      nameProperty: NaturalSelectionStrings.teethStringProperty,
      tandemPrefix: 'teeth',
      normalAllele: Allele.SHORT_TEETH,
      mutantAllele: Allele.LONG_TEETH,
      dominantAbbreviationEnglish: 'T',
      dominantAbbreviationTranslatedProperty: NaturalSelectionStrings.teethDominantStringProperty,
      recessiveAbbreviationEnglish: 't',
      recessiveAbbreviationTranslatedProperty: NaturalSelectionStrings.teethRecessiveStringProperty,
      color: NaturalSelectionColors.TEETH,
      tandem: tandem
    } );
  }

  /**
   * GeneIO handles PhET-iO serialization of Gene.
   * It implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static GeneIO = new IOType<Gene, GeneStateObject>( 'GeneIO', {
    valueType: Gene,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}

naturalSelection.register( 'Gene', Gene );

