// Copyright 2020, University of Colorado Boulder

/**
 * Genes come in pairs, called alleles, and each pair is located in a specific position (or locus) on a chromosome.
 * If the two alleles at a locus are identical to each other, they are homozygous; if they are different from one
 * another, they are heterozygous.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import AlleleIO from './AlleleIO.js';
import Gene from './Gene.js';
import GeneIO from './GeneIO.js';
import GenePairIO from './GenePairIO.js';

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
      phetioType: GenePairIO
    }, options );

    super( options );

    // @public (read-only)
    this.gene = gene;
    this.fatherAllele = fatherAllele;
    this.motherAllele = motherAllele;

    // @private {Allele[]} alleles that will be passed on to children
    this.childAlleles = phet.joist.random.shuffle( [ fatherAllele, fatherAllele, motherAllele, motherAllele ] );
    this.childAllelesIndex = 0;
  }

  /**
   * Is this gene pair homozygous (same alleles)?
   * @returns {boolean}
   */
  isHomozygous() {
    return ( this.fatherAllele === this.motherAllele );
  }

  /**
   * Is this gene pair heterozygous (different alleles)?
   * @returns {boolean}
   */
  isHeterozygous() {
    return ( this.fatherAllele !== this.motherAllele );
  }

  /**
   * Gets the next allele for a child.
   * @returns {Allele}
   * @public
   */
  getNextChildAllele() {
    if ( this.childAllelesIndex >= this.childAlleles.length ) {
      this.childAllelesIndex = 0;
    }
    return this.childAlleles[ this.childAllelesIndex++ ];
  }

  /**
   * Returns the allele that determines how this genotype manifests as phenotype.
   * @returns {Allele}
   * @public
   */
  getPhenotype() {
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
   * Combines father and mother gene pairs to produce a child's gene pair, using Mendelian inheritance.  That is,
   * gametes are created by random segregation, and heterozygous individuals produce gametes with an equal frequency
   * of the two alleles.
   * @param {GenePair} fatherGenePair
   * @param {GenePair} motherGenePair
   * @param {Object} [options] - GenePair constructor options
   * @returns {GenePair}
   * @public
   * @static
   */
  static combine( fatherGenePair, motherGenePair, options ) {
    assert && assert( fatherGenePair instanceof GenePair, 'invalid fatherGenePair' );
    assert && assert( motherGenePair instanceof GenePair, 'invalid motherGenePair' );
    assert && assert( fatherGenePair.gene === motherGenePair.gene, 'gene mismatch' );

    return new GenePair( fatherGenePair.gene, fatherGenePair.getNextChildAllele(), motherGenePair.getNextChildAllele(), options );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Methods used by GenePairIO to save and restore state
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes a GenePair to a state object.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      gene: GeneIO.toStateObject( this.gene ),
      fatherAllele: AlleleIO.toStateObject( this.fatherAllele ),
      motherAllele: AlleleIO.toStateObject( this.motherAllele ),
      childAlleles: ArrayIO( AlleleIO ).toStateObject( this.childAlleles ),
      childAllelesIndex: NumberIO.toStateObject( this.childAllelesIndex )
    };
  }

  /**
   * Deserializes the state needed by GenePairIO.setValue.
   * @param {Object} stateObject
   * @returns {Object}
   * @public
   */
  static fromStateObject( stateObject ) {
    return {
      gene: GeneIO.fromStateObject( stateObject.gene ),
      fatherAllele: AlleleIO.fromStateObject( stateObject.fatherAllele ),
      motherAllele: AlleleIO.fromStateObject( stateObject.motherAllele ),
      childAlleles: ArrayIO( AlleleIO ).fromStateObject( stateObject.childAlleles ),
      childAllelesIndex: NumberIO.fromStateObject( stateObject.childAllelesIndex )
    };
  }

  /**
   * Restores GenePair state after instantiation.
   * @param {Object} state
   * @public
   */
  setValue( state ) {
    required( state );
    this.gene = required( state.gene );
    this.fatherAllele = required( state.fatherAllele );
    this.motherAllele = required( state.motherAllele );
    this.childAlleles = required( state.childAlleles );
    this.childAllelesIndex = required( state.childAllelesIndex );
  }
}

naturalSelection.register( 'GenePair', GenePair );
export default GenePair;
