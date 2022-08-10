// Copyright 2020-2021, University of Colorado Boulder

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
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import Allele from './Allele.js';

class Gene extends PhetioObject {

  /**
   * @param {Object} config
   * @private - use the static factory methods: createFurGene, createEarsGene, createTeethGene
   */
  constructor( config ) {

    config = merge( {

      // {string} the name of the gene, visible in the UI
      name: required( config.name ),

      // {string} prefix used for tandem names for the gene, like 'fur' for 'furCheckbox'
      tandemPrefix: required( config.tandemPrefix ),

      // {Allele} the standard 'normal' or 'wild type' variant of the gene
      normalAllele: required( config.normalAllele ),

      // {Allele} the non-standard 'mutant' variant of the gene
      mutantAllele: required( config.mutantAllele ),

      // {string} the untranslated (English) abbreviation of the dominant allele, used in query parameters
      dominantAbbreviationEnglish: required( config.dominantAbbreviationEnglish ),

      // {string} the translated abbreviation of the dominant allele, visible in the UI
      dominantAbbreviationTranslated: required( config.dominantAbbreviationTranslated ),

      // {string} the untranslated (English) abbreviation of the recessive allele, used in query parameters
      recessiveAbbreviationEnglish: required( config.recessiveAbbreviationEnglish ),

      // {string} the translated abbreviation of the recessive allele, visible in the UI
      recessiveAbbreviationTranslated: required( config.recessiveAbbreviationTranslated ),

      // {Color|string} the color used to color-code things associated with this gene in the UI
      color: required( config.color ),

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Gene.GeneIO,
      phetioState: false
    }, config );

    // validate config fields
    assert && assert( typeof config.name === 'string', 'invalid name' );
    assert && assert( typeof config.tandemPrefix === 'string', 'invalid tandemPrefix' );
    assert && assert( config.normalAllele instanceof Allele, 'invalid normalAllele' );
    assert && assert( config.mutantAllele instanceof Allele, 'invalid mutantAllele' );
    assert && assert( typeof config.dominantAbbreviationEnglish === 'string', 'invalid dominantAbbreviationEnglish' );
    assert && assert( typeof config.dominantAbbreviationTranslated === 'string', 'invalid dominantAbbreviationTranslated' );
    assert && assert( typeof config.recessiveAbbreviationEnglish === 'string', 'invalid recessiveAbbreviationEnglish' );
    assert && assert( typeof config.recessiveAbbreviationTranslated === 'string', 'invalid recessiveAbbreviationTranslated' );
    assert && assert( config.color instanceof Color || typeof config.color === 'string', 'invalid color' );
    assert && assert( config.tandem.name.startsWith( config.tandemPrefix ),
      `tandem name ${config.tandem.name} must start with ${config.tandemPrefix}` );

    super( config );

    // @public (read-only)
    this.name = config.name;
    this.tandemPrefix = config.tandemPrefix;
    this.normalAllele = config.normalAllele;
    this.mutantAllele = config.mutantAllele;
    this.dominantAbbreviationEnglish = config.dominantAbbreviationEnglish;
    this.dominantAbbreviationTranslated = config.dominantAbbreviationTranslated;
    this.recessiveAbbreviationEnglish = config.recessiveAbbreviationEnglish;
    this.recessiveAbbreviationTranslated = config.recessiveAbbreviationTranslated;
    this.color = config.color;

    // @public {Allele|null} the dominate allele, null until the gene has mutated.  Until a mutation occurs,
    // only the normal allele exists in the population, and the concepts of dominant and recessive are meaningless.
    this.dominantAlleleProperty = new Property( null, {
      validValues: [ null, this.normalAllele, this.mutantAllele ],
      tandem: config.tandem.createTandem( 'dominantAlleleProperty' ),
      phetioValueType: NullableIO( Allele.AlleleIO ),
      phetioReadOnly: true
    } );

    // @public {Allele|null} the recessive allele, null until the gene has mutated. Until a mutation occurs,
    // only the normal allele exists in the population, and the concepts of dominant and recessive are meaningless.
    // dispose is not necessary.
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
        tandem: config.tandem.createTandem( 'recessiveAlleleProperty' ),
        phetioValueType: NullableIO( Allele.AlleleIO )
      } );

    // @public is a mutation coming in the next generation of bunnies?
    this.mutationComingProperty = new BooleanProperty( false, {
      tandem: config.tandem.createTandem( 'mutationComingProperty' ),
      phetioReadOnly: true
    } );
  }

  /**
   * @public
   */
  reset() {
    this.dominantAlleleProperty.reset();
    this.mutationComingProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Cancels a mutation that has been scheduled.
   * @public
   */
  cancelMutation() {
    assert && assert( this.mutationComingProperty.value, `${this.name} mutation is not scheduled` );
    this.reset();
  }

  /**
   * Creates a gene for fur.
   * @param {Tandem} tandem
   * @returns {Gene}
   * @public
   */
  static createFurGene( tandem ) {
    return new Gene( {
      name: naturalSelectionStrings.fur,
      tandemPrefix: 'fur',
      normalAllele: Allele.WHITE_FUR,
      mutantAllele: Allele.BROWN_FUR,
      dominantAbbreviationEnglish: 'F',
      dominantAbbreviationTranslated: naturalSelectionStrings.furDominant,
      recessiveAbbreviationEnglish: 'f',
      recessiveAbbreviationTranslated: naturalSelectionStrings.furRecessive,
      color: NaturalSelectionColors.FUR,
      tandem: tandem
    } );
  }

  /**
   * Creates a gene for ears.
   * @param {Tandem} tandem
   * @returns {Gene}
   * @public
   */
  static createEarsGene( tandem ) {
    return new Gene( {
      name: naturalSelectionStrings.ears,
      tandemPrefix: 'ears',
      normalAllele: Allele.STRAIGHT_EARS,
      mutantAllele: Allele.FLOPPY_EARS,
      dominantAbbreviationEnglish: 'E',
      dominantAbbreviationTranslated: naturalSelectionStrings.earsDominant,
      recessiveAbbreviationEnglish: 'e',
      recessiveAbbreviationTranslated: naturalSelectionStrings.earsRecessive,
      color: NaturalSelectionColors.EARS,
      tandem: tandem
    } );
  }

  /**
   * Creates a gene for teeth.
   * @param {Tandem} tandem
   * @returns {Gene}
   * @public
   */
  static createTeethGene( tandem ) {
    return new Gene( {
      name: naturalSelectionStrings.teeth,
      tandemPrefix: 'teeth',
      normalAllele: Allele.SHORT_TEETH,
      mutantAllele: Allele.LONG_TEETH,
      dominantAbbreviationEnglish: 'T',
      dominantAbbreviationTranslated: naturalSelectionStrings.teethDominant,
      recessiveAbbreviationEnglish: 't',
      recessiveAbbreviationTranslated: naturalSelectionStrings.teethRecessive,
      color: NaturalSelectionColors.TEETH,
      tandem: tandem
    } );
  }
}

/**
 * GeneIO handles PhET-iO serialization of Gene. It implements 'Reference type serialization',
 * as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 * @public
 */
Gene.GeneIO = new IOType( 'GeneIO', {
  valueType: Gene,
  supertype: ReferenceIO( IOType.ObjectIO )
} );

naturalSelection.register( 'Gene', Gene );
export default Gene;

