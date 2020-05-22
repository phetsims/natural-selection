// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCollection is the collection of Bunny instances, with methods for managing that collection.
 * It encapsulates BunnyGroup (the PhetioGroup), hiding it from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import Bunny from './Bunny.js';
import BunnyArray from './BunnyArray.js';
import BunnyArrayIO from './BunnyArrayIO.js';
import BunnyGroup from './BunnyGroup.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';

class BunnyCollection {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( modelViewTransform, genePool, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // the PhetioGroup that manages Bunny instances as dynamic PhET-iO elements
    const bunnyGroup = new BunnyGroup( genePool, modelViewTransform, {
      tandem: options.tandem.createTandem( 'bunnyGroup' )
    } );

    // @public (read-only) the live bunnies in bunnyGroup
    this.liveBunnies = new BunnyArray( {
      tandem: options.tandem.createTandem( 'liveBunnies' ),
      phetioType: BunnyArrayIO,
      phetioState: false
    } );

    // @public (read-only) the dead bunnies in bunnyGroup
    //TODO this gives us allele counts for dead bunnies, which we may not want in production
    this.deadBunnies = new BunnyArray( {
      tandem: options.tandem.createTandem( 'deadBunnies' ),
      phetioType: BunnyArrayIO,
      phetioState: false
    } );

    // @public notify when a bunny has been created
    this.bunnyCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // NOTE: BunnyCollection has no bunnyDiedEmitter or bunnyDisposedEmitter. Bunny has those Emitters.

    // @public notifies when all bunnies have died
    this.allBunniesHaveDiedEmitter = new Emitter();

    // @public notifies when bunnies have taken over the world, exceeding the maximum population size
    this.bunniesHaveTakenOverTheWorldEmitter = new Emitter();

    // When a bunny is created or restored via PhET-iO
    bunnyGroup.elementCreatedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );

      if ( bunny.isAlive ) {

        // When a bunny dies...
        const diedListener = () => {
          bunny.diedEmitter.removeListener( diedListener );
          this.liveBunnies.remove( bunny );
          this.deadBunnies.push( bunny );
        };
        bunny.diedEmitter.addListener( diedListener );

        this.liveBunnies.push( bunny );
      }
      else {
        assert && assert( phet.joist.sim.isSettingPhetioStateProperty.value,
          'a dead bunny should only be created when restoring PhET-iO state' );
        this.deadBunnies.push( bunny );
      }

