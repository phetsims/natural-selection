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
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import AlleleIO from './AlleleIO.js';
import GenePair from './GenePair.js';
import GenePairIO from './GenePairIO.js';
import GenePool from './GenePool.js';
import GenotypeIO from './GenotypeIO.js';

class Genotype extends PhetioObject {

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
      phetioType: GenotypeIO,
      phetioDocumentation: 'the genetic blueprint for a bunny'
    }, options );

    assert && assert( _.filter( [ options.mutateFur, options.mutateEars, options.mutateTeeth ] ).length <= 1,
      'mutations are mutually exclusive' );

    super( options );

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
      furGenePair: GenePairIO.toStateObject( this.furGenePair ),
      earsGenePair: GenePairIO.toStateObject( this.earsGenePair ),
      teethGenePair: GenePairIO.toStateObject( this.teethGenePair ),
      mutation: NullableIO( ReferenceIO( AlleleIO ) ).toStateObject( this.mutation )
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
      furGenePair: GenePairIO.fromStateObject( stateObject.furGenePair ),
      earsGenePair: GenePairIO.fromStateObject( stateObject.earsGenePair ),
      teethGenePair: GenePairIO.fromStateObject( stateObject.teethGenePair ),
      mutation: NullableIO( ReferenceIO( AlleleIO ) ).fromStateObject( stateObject.mutation )
    };
  }

  /**
   * Restores Genotype state after instantiation.
   * @param {Object} state
   * @public for use by GenotypeIO only
   */
  setValue( state ) {
    required( state );
    this.furGenePair.setValue( state.furGenePair );
    this.earsGenePair.setValue( state.earsGenePair );
    this.teethGenePair.setValue( state.teethGenePair );
    this.mutation = required( state.mutation );
    this.validateInstance();
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
}

naturalSelection.register( 'Genotype', Genotype );
export default Genotype;