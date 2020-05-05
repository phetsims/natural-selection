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
   * @param {GenePool} genePool
   * @param {Bunny|null} father
   * @param {Bunny|null} mother
   * @param {Object} [options]
   */
  constructor( genePool, father, mother, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( father instanceof Bunny || father === null, 'invalid father' );
    assert && assert( mother instanceof Bunny || mother === null, 'invalid mother' );
    assert && assert( ( father && mother ) || ( !father && !mother ), 'bunny cannot have 1 parent' );

    options = merge( {

      // {Allele|null} mutations to be applied
      furMutation: null,
      earsMutation: null,
      teethMutation: null,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: GenotypeIO,
      phetioDocumentation: 'the genetic blueprint for a bunny'
    }, options );

    assert && assert( _.filter( [ options.furMutation, options.earsMutation, options.teethMutation ],
      mutation => mutation ).length <= 1, 'at most 1 mutation can be specified' );

    super( options );

    // @public (read-only) is the first a member of the generation that first received a mutation?
    this.isFirstGenerationMutant = ( options.furMutation || options.earsMutation || options.teethMutation );

    // @public (read-only)
    this.furGenePair = GenePair.fromParents( genePool.furGene,
      father ? father.genotype.furGenePair : null,
      mother ? mother.genotype.furGenePair : null, {
        mutation: options.furMutation,
        tandem: options.tandem.createTandem( 'furGenePair' ),
        phetioDocumentation: 'gene pair that determines fur trait'
      } );

    // @public (read-only)
    this.earsGenePair = GenePair.fromParents( genePool.earsGene,
      father ? father.genotype.earsGenePair : null,
      mother ? mother.genotype.earsGenePair : null, {
      mutation: options.earsMutation,
      tandem: options.tandem.createTandem( 'earsGenePair' ),
      phetioDocumentation: 'gene pair that determines ears trait'
    } );

    // @public (read-only)
    this.teethGenePair = GenePair.fromParents( genePool.teethGene,
      father ? father.genotype.teethGenePair : null,
      mother ? mother.genotype.teethGenePair : null, {
      mutation: options.teethMutation,
      tandem: options.tandem.createTandem( 'teethGenePair' ),
      phetioDocumentation: 'gene pair that determines teeth trait'
    } );

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

  /**
   * Converts a Genotype to its abbreviation, e.g. 'FfEEtt'.
   * This is intended for debugging only. Do not rely on the format!
   * @returns {string}
   * @public
   */
  toAbbreviation() {
    return this.furGenePair.getAllelesAbbreviation() +
           this.earsGenePair.getAllelesAbbreviation() +
           this.teethGenePair.getAllelesAbbreviation();
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