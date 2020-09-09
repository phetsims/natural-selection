// Copyright 2020, University of Colorado Boulder

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
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import Allele from './Allele.js';

class Gene extends PhetioObject {

  /**
   * @param {string} name
   * @param {Allele} normalAllele - the standard 'normal' or 'wild type' variant of the gene
   * @param {Allele} mutantAllele - the non-standard 'mutant' variant of the gene
   * @param {string} dominantAbbreviationEnglish - the untranslated (English) abbreviation of the dominant allele
   * @param {string} dominantAbbreviationTranslated - the translated abbreviation of the dominant allele
   * @param {string} recessiveAbbreviationEnglish - the untranslated (English) abbreviation of the recessive allele
   * @param {string} recessiveAbbreviationTranslated - the translated abbreviation of the recessive allele
   * @param {Color|string} color - the color used to color-code things associated with this gene in the UI
   * @param {Object} [options]
   */
  constructor( name, normalAllele, mutantAllele, dominantAbbreviationEnglish, dominantAbbreviationTranslated,
               recessiveAbbreviationEnglish, recessiveAbbreviationTranslated, color, options ) {

    assert && assert( typeof name === 'string', 'invalid name' );
    assert && assert( normalAllele instanceof Allele, 'invalid normalAllele' );
    assert && assert( mutantAllele instanceof Allele, 'invalid mutantAllele' );
    assert && assert( typeof dominantAbbreviationEnglish === 'string', 'invalid dominantAbbreviationEnglish' );
    assert && assert( typeof dominantAbbreviationTranslated === 'string', 'invalid dominantAbbreviationTranslated' );
    assert && assert( typeof recessiveAbbreviationEnglish === 'string', 'invalid recessiveAbbreviationEnglish' );
    assert && assert( typeof recessiveAbbreviationTranslated === 'string', 'invalid recessiveAbbreviationTranslated' );
    assert && assert( color instanceof Color || typeof color === 'string', 'invalid recessiveAbbreviationTranslated' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Gene.GeneIO
    }, options );

    super( options );

    // @public (read-only)
    this.name = name;
    this.normalAllele = normalAllele;
    this.mutantAllele = mutantAllele;
    this.dominantAbbreviationEnglish = dominantAbbreviationEnglish;
    this.dominantAbbreviationTranslated = dominantAbbreviationTranslated;
    this.recessiveAbbreviationEnglish = recessiveAbbreviationEnglish;
    this.recessiveAbbreviationTranslated = recessiveAbbreviationTranslated;
    this.color = color;

    // @public {Allele|null} the dominate allele, null until the gene has mutated.  Until a mutation occurs,
    // only the normal allele exists in the population, and the concepts of dominant and recessive are meaningless.
    this.dominantAlleleProperty = new Property( null, {
      validValues: [ null, normalAllele, mutantAllele ],
      tandem: options.tandem.createTandem( 'dominantAlleleProperty' ),
      phetioType: PropertyIO( NullableIO( Allele.AlleleIO ) ),
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
          recessiveAllele = ( dominantAllele === normalAllele ) ? mutantAllele : normalAllele;
        }
        return recessiveAllele;
      }, {
        validValues: [ null, normalAllele, mutantAllele ],
        tandem: options.tandem.createTandem( 'recessiveAlleleProperty' ),
        phetioType: DerivedPropertyIO( NullableIO( Allele.AlleleIO ) )
      } );

    // @public is a mutation coming in the next generation of bunnies?
    this.mutationComingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'mutationComingProperty' ),
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
   * @param {Object} [options] - options for Gene constructor
   * @returns {Gene}
   * @public
   */
  static createFurGene( options ) {
    return new Gene( naturalSelectionStrings.fur,
      Allele.WHITE_FUR, Allele.BROWN_FUR,
      'F', naturalSelectionStrings.furDominant,
      'f', naturalSelectionStrings.furRecessive,
      NaturalSelectionColors.FUR,
      options );
  }

  /**
   * Creates a gene for ears.
   * @param {Object} [options] - options for Gene constructor
   * @returns {Gene}
   * @public
   */
  static createEarsGene( options ) {
    return new Gene( naturalSelectionStrings.ears,
      Allele.STRAIGHT_EARS, Allele.FLOPPY_EARS,
      'E', naturalSelectionStrings.earsDominant,
      'e', naturalSelectionStrings.earsRecessive,
      NaturalSelectionColors.EARS,
      options );
  }

  /**
   * Creates a gene for teeth.
   * @param {Object} [options] - options for Gene constructor
   * @returns {Gene}
   * @public
   */
  static createTeethGene( options ) {
    return new Gene( naturalSelectionStrings.teeth,
      Allele.SHORT_TEETH, Allele.LONG_TEETH,
      'T', naturalSelectionStrings.teethDominant,
      't', naturalSelectionStrings.teethRecessive,
      NaturalSelectionColors.TEETH,
      options );
  }
}

/**
 * GeneIO handles PhET-iO serialization of Gene. It implements 'Reference type serialization',
 * as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-guide.md#serialization
 */
class GeneIO extends ReferenceIO( ObjectIO ) {}

ObjectIO.setIOTypeFields( GeneIO, 'GeneIO', Gene );

// @public
Gene.GeneIO = GeneIO;

naturalSelection.register( 'Gene', Gene );
export default Gene;

