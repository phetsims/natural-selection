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
import Bunny from './Bunny.js';
import Gene from './Gene.js';
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

    // @public (read-only) whether this is the Genotype for a Bunny that is the first to receive some mutation
    this.isOriginalMutant = !!( options.mutateFur || options.mutateEars || options.mutateTeeth );

    // Parent gene pairs, null if the Bunny had no parents
    const fatherFurGenePair = father ? father.genotype.furGenePair : null;
    const motherFurGenePair = mother ? mother.genotype.furGenePair : null;
    const fatherEarsGenePair = father ? father.genotype.earsGenePair : null;
    const motherEarsGenePair = mother ? mother.genotype.earsGenePair : null;
    const fatherTeethGenePair = father ? father.genotype.teethGenePair : null;
    const motherTeethGenePair = mother ? mother.genotype.teethGenePair : null;

    // @public (read-only) {GenePair} for fur
    this.furGenePair = createChildGenePair( genePool.furGene, options.mutateFur, fatherFurGenePair, motherFurGenePair, {
      tandem: options.tandem.createTandem( 'furGenePair' ),
      phetioDocumentation: 'gene pair that determines fur trait'
    } );

    // @public (read-only) {GenePair} for ears
    this.earsGenePair = createChildGenePair( genePool.earsGene, options.mutateEars, fatherEarsGenePair, motherEarsGenePair, {
      tandem: options.tandem.createTandem( 'earsGenePair' ),
      phetioDocumentation: 'gene pair that determines ears trait'
    } );

    // @public (read-only) {GenePair} for teeth
    this.teethGenePair = createChildGenePair( genePool.teethGene, options.mutateTeeth, fatherTeethGenePair, motherTeethGenePair, {
      tandem: options.tandem.createTandem( 'teethGenePair' ),
      phetioDocumentation: 'gene pair that determines teeth trait'
    } );

    // @public the translated abbreviation of the Genotype. PhET-iO only, not used in brand=phet
    const abbreviationProperty = new DerivedProperty(
      [ genePool.furGene.dominantAlleleProperty, genePool.earsGene.dominantAlleleProperty, genePool.teethGene.dominantAlleleProperty ],
      () => {
        return this.furGenePair.getAllelesAbbreviation() +
               this.earsGenePair.getAllelesAbbreviation() +
               this.teethGenePair.getAllelesAbbreviation();
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
    return this.furGenePair.getAllelesAbbreviation( translated ) +
           this.earsGenePair.getAllelesAbbreviation( translated ) +
           this.teethGenePair.getAllelesAbbreviation( translated );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by GenotypeIO to save and restore PhET-iO state.
  // NOTE! If you add a field to Genotype that is not itself a PhET-iO element, you will like need to add it to
  // toStateObject, fromStateObject, setValue, and validateInstance.
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

/**
 * Creates the GenePair for a child Bunny.
 * @param {Gene} gene - the GenePair is associated with this Gene
 * @param {boolean} mutate - whether to mutate the gene
 * @param {GenePair|null} fatherGenePair - null if the Bunny had no father
 * @param {GenePair|null} motherGenePair - null if the Bunny had no mother
 * @param {Object} [options] - options to GenePair construct
 * @returns {GenePair}
 */
function createChildGenePair( gene, mutate, fatherGenePair, motherGenePair, options ) {
  assert && assert( gene instanceof Gene, 'invalid gene' );
  assert && assert( typeof mutate === 'boolean', 'invalid mutate' );
  assert && assert( fatherGenePair instanceof GenePair || fatherGenePair === null, 'invalid fatherGenePair' );
  assert && assert( motherGenePair instanceof GenePair || motherGenePair === null, 'invalid motherGenePair' );
  assert && assert( ( fatherGenePair && motherGenePair ) || ( !fatherGenePair && !motherGenePair ), 'bunny cannot have 1 parent' );

  if ( mutate ) {

    // The gene has mutated. Set both alleles to the mutant allele, so that the mutation will appear in the phenotype.
    return new GenePair( gene, gene.mutantAllele, gene.mutantAllele, options );
  }
  else if ( fatherGenePair && motherGenePair ) {

    // Inherit alleles from the parents (Mendelian inheritance)
    return new GenePair( gene, fatherGenePair.getNextChildAllele(), motherGenePair.getNextChildAllele(), options );
  }
  else {

    // There were no parents (generation-zero Bunny), so use the gene's normal alleles.
    return new GenePair( gene, gene.normalAllele, gene.normalAllele, options );
  }
}

naturalSelection.register( 'Genotype', Genotype );
export default Genotype;