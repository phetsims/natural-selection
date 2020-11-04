// Copyright 2020, University of Colorado Boulder

/**
 * GenePair is a pair of alleles for a specific Gene, one inherited from each parent.
 * If an individual's alleles are identical, it is homozygous. If its alleles are different, it is heterozygous.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import Gene from './Gene.js';

class GenePair extends PhetioObject {

  /**
   * @param {Gene} gene - the associated gene
   * @param {Allele} fatherAllele - the allele that is inherited from the father
   * @param {Allele} motherAllele - the allele that is inherited from the mother
   * @param {Object} [options]
   */
  constructor( gene, fatherAllele, motherAllele, options ) {

    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && assert( fatherAllele instanceof Allele, 'invalid fatherAllele' );
    assert && assert( motherAllele instanceof Allele, 'invalid motherAllele' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: GenePair.GenePairIO
    }, options );

    super( options );

    // @public (read-only)
    this.gene = gene;
    this.fatherAllele = fatherAllele;
    this.motherAllele = motherAllele;

    this.validateInstance();
  }

  /**
   * Mutates the gene pair.
   * @param {Allele} mutantAllele
   * @public
   */
  mutate( mutantAllele ) {
    assert && assert( mutantAllele instanceof Allele, 'invalid mutantAllele' );

    // The mutation is randomly applied to either the father or mother allele, but not both. If the mutant allele is
    // recessive, the mutation will not immediately affect appearance. It appears in the phenotype in some later
    // generation, when a homozygous recessive bunny is born.
    if ( phet.joist.random.nextBoolean() ) {
      this.fatherAllele = mutantAllele;
    }
    else {
      this.motherAllele = mutantAllele;
    }
  }

  /**
   * Is this gene pair homozygous (same alleles)?
   * @returns {boolean}
   * @public
   */
  isHomozygous() {
    return ( this.fatherAllele === this.motherAllele );
  }

  /**
   * Is this gene pair heterozygous (different alleles)?
   * @returns {boolean}
   * @public
   */
  isHeterozygous() {
    return ( this.fatherAllele !== this.motherAllele );
  }

  /**
   * Gets the allele that determines the bunny's appearance. This is how genotype manifests as phenotype.
   * @returns {Allele}
   * @public
   */
  getVisibleAllele() {
    if ( this.isHomozygous() ) {
      return this.fatherAllele;
    }
    else {
      const dominantAllele = this.gene.dominantAlleleProperty.value;
      assert && assert( dominantAllele !== null, 'dominantAllele should not be null' );
      return dominantAllele;
    }
  }

  /**
   * Does this gene pair contain a specific allele?
   * @param {Allele} allele
   * @returns {boolean}
   * @public
   */
  hasAllele( allele ) {
    assert && assert( allele instanceof Allele, 'invalid allele' );
    return ( this.fatherAllele === allele || this.motherAllele === allele );
  }

  /**
   * Gets the genotype abbreviation for the alleles in this gene pair. If there is no dominant gene (and therefore
   * no dominance relationship), then an abbreviation is meaningless, and the empty string is returned.
   * @param {boolean} translated - true = translated (default), false = untranslated
   * @returns {string}
   * @public
   */
  getGenotypeAbbreviation( translated = true ) {

    const dominantAbbreviation = translated ? this.gene.dominantAbbreviationTranslated : this.gene.dominantAbbreviationEnglish;
    const recessiveAbbreviation = translated ? this.gene.recessiveAbbreviationTranslated : this.gene.recessiveAbbreviationEnglish;

    let s = '';
    const dominantAllele = this.gene.dominantAlleleProperty.value;
    if ( dominantAllele ) {
      s = ( this.fatherAllele === dominantAllele ) ? dominantAbbreviation : recessiveAbbreviation;
      s += ( this.motherAllele === dominantAllele ) ? dominantAbbreviation : recessiveAbbreviation;
    }
    return s;
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( this.gene instanceof Gene, 'invalid gene' );
    assert && assert( this.fatherAllele instanceof Allele, 'invalid fatherAllele' );
    assert && assert( this.motherAllele instanceof Allele, 'invalid motherAllele' );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by GenePairIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes a GenePair instance.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      gene: Gene.GeneIO.toStateObject( this.gene ),
      fatherAllele: Allele.AlleleIO.toStateObject( this.fatherAllele ),
      motherAllele: Allele.AlleleIO.toStateObject( this.motherAllele )
    };
  }

  /**
   * Restores GenePair state after instantiation.
   * @param {Object} stateObject
   * @public
   */
  applyState( stateObject ) {
    required( stateObject );
    this.gene = required( Gene.GeneIO.fromStateObject( stateObject.gene ) );
    this.fatherAllele = required( Allele.AlleleIO.fromStateObject( stateObject.fatherAllele ) );
    this.motherAllele = required( Allele.AlleleIO.fromStateObject( stateObject.motherAllele ) );
    this.validateInstance();
  }
}

/**
 * GenePairIO handles PhET-iO serialization of GenePair. It does so by delegating to Genotype.
 * The methods that it implements are typical of 'Dynamic element serialization', as described in
 * the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 * @public
 */
GenePair.GenePairIO = new IOType( 'GenePairIO', {
  valueType: GenePair,
  toStateObject: genePair => genePair.toStateObject(),
  applyState: ( genePair, stateObject ) => genePair.applyState( stateObject )
} );

naturalSelection.register( 'GenePair', GenePair );
export default GenePair;
