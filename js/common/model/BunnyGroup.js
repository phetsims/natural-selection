// Copyright 2020, University of Colorado Boulder

/**
 * BunnyGroup is the PhetioGroup for Bunny.  It manages dynamic instances of Bunny.
 * All Bunny instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import ObservableArrayIO from '../../../../axon/js/ObservableArrayIO.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import Bunny from './Bunny.js';
import BunnyIO from './BunnyIO.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';
import SpriteDirection from './SpriteDirection.js';

// constants
const LITTER_SIZE = 4; // number of bunnies born each time a pair mates

class BunnyGroup extends PhetioGroup {

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
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( BunnyIO ),
      phetioDocumentation: 'TODO'
    }, options );

    /**
     * Called to instantiate a Bunny. Note that modelViewTransform and genePool are passed via closure, so we don't
     * have to create it as part of defaultArguments, and don't have to deal with serializing it in BunnyIO.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Object} bunnyOptions - options to Bunny constructor, not actually optional, because createElement
     *                                must have a fixed number of args
     * @returns {Bunny}
     */
    const createElement = ( tandem, bunnyOptions ) => {
      return new Bunny( modelViewTransform, genePool, merge( {}, bunnyOptions, {
        tandem: tandem
      } ) );
    };

    // defaultArguments, passed to createElement during API harvest (when running 'grunt generate-phet-io-api-files').
    const defaultArguments = [ {} ];

    super( createElement, defaultArguments, options );

    // @private flag to denote whether we're in the process of resetting the BunnyGroup
    this.isResetting = false;

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

    // @public notify when a bunny is created, a nicer API than addMemberCreatedListener
    this.bunnyCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notify when a bunny is disposed, a nicer API than addMemberDisposedListener
    this.bunnyDisposedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notify when a bunny dies
    this.bunnyDiedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notifies when all bunnies have died
    this.allBunniesHaveDiedEmitter = new Emitter();

    // @public notifies when bunnies have taken over the world, exceeding the maximum population size
    this.bunniesHaveTakenOverTheWorldEmitter = new Emitter();

    // When a bunny is created...
    this.elementCreatedEmitter.addListener( bunny => {
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
      this.totalNumberOfBunniesProperty.value = this.length;
      this.bunnyCreatedEmitter.emit( bunny );
    } );

    // When a bunny is disposed...
    this.elementDisposedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );
      this.liveBunnies.contains( bunny ) && this.liveBunnies.remove( bunny );
      this.deadBunnies.contains( bunny ) && this.deadBunnies.remove( bunny );
      this.totalNumberOfBunniesProperty.value = this.length;
      this.bunnyDisposedEmitter.emit( bunny );
    } );

    // @private
    this.modelViewTransform = modelViewTransform;
    this.genePool = genePool;
  }

  /**
   * Resets the group.
   */
  reset() {
    this.isResetting = true;
    this.clear();
    assert && this.assertCountsInSync();
    this.isResetting = false;
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
  ageAllBunnies() {
    let numberDied = 0;
    this.liveBunnies.forEach( bunny => {
      bunny.ageProperty.value++;
      if ( bunny.ageProperty.value === NaturalSelectionConstants.MAX_BUNNY_AGE ) {
        bunny.die();
        numberDied++;
      }
      assert && assert( bunny.ageProperty.value <= NaturalSelectionConstants.MAX_BUNNY_AGE,
        `bunny age exceeded max: ${bunny.ageProperty.value}` );
    } );
    assert && this.assertCountsInSync();

    phet.log && phet.log( `${numberDied} bunnies died` );

    if ( !this.isResetting && this.liveBunnies.lengthProperty.value === 0 ) {
      this.allBunniesHaveDiedEmitter.emit();
    }
  }

  /**
   * Randomly pairs up bunnies and mates them. If there is an odd number of bunnies, then one of them will not mate.
   * @param {number} generation
   * @public
   */
  mateAllBunnies( generation ) {
    assert && assert( typeof generation === 'number', 'invalid generation' );

    let numberBorn = 0;
    const bunnies = phet.joist.random.shuffle( this.liveBunnies.getArray() );
    for ( let i = 1; i < bunnies.length; i = i + 2 ) {
      this.mateBunnies( bunnies[ i - 1 ], bunnies[ i ], generation, LITTER_SIZE );
      numberBorn += LITTER_SIZE;
    }
    assert && this.assertCountsInSync();

    phet.log && phet.log( `${numberBorn} bunnies born` );

    // Notify if bunnies have taken over the world
    if ( this.liveBunnies.lengthProperty.value > NaturalSelectionConstants.MAX_BUNNIES ) {
      this.bunniesHaveTakenOverTheWorldEmitter.emit();
    }
  }

  /**
   * Mates 2 bunnies.
   * @param {Bunny} father
   * @param {Bunny} mother
   * @param {number} generation
   * @param {number} litterSize
   */
  mateBunnies( father, mother, generation, litterSize ) {
    assert && assert( typeof litterSize === 'number' && Utils.isInteger( litterSize ), 'invalid litterSize' );

    for ( let i = 0; i < litterSize; i++ ) {
      this.createBunny( father, mother, generation );
    }
  }

  /**
   * Creates a Bunny.
   * @param {Bunny} father
   * @param {Bunny} mother
   * @param {number} generation
   * @returns {Bunny}
   * @public
   */
  createBunny( father, mother, generation ) {
    assert && assert( father instanceof Bunny || father === null, 'invalid father' );
    assert && assert( mother instanceof Bunny || mother === null, 'invalid mother' );
    assert && assert( typeof generation === 'number', 'invalid generation' );

    return this.createNextElement( {
      father: father,
      mother: mother,
      generation: generation,
      position: this.modelViewTransform.getRandomGroundPosition(),
      direction: SpriteDirection.getRandom()
    } );
  }

  /**
   * Asserts that collection counts are in-sync.
   * @private
   */
  assertCountsInSync() {
    const live = this.liveBunnies.length;
    const dead = this.deadBunnies.length;
    const total = this.totalNumberOfBunniesProperty.value;
    assert( live + dead === total, `bunny counts are out of sync, live=${live}, dead=${dead}, total=${total}` );
  }
}

naturalSelection.register( 'BunnyGroup', BunnyGroup );
export default BunnyGroup;