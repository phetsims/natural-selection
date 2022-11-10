// Copyright 2020-2022, University of Colorado Boulder

/**
 * Genotype is the genetic blueprint for an individual bunny. It consists of a gene pair for each gene, and
 * can be abbreviated as a string of letters.  See the 'Genotype and Phenotype' section of model.md at
 * https://github.com/phetsims/natural-selection/blob/master/doc/model.md#genotype-and-phenotype
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import GenePair from './GenePair.js';
import GenePool from './GenePool.js';

export default class Genotype extends PhetioObject {

  /**
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( genePool, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {

      // {Allele} alleles that make up the genotype, all of which default to the normal allele
      fatherFurAllele: genePool.furGene.normalAllele,
      motherFurAllele: genePool.furGene.normalAllele,
      fatherEarsAllele: genePool.earsGene.normalAllele,
      motherEarsAllele: genePool.earsGene.normalAllele,
      fatherTeethAllele: genePool.teethGene.normalAllele,
      motherTeethAllele: genePool.teethGene.normalAllele,

      // {boolean} which genes to mutate
      mutateFur: false,
      mutateEars: false,
      mutateTeeth: false,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Genotype.GenotypeIO,
      phetioDocumentation: 'the genetic blueprint for a bunny'
    }, options );

    assert && assert( _.filter( [ options.mutateFur, options.mutateEars, options.mutateTeeth ] ).length <= 1,
      'mutations are mutually exclusive' );

    super( options );

    // @public (read-only)
    this.genePool = genePool;

    // @public (read-only)
    this.furGenePair = new GenePair( genePool.furGene, options.fatherFurAllele, options.motherFurAllele, {
      tandem: options.tandem.createTandem( 'furGenePair' ),
      phetioDocumentation: 'gene pair that determines the fur trait'
    } );

    // @public (read-only)
    this.earsGenePair = new GenePair( genePool.earsGene, options.fatherEarsAllele, options.motherEarsAllele, {
      tandem: options.tandem.createTandem( 'earsGenePair' ),
      phetioDocumentation: 'gene pair that determines the ears trait'
    } );

    // @public (read-only)
    this.teethGenePair = new GenePair( genePool.teethGene, options.fatherTeethAllele, options.motherTeethAllele, {
      tandem: options.tandem.createTandem( 'teethGenePair' ),
      phetioDocumentation: 'gene pair that determines the teeth trait'
    } );

    // @public (read-only) {Allele|null} optional mutation that modified this genotype
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

    // @public the translated abbreviation of the Genotype. PhET-iO only, not used in brand=phet.
    // dispose is required.
    const abbreviationProperty = new DerivedProperty(
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

    // @private {function}
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
   * Does this genotype contain a specific allele?
   * @param {Allele} allele
   * @returns {boolean}
   * @public
   */
  hasAllele( allele ) {
    assert && assert( allele instanceof Allele, 'invalid allele' );
    return ( this.furGenePair.hasAllele( allele ) ||
             this.earsGenePair.hasAllele( allele ) ||
             this.teethGenePair.hasAllele( allele ) );
  }

  /**
   * Converts a Genotype to its untranslated abbreviation, e.g. 'FfEEtt'.
   * This is intended for debugging only. Do not rely on the format!
   * @returns {string}
   * @public
   */
  toAbbreviation() {
    return this.furGenePair.getGenotypeAbbreviation( false ) +
           this.earsGenePair.getGenotypeAbbreviation( false ) +
           this.teethGenePair.getGenotypeAbbreviation( false );
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( this.furGenePair instanceof GenePair, 'invalid furGenePair' );
    assert && assert( this.earsGenePair instanceof GenePair, 'invalid earsGenePair' );
    assert && assert( this.teethGenePair instanceof GenePair, 'invalid teethGenePair' );
    assert && assert( this.mutation instanceof Allele || this.mutation === null, 'invalid mutation' );
  }

  /**
   * Gets the dependencies on dynamic strings that are used to derive the abbreviations for this genotype.
   * These strings may be changed via PhET-iO, or by changing the global localeProperty.
   * @returns {Property.<*>[]}
   * @public
   */
  getAbbreviationStringDependencies() {
    return this.genePool.getGenotypeAbbreviationStringDependencies();
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by GenotypeIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this Genotype instance.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      mutation: NullableIO( Allele.AlleleIO ).toStateObject( this.mutation )
      // furGenePair, earsGenePair, and teethGenePair are stateful and will be serialized automatically.
    };
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType for details.
   * @returns {Object.<string,IOType>}
   * @public
   */
  static get STATE_SCHEMA() {
    return {
      mutation: NullableIO( Allele.AlleleIO )
    };
  }


  /**
   * Restores Genotype stateObject after instantiation.
   * @param {Object} stateObject
   * @public
   */
  applyState( stateObject ) {
    required( stateObject );
    this.mutation = required( NullableIO( Allele.AlleleIO ).fromStateObject( stateObject.mutation ) );
    this.validateInstance();
  }
}

/**
 * GenotypeIO handles PhET-iO serialization of Genotype.  It does so by delegating to Genotype.
 * The methods that it implements are typical of 'Dynamic element serialization', as described in
 * the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 * @public
 */
Genotype.GenotypeIO = new IOType( 'GenotypeIO', {
  valueType: Genotype,
  toStateObject: genotype => genotype.toStateObject(),
  applyState: ( genotype, stateObject ) => genotype.applyState( stateObject ),
  stateSchema: Genotype.STATE_SCHEMA
} );

naturalSelection.register( 'Genotype', Genotype );