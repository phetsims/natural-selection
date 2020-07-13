// Copyright 2019-2020, University of Colorado Boulder

/**
 * Bunny is the model of a bunny. Every bunny has a Genotype (genetic blueprint) and Phenotype (appearance).
 * All bunnies except generation-zero have 2 parents, referred to as 'father' and 'mother', although bunnies
 * are sexless. Generation-zero bunnies have no parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Range from '../../../../dot/js/Range.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import Vector3IO from '../../../../dot/js/Vector3IO.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyIO from './BunnyIO.js';
import CauseOfDeath from './CauseOfDeath.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';
import Genotype from './Genotype.js';
import GenotypeIO from './GenotypeIO.js';
import NaturalSelectionSprite from './NaturalSelectionSprite.js';
import Phenotype from './Phenotype.js';
import PhenotypeIO from './PhenotypeIO.js';
import SpriteDirection from './SpriteDirection.js';

// constants
const REST_TIME_RANGE = NaturalSelectionQueryParameters.bunnyRestTime; // time to complete a rest interval, in seconds
const HOP_TIME_RANGE = NaturalSelectionQueryParameters.bunnyHopTime; // time to complete a hop cycle, in seconds
const HOP_DISTANCE_RANGE = new Range( 15, 20 ); // x and z distance that a bunny hops
const HOP_HEIGHT_RANGE = new Range( 30, 50 );   // how high above the ground a bunny hops

class Bunny extends NaturalSelectionSprite {

  /**
   * @param {GenePool} genePool
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( genePool, modelViewTransform, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      father: null, // {Bunny|null} the Bunny's father, null if no father
      mother: null, // {Bunny|null} the Bunny's mother, null if no mother
      generation: 0, // {number} generation that this Bunny belongs to

      // {Object|null} options to Genotype constructor
      genotypeOptions: null,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: BunnyIO,
      phetioDynamicElement: true
    }, options );

    const hasParents = ( options.father && options.mother );

    // Validate options
    assert && assert( hasParents || ( !options.father && !options.mother ), 'bunny cannot have 1 parent' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( options.generation ), 'invalid generation' );

    // Default to random position and direction
    options.position = options.position || modelViewTransform.getRandomGroundPosition();
    options.direction = options.direction || SpriteDirection.getRandom();

    super( modelViewTransform, options );

    // @public (read-only)
    this.father = options.father;
    this.mother = options.mother;
    this.generation = options.generation;
    this.isAlive = true;
    this.causeOfDeath = null; // {CauseOfDeath|null}

    // @public
    this.age = 0;

    const genotypeOptions = merge( {}, options.genotypeOptions, {
      tandem: options.tandem.createTandem( 'genotype' )
    } );

    // @public (read-only) the bunny's genetic blueprint
    this.genotype = new Genotype( genePool, genotypeOptions );

    // @public (read-only) the bunny's appearance, the manifestation of its genotype
    this.phenotype = new Phenotype( this.genotype, {
      tandem: options.tandem.createTandem( 'phenotype' )
    } );

    // @private {number} the cumulative time spent resting since the last hop, in seconds
    this.cumulativeRestTime = 0;

    // @private {number} the cumulative time spent hopping since the last reset, in seconds
    this.cumulativeHopTime = 0;

    // @private {number} time to rest before hopping, randomized in initializeMotion
    this.restTime = REST_TIME_RANGE.max;

    // @private {number} time to complete one full hop, randomized in initializeMotion
    this.hopTime = HOP_TIME_RANGE.max;

    // @private {Vector3|null} the change in position when the bunny hops
    this.hopDelta = null;

    // Initialize the first motion cycle.
    this.initializeMotion();

    // @public fires when the Bunny has died. dispose is required.
    this.diedEmitter = new Emitter();

    // @public fires when the Bunny has been disposed. dispose is required.
    this.disposedEmitter = new Emitter();

    //TODO https://github.com/phetsims/natural-selection/issues/112 should father/mother be set to something other than null?
    // When the father or mother is disposed, set them to null to free memory.
    const fatherDisposedListener = () => {
      this.father.disposedEmitter.removeListener( fatherDisposedListener );
      this.father = null;
    };
    this.father && this.father.disposedEmitter.addListener( fatherDisposedListener );
    const motherDisposedListener = () => {
      this.mother.disposedEmitter.removeListener( motherDisposedListener );
      this.mother = null;
    };
    this.mother && this.mother.disposedEmitter.addListener( motherDisposedListener );

    // @private
    this.disposeBunny = () => {
      this.genotype.dispose();
      this.phenotype.dispose();
      this.diedEmitter.dispose();
      if ( this.father && this.father.disposedEmitter.hasListener( fatherDisposedListener ) ) {
        this.father.disposedEmitter.removeListener( fatherDisposedListener );
      }
      if ( this.mother && this.mother.disposedEmitter.hasListener( motherDisposedListener ) ) {
        this.mother.disposedEmitter.removeListener( motherDisposedListener );
      }
    };

    this.validateInstance();
  }

  /**
   * @public
   * @override
   */
  reset() {
    assert && assert( false, 'Bunny does not support reset' );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( !this.isDisposed, 'bunny is already disposed' );
    this.disposeBunny();
    super.dispose();
    this.disposedEmitter.emit();
    this.disposedEmitter.dispose();
  }

  /**
   * Kills this bunny, forever and ever. (This sim does not support reincarnation or other forms of 'pooling' :)
   * @param {CauseOfDeath} causeOfDeath
   * @public
   */
  die( causeOfDeath ) {
    assert && assert( CauseOfDeath.includes( causeOfDeath ), 'invalid causeOfDeath' );
    assert && assert( this.isAlive, 'bunny is already dead' );
    this.causeOfDeath = causeOfDeath;
    this.isAlive = false;
    this.diedEmitter.emit();
  }

  /**
   * Moves the Bunny around. This is the motion cycle for a bunny. Each bunny rests, hops, rests, hops, ...
   * @param {number} dt - time step, in seconds
   * @public
   */
  move( dt ) {
    assert && assert( this.isAlive, 'dead bunny cannot move' );

    if ( this.cumulativeRestTime < this.restTime ) {

      // The bunny is resting.
      this.cumulativeRestTime += dt;
    }
    else if ( this.cumulativeHopTime < this.hopTime ) {

      // Do part of the hop cycle.
      this.hop( dt );
    }
    else {

      // When we've completed a motion cycle, initialize the next cycle.
      this.initializeMotion();
    }
  }

  /**
   * Initializes the next motion cycle.
   * @private
   */
  initializeMotion() {

    this.cumulativeRestTime = 0;
    this.cumulativeHopTime = 0;

    // Randomize motion for the next cycle
    this.restTime = phet.joist.random.nextInRange( REST_TIME_RANGE );
    this.hopTime = phet.joist.random.nextInRange( HOP_TIME_RANGE );
    const hopDistance = phet.joist.random.nextInRange( HOP_DISTANCE_RANGE );
    const hopHeight = phet.joist.random.nextInRange( HOP_HEIGHT_RANGE );

    // Get motion delta for the next cycle
    this.hopDelta = getHopDelta( hopDistance, hopHeight, this.directionProperty.value );

    // Reverse delta x if the hop would exceed x boundaries
    const hopEndX = this.positionProperty.value.x + this.hopDelta.x;
    if ( hopEndX <= this.getMinimumX() || hopEndX >= this.getMaximumX() ) {
      this.hopDelta.setX( -this.hopDelta.x );
    }

    // Reverse delta z if the hop would exceed z boundaries
    const hopEndZ = this.positionProperty.value.z + this.hopDelta.z;
    if ( hopEndZ <= this.getMinimumZ() || hopEndZ >= this.getMaximumZ() ) {
      this.hopDelta.setZ( -this.hopDelta.z );
    }

    // Adjust the x direction to match the hop delta x
    this.directionProperty.value = ( this.hopDelta.x >= 0 ) ? SpriteDirection.RIGHT : SpriteDirection.LEFT;
  }

  /**
   * Do part of the hop cycle.
   * @param {number} dt - time step, in seconds
   * @private
   */
  hop( dt ) {

    const scale = Math.min( dt, this.hopTime - this.cumulativeHopTime ) / this.hopTime;

    const x = this.positionProperty.value.x + ( scale * this.hopDelta.x );
    const z = this.positionProperty.value.z + ( scale * this.hopDelta.z );

    const hopHeightFraction = this.cumulativeHopTime / this.hopTime;
    //TODO I don't understand the last part of this, from Bunny.java moveAround
    const y = this.modelViewTransform.getGroundY( z ) + this.hopDelta.y * 2 * ( -hopHeightFraction * hopHeightFraction + hopHeightFraction );

    this.positionProperty.value = new Vector3( x, y, z );

    this.cumulativeHopTime += dt;
  }

  /**
   * Interrupts a bunny's hop, and moves it immediately to the ground. This is used to prevent bunnies from being
   * stuck up in the air mid-hop when the simulation ends.
   * @public
   */
  interruptHop() {

    // move bunny to the ground
    const position = this.positionProperty.value;
    const y = this.modelViewTransform.getGroundY( position.z );
    this.positionProperty.value = new Vector3( position.x, y, position.z );

    // initialization the next motion cycle
    this.initializeMotion();
  }

  /**
   * Is this bunny an 'original mutant'? An original mutant is a bunny in which the mutation first occurred.
   * These bunnies are labeled with a mutation icon in the Pedigree graph.
   * @returns {boolean}
   * @public
   */
  isOriginalMutant() {
    return !!this.genotype.mutation;
  }

  /**
   * Converts Bunny to a string. This is intended for debugging only. Do not rely on the format of this string!
   * @returns {string}
   * @public
   */
  toString() {
    return `${this.tandem.name}, ` +
           `generation=${this.generation}, ` +
           `age=${this.age}, ` +
           `isAlive=${this.isAlive}, ` +
           `${this.causeOfDeath ? 'causeOfDeath=' + this.causeOfDeath : ''}, ` +
           `genotype='${this.genotype.toAbbreviation()}', ` +
           `father=${this.father ? this.father.tandem.name : null}, ` +
           `mother=${this.mother ? this.mother.tandem.name : null}`;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by BunnyIO to save and restore PhET-iO state.
  // NOTE! If you add a field to Bunny that is not itself an instrumented PhET-iO element (e.g. a Property),
  // then you will likely need to add that field to toStateObject, fromStateObject, applyState, and validateInstance.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Returns the serialized information needed by BunnyIO.toStateObject.
   * @returns {Object}
   * @public for use by BunnyIO only
   */
  toStateObject() {
    return {

      // public fields
      generation: NumberIO.toStateObject( this.generation ),
      age: NumberIO.toStateObject( this.age ),
      isAlive: BooleanIO.toStateObject( this.isAlive ),
      father: NullableIO( ReferenceIO( BunnyIO ) ).toStateObject( this.father ),
      mother: NullableIO( ReferenceIO( BunnyIO ) ).toStateObject( this.mother ),
      genotype: GenotypeIO.toStateObject( this.genotype ),
      phenotype: PhenotypeIO.toStateObject( this.phenotype ),

      // private fields, will not be shown in Studio
      private: {
        cumulativeRestTime: NumberIO.toStateObject( this.cumulativeRestTime ),
        cumulativeHopTime: NumberIO.toStateObject( this.cumulativeHopTime ),
        restTime: NumberIO.toStateObject( this.restTime ),
        hopTime: NumberIO.toStateObject( this.hopTime ),
        hopDelta: NullableIO( Vector3IO ).toStateObject( this.hopDelta )
      }
    };
  }

  /**
   * Deserializes the state needed by BunnyIO.stateToArgsForConstructor and BunnyIO.applyState.
   * @param {Object} stateObject - return value from toStateObject
   * @returns {Object}
   * @public for use by BunnyIO only
   */
  static fromStateObject( stateObject ) {
    return {

      // public fields
      generation: NumberIO.fromStateObject( stateObject.generation ),
      age: NumberIO.fromStateObject( stateObject.age ),
      isAlive: BooleanIO.fromStateObject( stateObject.isAlive ),
      father: NullableIO( ReferenceIO( BunnyIO ) ).fromStateObject( stateObject.father ),
      mother: NullableIO( ReferenceIO( BunnyIO ) ).fromStateObject( stateObject.mother ),
      genotype: GenotypeIO.fromStateObject( stateObject.genotype ),
      phenotype: PhenotypeIO.fromStateObject( stateObject.phenotype ),

      // private fields
      cumulativeRestTime: NumberIO.fromStateObject( stateObject.private.cumulativeRestTime ),
      cumulativeHopTime: NumberIO.fromStateObject( stateObject.private.cumulativeHopTime ),
      restTime: NumberIO.fromStateObject( stateObject.private.restTime ),
      hopTime: NumberIO.fromStateObject( stateObject.private.hopTime ),
      hopDelta: NullableIO( Vector3IO ).fromStateObject( stateObject.private.hopDelta )
    };
  }

  /**
   * Creates the args that BunnyGroup uses to create a Bunny instance.
   * @param state
   * @returns {Object[]}
   * @public for use by BunnyIO only
   */
  static stateToArgsForConstructor( state ) {

    // stateToArgsForConstructor is called only for dynamic elements that are part of a group.
    // So we are not restoring anything through options, because that would not support static elements.
    // Everything will be restored via applyState.
    return [ {} ];  // explicit options arg to Bunny constructor
  }

  /**
   * Restores private state for PhET-iO. This is called by BunnyIO.applyState after a Bunny has been instantiated
   * during deserialization.
   * @param {Object} state - return value of fromStateObject
   * @public for use by BunnyIO only
   */
  applyState( state ) {
    required( state );

    // public fields
    this.generation = required( state.generation );
    this.age = required( state.age );
    this.isAlive = required( state.isAlive );
    this.father = required( state.father );
    this.mother = required( state.mother );
    this.genotype.applyState( state.genotype );
    this.phenotype.applyState( state.phenotype );

    // private fields
    this.cumulativeRestTime = required( state.cumulativeRestTime );
    this.cumulativeHopTime = required( state.cumulativeHopTime );
    this.restTime = required( state.restTime );
    this.hopTime = required( state.hopTime );
    this.hopDelta = required( state.hopDelta );

    this.validateInstance();
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.generation ), 'invalid generation' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.age ), 'invalid age' );
    assert && assert( typeof this.isAlive === 'boolean', 'invalid isAlive' );
    assert && assert( this.father instanceof Bunny || this.father === null, 'invalid father' );
    assert && assert( this.mother instanceof Bunny || this.mother === null, 'invalid mother' );
    assert && assert( this.genotype instanceof Genotype, 'invalid genotype' );
    assert && assert( this.phenotype instanceof Phenotype, 'invalid phenotype' );
    assert && assert( typeof this.cumulativeRestTime === 'number', 'invalid cumulativeRestTime' );
    assert && assert( typeof this.cumulativeHopTime === 'number', 'invalid cumulativeHopTime' );
    assert && assert( typeof this.restTime === 'number', 'invalid restTime' );
    assert && assert( typeof this.hopTime === 'number', 'invalid hopTime' );
    assert && assert( this.hopDelta instanceof Vector3 || this.hopDelta === null, 'invalid hopDelta' );
  }
}

/**
 * Gets the Vector3 that describes the change in x, y, and z for a hop cycle.
 * @param {number} hopDistance - maximum x and z distance that the bunny will hop
 * @param {number} hopHeight - height above the ground that the bunny will hop
 * @param {SpriteDirection} direction - direction that the bunny is facing
 * @returns {Vector3}
 */
function getHopDelta( hopDistance, hopHeight, direction ) {

  //TODO I don't understand the use of cos, sin, and swap
  const angle = phet.joist.random.nextDoubleBetween( 0, 2 * Math.PI );
  const a = hopDistance * Math.cos( angle );
  const b = hopDistance * Math.sin( angle );

  const swap = ( Math.abs( a ) < Math.abs( b ) );

  const dx = Math.abs( swap ? b : a ) * SpriteDirection.toSign( direction );
  const dy = hopHeight;
  const dz = ( swap ? a : b );
  return new Vector3( dx, dy, dz );
}

naturalSelection.register( 'Bunny', Bunny );
export default Bunny;