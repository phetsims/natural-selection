// Copyright 2020, University of Colorado Boulder

/**
 * Genotype is the genetic blueprint for a Bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import Bunny from './Bunny.js';
import GenePair from './GenePair.js';
import GenePairIO from './GenePairIO.js';
import GenePool from './GenePool.js';
import GenotypeIO from './GenotypeIO.js';

class Genotype extends PhetioObject {

  /**
   * @param {GenePool} genePool
   * @param {Allele} fatherFurAllele
   * @param {Allele} motherFurAllele
   * @param {Allele} fatherEarsAllele
   * @param {Allele} motherEarsAllele
   * @param {Allele} fatherTeethAllele
   * @param {Allele} motherTeethAllele
   * @param {Object} [options]
   */
  constructor( genePool, fatherFurAllele, motherFurAllele, fatherEarsAllele, motherEarsAllele,
               fatherTeethAllele, motherTeethAllele, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( fatherFurAllele instanceof Allele, 'invalid fatherFurAllele' );
    assert && assert( motherFurAllele instanceof Allele, 'invalid motherFurAllele' );
    assert && assert( fatherEarsAllele instanceof Allele, 'invalid fatherEarsAllele' );
    assert && assert( motherEarsAllele instanceof Allele, 'invalid motherEarsAllele' );
    assert && assert( fatherTeethAllele instanceof Allele, 'invalid fatherTeethAllele' );
    assert && assert( motherTeethAllele instanceof Allele, 'invalid motherTeethAllele' );

    options = merge( {

      // {boolean} which genes to mutate
      mutateFur: false,
      mutateEars: false,
      mutateTeeth: false,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: GenotypeIO,
      phetioDocumentation: 'the genetic blueprint for a bunny'
    }, options );

    assert && assert( _.filter( [ options.mutateFur, options.mutateEars, options.mutateTeeth ],
      mutation => mutation ).length <= 1, 'mutations are mutually exclusive' );

    super( options );

    // @public (read-only)
    this.furGenePair = new GenePair( genePool.furGene, fatherFurAllele, motherFurAllele, {
      tandem: options.tandem.createTandem( 'furGenePair' ),
      phetioDocumentation: 'gene pair that determines the fur trait'
    } );

    // @public (read-only)
    this.earsGenePair = new GenePair( genePool.earsGene, fatherEarsAllele, motherEarsAllele, {
      tandem: options.tandem.createTandem( 'earsGenePair' ),
      phetioDocumentation: 'gene pair that determines the ears trait'
    } );

    // @public (read-only)
    this.teethGenePair = new GenePair( genePool.teethGene, fatherTeethAllele, motherTeethAllele, {
      tandem: options.tandem.createTandem( 'teethGenePair' ),
      phetioDocumentation: 'gene pair that determines the teeth trait'
    } );

    // After gene pairs have been created, apply mutations. This ensures that an allele is inherited and then modified,
    // so that the distribution of alleles in the population is correct.
    if ( options.mutateFur ) {
      this.furGenePair.mutate( genePool.furGene.mutantAllele );
    }
    if ( options.mutateEars ) {
      this.earsGenePair.mutate( genePool.earsGene.mutantAllele );
    }
    if ( options.mutateTeeth ) {
      this.teethGenePair.mutate( genePool.teethGene.mutantAllele );
    }

    // @public (read-only) identifies an 'original mutant', an individual where a mutation occurred.
    // These individuals have are denoted with a mutation icon in the Pedigree graph.
    this.isOriginalMutant = ( options.mutateFur || options.mutateEars || options.mutateTeeth );

    // @public the translated abbreviation of the Genotype. PhET-iO only, not used in brand=phet.
    // dispose is required.
    const abbreviationProperty = new DerivedProperty(
      [ genePool.furGene.dominantAlleleProperty, genePool.earsGene.dominantAlleleProperty, genePool.teethGene.dominantAlleleProperty ],
      () => {
        return this.furGenePair.getGenotypeAbbreviation() +
               this.earsGenePair.getGenotypeAbbreviation() +
               this.teethGenePair.getGenotypeAbbreviation();
      }, {
        tandem: options.tandem.createTandem( 'abbreviationProperty' ),
        phetioType: DerivedPropertyIO( StringIO ),
        phetioDocumentation: 'the abbreviation that describes the genotype, the empty string if there are no dominant alleles'
      } );

    // @private
    this.disposeGenotype = () => {
      this.furGenePair.dispose();
      this.earsGenePair.dispose();
      this.teethGenePair.dispose();
      abbreviationProperty.dispose();
    };

    this.validateInstance();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeGenotype();
    super.dispose();
  }

  /**
   * Converts a Genotype to its abbreviation, e.g. 'FfEEtt'.
   * This is intended for debugging only. Do not rely on the format!
   * @param {boolean} translated - true = translated (default), false = not translated
   * @returns {string}
   * @public
   */
  toAbbreviation( translated = true ) {
    return this.furGenePair.getGenotypeAbbreviation( translated ) +
           this.earsGenePair.getGenotypeAbbreviation( translated ) +
           this.teethGenePair.getGenotypeAbbreviation( translated );
  }

  /**
   * Creates a Genotype by inheriting from specific parents.
   * @param {GenePool} genePool
   * @param {Bunny} father
   * @param {Bunny} mother
   * @param {Object} [options] - Genotype constructor options
   * @returns {Genotype}
   * @public
   */
  static withParents( genePool, father, mother, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( father instanceof Bunny, 'invalid father' );
    assert && assert( mother instanceof Bunny, 'invalid mother' );

    const fatherGenotype = father.genotype;
    const motherGenotype = mother.genotype;

    return new Genotype( genePool,
      fatherGenotype.furGenePair.getNextChildAllele(), motherGenotype.furGenePair.getNextChildAllele(),
      fatherGenotype.earsGenePair.getNextChildAllele(), motherGenotype.earsGenePair.getNextChildAllele(),
      fatherGenotype.teethGenePair.getNextChildAllele(), motherGenotype.teethGenePair.getNextChildAllele(),
      options );
  }

  /**
   * Creates a Genotype based on a genotype abbreviation string, e.g. 'FfEEtt'.
   * This is used when the initial population has been described using query parameters.
   * @param {GenePool} genePool
   * @param {Alleles} alleles
   * @param {Object} [options]
   * @returns {Genotype}
   * @public
   */
  static withAbbreviation( genePool, alleles, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( alleles, 'invalid alleles' );

    return new Genotype( genePool,
      alleles.fatherFurAllele, alleles.motherFurAllele,
      alleles.fatherEarsAllele, alleles.motherEarsAllele,
      alleles.fatherTeethAllele, alleles.motherTeethAllele,
      options );
  }

  /**
   * Creates a Genotype using the normal allele for every gene. This is typically used for a generation-zero
   * bunny that has no parents, and can therefore not inherit genes.
   * @param genePool
   * @param options
   * @returns {Genotype}
   * @public
   */
  static withNormalAlleles( genePool, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    return new Genotype( genePool,
      genePool.furGene.normalAllele, genePool.furGene.normalAllele,
      genePool.earsGene.normalAllele, genePool.earsGene.normalAllele,
      genePool.teethGene.normalAllele, genePool.teethGene.normalAllele,
      options );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by GenotypeIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes a Genotype to a state object.
   * @returns {Object}
   * @public for use by GenotypeIO only
   */
  toStateObject() {
    return {
      isOriginalMutant: BooleanIO.toStateObject( this.isOriginalMutant ),
      furGenePair: GenePairIO.toStateObject( this.furGenePair ),
      earsGenePair: GenePairIO.toStateObject( this.earsGenePair ),
      teethGenePair: GenePairIO.toStateObject( this.teethGenePair )
    };
  }

  /**
   * Deserializes the state needed by GenotypeIO.setValue.
   * @param {Object} stateObject
   * @returns {Object}
   * @public for use by GenotypeIO only
   */
  static fromStateObject( stateObject ) {
    return {
      isOriginalMutant: BooleanIO.fromStateObject( stateObject.isOriginalMutant ),
      furGenePair: GenePairIO.fromStateObject( stateObject.furGenePair ),
      earsGenePair: GenePairIO.fromStateObject( stateObject.earsGenePair ),
      teethGenePair: GenePairIO.fromStateObject( stateObject.teethGenePair )
    };
  }

  /**
   * Restores Genotype state after instantiation.
   * @param {Object} state
   * @public for use by GenotypeIO only
   */
  setValue( state ) {
    required( state );
    this.isOriginalMutant = required( state.isOriginalMutant );
    this.furGenePair.setValue( state.furGenePair );
    this.earsGenePair.setValue( state.earsGenePair );
    this.teethGenePair.setValue( state.teethGenePair );
    this.validateInstance();
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( typeof this.isOriginalMutant === 'boolean', 'invalid isOriginalMutant' );
    assert && assert( this.furGenePair instanceof GenePair, 'invalid furGenePair' );
    assert && assert( this.earsGenePair instanceof GenePair, 'invalid earsGenePair' );
    assert && assert( this.teethGenePair instanceof GenePair, 'invalid teethGenePair' );
  }
}

naturalSelection.register( 'Genotype', Genotype );
export default Genotype;