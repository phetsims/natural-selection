// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCollection is the collection of Bunny instances, with methods for managing that collection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import ObservableArrayIO from '../../../../axon/js/ObservableArrayIO.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import Bunny from './Bunny.js';
import BunnyGroup from './BunnyGroup.js';
import BunnyIO from './BunnyIO.js';
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

    // @private the PhetioGroup that manages Bunny instances as dynamic PhET-iO elements
    this.bunnyGroup = new BunnyGroup( genePool, modelViewTransform, {
      tandem: options.tandem.createTandem( 'bunnyGroup' )
    } );

    // @public (read-only)
    this.totalNumberOfBunniesProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'totalNumberOfBunniesProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies, alive and dead'
    } );

    // @public (read-only) {ObservableArray.<Bunny>} the live bunnies in the group
    this.liveBunnies = new ObservableArray( {
      tandem: options.tandem.createTandem( 'liveBunnies' ),
      phetioType: ObservableArrayIO( ReferenceIO( BunnyIO ) )
    } );

    // @public (read-only) {ObservableArray.<Bunny>} the dead bunnies in the group
    this.deadBunnies = new ObservableArray( {
      tandem: options.tandem.createTandem( 'deadBunnies' ),
      phetioType: ObservableArrayIO( ReferenceIO( BunnyIO ) )
    } );

    // @public notify when a bunny has been created
    this.bunnyCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notify when a bunny has been disposed
    this.bunnyDisposedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notify when has bunny died
    this.bunnyDiedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notifies when all bunnies have died
    this.allBunniesHaveDiedEmitter = new Emitter();

    // @public notifies when bunnies have taken over the world, exceeding the maximum population size
    this.bunniesHaveTakenOverTheWorldEmitter = new Emitter();

    // When a bunny is created...
    this.bunnyGroup.elementCreatedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );

      // When a bunny dies...
      const isAliveListener = isAlive => {
        if ( !isAlive ) {
          bunny.isAliveProperty.unlink( isAliveListener );
          this.liveBunnies.remove( bunny );
          this.deadBunnies.push( bunny );
          this.bunnyDiedEmitter.emit( bunny );
        }
      };
      bunny.isAliveProperty.lazyLink( isAliveListener );

      this.liveBunnies.push( bunny );
      this.totalNumberOfBunniesProperty.value = this.bunnyGroup.length;
      this.bunnyCreatedEmitter.emit( bunny );
    } );

    // When a bunny is disposed...
    this.bunnyGroup.elementDisposedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );
      this.liveBunnies.contains( bunny ) && this.liveBunnies.remove( bunny );
      this.deadBunnies.contains( bunny ) && this.deadBunnies.remove( bunny );
      this.totalNumberOfBunniesProperty.value = this.bunnyGroup.length;
      this.bunnyDisposedEmitter.emit( bunny );
    } );

    // @private
    this.modelViewTransform = modelViewTransform;
    this.genePool = genePool;
  }

  /**
   * Resets the group.
   * @public
   */
  reset() {
    this.bunnyGroup.clear(); // calls dispose for all Bunny instances
    assert && this.assertCountsInSync();
  }

  /**
   * Gets the archetype for the PhetioGroup. This is defined during API harvest via ?phetioPrintAPI and when running
   * studio via ?phetioCreateArchetypes.
   * @returns {Bunny|null}
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
   * Creates a generation-0 Bunny.
   * @returns {Bunny}
   * @public
   */
  createBunnyZero() {
    this.createBunny( {
      father: null,
      mother: null,
      generation: 0
    } );
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
   * Do everything that occurs when the generation changes.
   * @param {number} generation
   * @public
   */
  stepGeneration( generation ) {
    assert && assert( typeof generation === 'number', 'invalid generation' );
    phet.log && phet.log( `generation=${generation}` );

    // Bunnies have a birthday.
    this.ageAllBunnies();

    // Bunnies mate (happy birthday!)
    this.mateAllBunnies( generation );

    assert && this.assertCountsInSync();
    phet.log && phet.log( `live=${this.liveBunnies.length} dead=${this.deadBunnies.length} total=${this.totalNumberOfBunniesProperty.value}` );
  }

  /**
   * Ages all bunnies that are alive. Bunnies that have reached their maximum age will die.
   * @private
   */
  ageAllBunnies() {

    let diedCount = 0;

    // liveBunnies will change if any bunnies die, so operate on a copy
    const bunnies = this.liveBunnies.getArrayCopy();
    bunnies.forEach( bunny => {

      // bunny is one generation older
      bunny.ageProperty.value++;
      assert && assert( bunny.ageProperty.value <= NaturalSelectionConstants.MAX_AGE,
        `bunny age ${bunny.ageProperty.value} exceeded maximum ${NaturalSelectionConstants.MAX_AGE}` );

      // bunny dies if it exceeds the maximum age
      if ( bunny.ageProperty.value === NaturalSelectionConstants.MAX_AGE ) {
        bunny.die();
        diedCount++;
      }
    } );

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
   * @private
   */
  mateAllBunnies( generation ) {

    let bornCount = 0;
    
    // Shuffle the collection of live bunnies so that mating is random.
    const bunnies = phet.joist.random.shuffle( this.liveBunnies.getArray() );

    const numberToBeBorn = Math.floor( bunnies.length / 2 ) * NaturalSelectionConstants.LITTER_SIZE;
    const indicies = [];
    for ( let i = 0; i < numberToBeBorn; i++ ) {
      indicies.push( i );
    }

    //TODO magic numbers from Java version
    const numberToMutate = 1 + Math.floor( numberToBeBorn / 7 );

    // Determine which mutations should be applied, then reset the gene pool.
    const furMutation = this.genePool.furGene.mutationComingProperty.value ? this.genePool.furGene.mutantAllele : null;
    const earsMutation = this.genePool.earsGene.mutationComingProperty.value ? this.genePool.earsGene.mutantAllele : null;
    const teethMutation = this.genePool.teethGene.mutationComingProperty.value ? this.genePool.teethGene.mutantAllele : null;
    this.genePool.resetMutationComing();

    //TODO make these sets of indices mutually exclusive
    // Randomly select indices for the new bunnies that will be mutated
    const furIndices = furMutation ? _.sampleSize( indicies, numberToMutate ) : null;
    const earsIndices = earsMutation ? _.sampleSize( indicies, numberToMutate ) : null;
    const teethIndices = teethMutation ? _.sampleSize( indicies, numberToMutate ) : null;

    // Mate adjacent pairs from the collection.
    for ( let i = 1; i < bunnies.length; i = i + 2 ) {

      const father = bunnies[ i ];
      const mother = bunnies[ i - 1 ];

      for ( let j = 0; j < NaturalSelectionConstants.LITTER_SIZE; j++ ) {

        this.createBunny( {
          father: father,
          mother: mother,
          generation: generation,
          genotypeOptions: {
            furMutation: ( furIndices && furIndices.indexOf( bornCount ) >= 0 ) ? furMutation : null,
            earsMutation: ( earsIndices && earsIndices.indexOf( bornCount ) >= 0 ) ? earsMutation : null,
            teethMutation: ( teethIndices && teethIndices.indexOf( bornCount ) >= 0 ) ? teethMutation : null
          }
        } );

        bornCount++;
      }
    }

    assert && assert( bornCount === numberToBeBorn, 'unexpected number of bunnies were born' );
    phet.log && phet.log( `${bornCount} bunnies born` );

    // Notify if bunnies have taken over the world.
    if ( this.liveBunnies.lengthProperty.value > NaturalSelectionConstants.MAX_POPULATION ) {
      this.bunniesHaveTakenOverTheWorldEmitter.emit();
    }
  }

  /**
   * Asserts that collection counts are in-sync.
   * @private
   */
  assertCountsInSync() {
    const live = this.liveBunnies.length;
    const dead = this.deadBunnies.length;
    const total = this.totalNumberOfBunniesProperty.value;
    const bunnyGroupLength = this.bunnyGroup.length;
    assert( live + dead === total && total === bunnyGroupLength,
      `bunny counts are out of sync, live=${live}, dead=${dead}, total=${total} bunnyGroupLength=${bunnyGroupLength}` );
  }

  /**
   * Moves all live bunnies to the ground, so that we don't have bunnies paused mid-hop.
   * @public
   */
  groundAllBunnies() {
    this.liveBunnies.forEach( bunny => bunny.interruptHop() );
  }
}

naturalSelection.register( 'BunnyCollection', BunnyCollection );
export default BunnyCollection;