      this.bunnyCreatedEmitter.emit( bunny );
    } );

    // When a bunny is disposed...
    bunnyGroup.elementDisposedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );
      this.liveBunnies.contains( bunny ) && this.liveBunnies.remove( bunny );
      this.deadBunnies.contains( bunny ) && this.deadBunnies.remove( bunny );
    } );

    // @private fields needed by methods
    this.genePool = genePool;
    this.bunnyGroup = bunnyGroup;
  }

  /**
   * Resets the group.
   * @public
   */
  reset() {
    this.bunnyGroup.clear(); // calls dispose for all Bunny instances
    assert && this.assertValidCounts();
  }

  /**
   * Gets the archetype for the PhetioGroup.
   * @returns {Bunny|null} non-null only during API harvest
   * @public
   */
  getArchetype() {
    return this.bunnyGroup.archetype;
  }

  /**
   * Creates a Bunny.
   * @param {Object} [options] - options to Bunny constructor
   * @returns {Bunny}
   * @public
   */
  createBunny( options ) {
    return this.bunnyGroup.createNextElement( options );
  }

  /**
   * Creates a generation-zero Bunny.
   * @returns {Bunny}
   * @param {Object} [options]
   * @public
   */
  createBunnyZero( options ) {

    if ( options ) {
      assert && assert( !options.father, 'createBunnyZero sets father' );
      assert && assert( !options.mother, 'createBunnyZero sets mother' );
      assert && assert( options.generation === undefined, 'createBunnyZero sets generation' );
    }

    options = merge( {
      father: null,
      mother: null,
      generation: 0
    }, options );

    this.createBunny( options );
  }

  /**
   * Disposes a Bunny.
   * @param {Bunny} bunny
   * @public
   */
  disposeBunny( bunny ) {
    this.bunnyGroup.disposeElement( bunny );
  }

  /**
   * Moves all bunnies that are alive.
   * @param {number} dt - time step, in seconds
   * @public
   */
  moveBunnies( dt ) {
    this.liveBunnies.forEach( bunny => {
      bunny.step( dt );
    } );
  }

  /**
   * Ages all bunnies that are alive. Bunnies that have reached their maximum age will die.
   * @public
   */
  ageBunnies() {
    assert && assert( _.every( this.liveBunnies.getArray(), bunny => bunny.isAlive ),
      'liveBunnies contains one or more dead bunnies' );

    let diedCount = 0;

    // liveBunnies will change if any bunnies die, so operate on a copy
    const bunnies = this.liveBunnies.getArrayCopy();
    bunnies.forEach( bunny => {

      // bunny is one generation older
      bunny.age++;
      assert && assert( bunny.age <= NaturalSelectionConstants.MAX_AGE,
        `${bunny.tandem.name} age=${bunny.age} exceeds maxAge=${NaturalSelectionConstants.MAX_AGE}` );

      // bunny dies if it exceeds the maximum age
      if ( bunny.age === NaturalSelectionConstants.MAX_AGE ) {
        bunny.die();
        diedCount++;
      }
    } );

    assert && this.assertValidCounts();
    phet.log && phet.log( `${diedCount} bunnies died` );

    // Notify if all bunnies have died.
    if ( this.liveBunnies.lengthProperty.value === 0 ) {
      this.allBunniesHaveDiedEmitter.emit();
    }
  }

  /**
   * Randomly pairs up bunnies and mates them. If there is an odd number of bunnies, then one of them will not mate.
   * Mutations (if any) are applied as the bunnies are born.
   * @param {number} generation
   * @public
   */
  mateBunnies( generation ) {
    assert && NaturalSelectionUtils.assertGeneration( generation );

    let bornIndex = 0;

    // Shuffle the collection of live bunnies so that mating is random.
    const bunnies = phet.joist.random.shuffle( this.liveBunnies.getArray() );

    // The number of bunnies that we expect to be born.
    const numberToBeBorn = Math.floor( bunnies.length / 2 ) * NaturalSelectionConstants.LITTER_SIZE;

    // When a mutation is applied, this is the number of bunnies that will receive that mutation.
    const numberToMutate = 1 + Math.floor( NaturalSelectionConstants.MUTATION_PERCENTAGE * numberToBeBorn );

    // Determine which mutations should be applied, then reset the gene pool.
    const mutateFur = this.genePool.furGene.mutationComingProperty.value;
    const mutateEars = this.genePool.earsGene.mutationComingProperty.value;
    const mutateTeeth = this.genePool.teethGene.mutationComingProperty.value;
    this.genePool.resetMutationComing();

    // Randomly select indices for the new bunnies that will be mutated.
    // Mutations are mutually exclusive, no bunny receives more than 1 mutation.
    let furIndices = [];
    let earsIndices = [];
    let teethIndices = [];
    if ( mutateFur || mutateEars || mutateTeeth ) {

      // Create indices of the new bunnies, for the purpose of applying mutations.
      let indices = [];
      for ( let i = 0; i < numberToBeBorn; i++ ) {
        indices.push( i );
      }

      // Randomly shuffle the indices, so that we can just take how many we need from the beginning of the array.
      indices = phet.joist.random.shuffle( indices );

      // Select indices for each mutation that will be applied by taking indies from the beginning of the array.
      if ( mutateFur ) {
        furIndices = indices.splice( 0, numberToMutate );
      }
      if ( mutateEars ) {
        earsIndices = indices.splice( 0, numberToMutate );
      }
      if ( mutateTeeth ) {
        teethIndices = indices.splice( 0, numberToMutate );
      }
    }
    assert && assert( Array.isArray( furIndices ), 'expected an array' );
    assert && assert( Array.isArray( earsIndices ), 'expected an array' );
    assert && assert( Array.isArray( teethIndices ), 'expected an array' );

    // Mate adjacent pairs from the collection, applying mutations where appropriate.
    for ( let i = 1; i < bunnies.length; i = i + 2 ) {

      const father = bunnies[ i ];
      const mother = bunnies[ i - 1 ];

      for ( let j = 0; j < NaturalSelectionConstants.LITTER_SIZE; j++ ) {

        this.createBunny( {
          father: father,
          mother: mother,
          generation: generation,
          genotypeOptions: {
            mutateFur: ( furIndices.indexOf( bornIndex ) !== -1 ),
            mutateEars: ( earsIndices.indexOf( bornIndex ) !== -1 ),
            mutateTeeth: ( teethIndices.indexOf( bornIndex ) !== -1 )
          }
        } );

        bornIndex++;
      }
    }

    assert && this.assertValidCounts();
    assert && assert( bornIndex === numberToBeBorn, 'unexpected number of bunnies were born' );
    phet.log && phet.log( `${bornIndex} bunnies born` );

    // Notify if bunnies have taken over the world.
    if ( this.liveBunnies.lengthProperty.value >= NaturalSelectionConstants.MAX_POPULATION ) {
      this.bunniesHaveTakenOverTheWorldEmitter.emit();
    }
  }

  /**
   * Moves all live bunnies to the ground, so that we don't have bunnies paused mid-hop.
   * @public
   */
  groundAllBunnies() {
    this.liveBunnies.forEach( bunny => bunny.interruptHop() );
  }

  /**
   * Creates a snapshot of the live bunny counts.
   * @returns {BunnyCountsSnapshot}
   * @public
   */
  createCountsSnapshot() {
    return this.liveBunnies.counts.createSnapshot();
  }

  /**
   * Asserts that collection counts are in-sync with the BunnyGroup.
   * @private
   */
  assertValidCounts() {
    const live = this.liveBunnies.length;
    const dead = this.deadBunnies.length;
    const total = live + dead;
    const bunnyGroupLength = this.bunnyGroup.count;
    assert( live + dead === total && total === bunnyGroupLength,
      `bunny counts are out of sync, live=${live}, dead=${dead}, total=${total} bunnyGroupLength=${bunnyGroupLength}` );
  }
}

naturalSelection.register( 'BunnyCollection', BunnyCollection );
export default BunnyCollection;