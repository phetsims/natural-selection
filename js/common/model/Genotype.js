// Copyright 2020, University of Colorado Boulder

/**
 * Genotype is the genetic blueprint for a Bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import GenePair from './GenePair.js';
import GenePairIO from './GenePairIO.js';
import GenePool from './GenePool.js';
import GenotypeIO from './GenotypeIO.js';

class Genotype extends PhetioObject {

  /**
   * @param {Bunny|null} father
   * @param {Bunny|null} mother
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( father, mother, genePool, options ) {

    assert && assert( father instanceof Bunny || father === null, 'invalid father' );
    assert && assert( mother instanceof Bunny || mother === null, 'invalid mother' );
    assert && assert( ( father && mother ) || ( !father && !mother ), 'bunny cannot have 1 parent' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: GenotypeIO,
      phetioDocumentation: 'the genetic blueprint for a bunny'
    }, options );

    super( options );

    // GenePair options
    const furGenePairOptions = {
      tandem: options.tandem.createTandem( 'furGenePair' ),
      phetioDocumentation: 'gene pair that determines fur trait'
    };
    const earsGenePairOptions = {
      tandem: options.tandem.createTandem( 'earsGenePair' ),
      phetioDocumentation: 'gene pair that determines ears trait'
    };
    const teethGenePairOptions = {
      tandem: options.tandem.createTandem( 'teethGenePair' ),
      phetioDocumentation: 'gene pair that determines teeth trait'
    };

    // @public (read-only) {GenePair} gene pairs for each trait, initialized below
    this.furGenePair = null;
    this.earsGenePair = null;
    this.teethGenePair = null;

    if ( father && mother ) {

      // we have both parents, so determine the child's genotype using Mendelian inheritance
      this.furGenePair = GenePair.combine( father.genotype.furGenePair, mother.genotype.furGenePair, furGenePairOptions );
      this.earsGenePair = GenePair.combine( father.genotype.earsGenePair, mother.genotype.earsGenePair, earsGenePairOptions );
      this.teethGenePair = GenePair.combine( father.genotype.teethGenePair, mother.genotype.teethGenePair, teethGenePairOptions );
    }
    else {

      // no parents, so this bunny gets the genotype for generation 0
      this.furGenePair = genePool.createFurGenePair0( furGenePairOptions );
      this.earsGenePair = genePool.createEarsGenePair0( earsGenePairOptions );
      this.teethGenePair = genePool.createTeethGenePair0( teethGenePairOptions );
    }

    // @private
    this.disposeGenotype = () => {
      this.furGenePair.dispose();
      this.earsGenePair.dispose();
      this.teethGenePair.dispose();
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

  //--------------------------------------------------------------------------------------------------------------------
  // Methods used by GenotypeIO to save and restore state
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes a Genotype to a state object.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      furGenePair: GenePairIO.toStateObject( this.furGenePair ),
      earsGenePair: GenePairIO.toStateObject( this.earsGenePair ),
      teethGenePair: GenePairIO.toStateObject( this.teethGenePair )
    };
  }

  /**
   * Deserializes the state needed by GenotypeIO.setValue.
   * @param {Object} stateObject
   * @returns {Object}
   * @public
   */
  static fromStateObject( stateObject ) {
    return {
      furGenePair: GenePairIO.fromStateObject( stateObject.furGenePair ),
      earsGenePair: GenePairIO.fromStateObject( stateObject.earsGenePair ),
      teethGenePair: GenePairIO.fromStateObject( stateObject.teethGenePair )
    };
  }

  /**
   * Restores Genotype state after instantiation.
   * @param {Object} state
   * @public
   */
  setValue( state ) {
    required( state );
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
    assert && assert( this.furGenePair instanceof GenePair, 'invalid furGenePair' );
    assert && assert( this.earsGenePair instanceof GenePair, 'invalid earsGenePair' );
    assert && assert( this.teethGenePair instanceof GenePair, 'invalid teethGenePair' );
  }
}

naturalSelection.register( 'Genotype', Genotype );
export default Genotype;