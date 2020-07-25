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
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
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
import Organism from './Organism.js';
import Phenotype from './Phenotype.js';
import PhenotypeIO from './PhenotypeIO.js';
import XDirection from './XDirection.js';

// constants
const HOP_TIME_RANGE = NaturalSelectionQueryParameters.bunnyHopTime; // time to complete a hop cycle, in seconds
const HOP_DISTANCE_RANGE = new Range( 15, 20 ); // x and z distance that a bunny hops
const HOP_HEIGHT_RANGE = new Range( 30, 50 ); // how high above the ground a bunny hops
const X_MARGIN = 28; // determined empirically, to keep bunnies inside bounds of the environment

class Bunny extends Organism {

  /**
   * @param {GenePool} genePool
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Property.<Range>} bunnyRestRangeProperty - range for time spent resting between hops, in seconds
   * @param {Object} [options]
   */
  constructor( genePool, modelViewTransform, bunnyRestRangeProperty, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && AssertUtils.assertPropertyOf( bunnyRestRangeProperty, Range );

    options = merge( {

      father: null, // {Bunny|null} the Bunny's father, null if no father
      mother: null, // {Bunny|null} the Bunny's mother, null if no mother
      generation: 0, // {number} generation that this Bunny belongs to

      // {Object|null} options to Genotype constructor
      genotypeOptions: null,

      // Default to random position and xDirection
      position: modelViewTransform.getRandomGroundPosition( X_MARGIN ),
      xDirection: XDirection.getRandom(),

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: BunnyIO,
      phetioDynamicElement: true
    }, options );

    // Validate options
    assert && assert( ( options.father && options.mother ) || ( !options.father && !options.mother ),
      'bunny must have both parents or no parents' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( options.generation ), 'invalid generation' );

    super( modelViewTransform, options );

    // @private
    this.bunnyRestRangeProperty = bunnyRestRangeProperty;

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

    // @private {number} time to rest before hopping, randomized in initializeMotion
    this.restTime = this.bunnyRestRangeProperty.value.min;

    // @private {number} time to complete one full hop, randomized in initializeMotion
    this.hopTime = HOP_TIME_RANGE.max;

    // @private {number} the cumulative time spent resting since the last hop, in seconds
    // Choose a random value so that bunnies born at the same time don't all hop at the same time.
    this.cumulativeRestTime = phet.joist.random.nextDoubleInRange( this.bunnyRestRangeProperty.value );

    // @private {number} the cumulative time spent hopping since the last reset, in seconds
    this.cumulativeHopTime = 0;

    // @private {Vector3|null} the change in position when the bunny hops
    this.hopDelta = null;

    // Initialize the first motion cycle.
    this.initializeMotion();

    // @public fires when the Bunny has died. dispose is required.
    this.diedEmitter = new Emitter();

    // @public fires when the Bunny has been disposed. dispose is required.
    this.disposedEmitter = new Emitter();

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

      // diedEmitter is disposed after it fires, so don't do dispose again if the bunny is already died.
      if ( !this.diedEmitter.isDisposed ) {
        this.diedEmitter.dispose();
      }

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
    this.diedEmitter.dispose();
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

    // Zero out cumulative times
    this.cumulativeRestTime = 0;
    this.cumulativeHopTime = 0;

    // Randomize motion for the next cycle
    this.restTime = phet.joist.random.nextDoubleInRange( this.bunnyRestRangeProperty.value );
    this.hopTime = phet.joist.random.nextDoubleInRange( HOP_TIME_RANGE );
    const hopDistance = phet.joist.random.nextDoubleInRange( HOP_DISTANCE_RANGE );
    const hopHeight = phet.joist.random.nextDoubleInRange( HOP_HEIGHT_RANGE );

    // Get motion delta for the next cycle
    this.hopDelta = getHopDelta( hopDistance, hopHeight, this.xDirectionProperty.value );

    // Reverse delta x if the hop would exceed x boundaries
    const hopEndX = this.positionProperty.value.x + this.hopDelta.x;
    if ( hopEndX <= this.getMinimumX() + X_MARGIN || hopEndX >= this.getMaximumX() - X_MARGIN ) {
      this.hopDelta.setX( -this.hopDelta.x );
    }

    // Reverse delta z if the hop would exceed z boundaries
    const hopEndZ = this.positionProperty.value.z + this.hopDelta.z;
    if ( hopEndZ <= this.getMinimumZ() || hopEndZ >= this.getMaximumZ() ) {
      this.hopDelta.setZ( -this.hopDelta.z );
    }

    // Adjust the x direction to match the hop delta x
    this.xDirectionProperty.value = ( this.hopDelta.x >= 0 ) ? XDirection.RIGHT : XDirection.LEFT;
  }

  /**
   * Do part of the hop cycle.
   * @param {number} dt - time step, in seconds
   * @private
   */
  hop( dt ) {

    // Portion of the hop to do
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
        restTime: NumberIO.toStateObject( this.restTime ),
        hopTime: NumberIO.toStateObject( this.hopTime ),
        cumulativeRestTime: NumberIO.toStateObject( this.cumulativeRestTime ),
        cumulativeHopTime: NumberIO.toStateObject( this.cumulativeHopTime ),
        hopDelta: NullableIO( Vector3IO ).toStateObject( this.hopDelta )
      }
    };
  }

  /**
   * Creates the args that BunnyGroup uses to create a Bunny instance.
   * @param {Object} state
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
   * @param {Object} stateObject - return value of fromStateObject
   * @public for use by BunnyIO only
   */
  applyState( stateObject ) {
    required( stateObject );

    // public fields
    this.generation = required( NumberIO.fromStateObject( stateObject.generation ) );
    this.age = required( NumberIO.fromStateObject( stateObject.age ) );
    this.isAlive = required( BooleanIO.fromStateObject( stateObject.isAlive ) );
    this.father = required( NullableIO( ReferenceIO( BunnyIO ) ).fromStateObject( stateObject.father ) );
    this.mother = required( NullableIO( ReferenceIO( BunnyIO ) ).fromStateObject( stateObject.mother ) );
    this.genotype.applyState( stateObject.genotype );
    this.phenotype.applyState( stateObject.phenotype );

    // private fields
    this.restTime = required( NumberIO.fromStateObject( stateObject.private.restTime ) );
    this.hopTime = required( NumberIO.fromStateObject( stateObject.private.hopTime ) );
    this.cumulativeRestTime = required( NumberIO.fromStateObject( stateObject.private.cumulativeRestTime ) );
    this.cumulativeHopTime = required( NumberIO.fromStateObject( stateObject.private.cumulativeHopTime ) );
    this.hopDelta = required( NullableIO( Vector3IO ).fromStateObject( stateObject.private.hopDelta ) );

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
 * @param {XDirection} xDirection - direction that the bunny is facing along the x axis
 * @returns {Vector3}
 */
function getHopDelta( hopDistance, hopHeight, xDirection ) {

  //TODO I don't understand the use of cos, sin, and swap
  const angle = phet.joist.random.nextDoubleBetween( 0, 2 * Math.PI );
  const a = hopDistance * Math.cos( angle );
  const b = hopDistance * Math.sin( angle );

  const swap = ( Math.abs( a ) < Math.abs( b ) );

  const dx = Math.abs( swap ? b : a ) * XDirection.toSign( xDirection );
  const dy = hopHeight;
  const dz = ( swap ? a : b );
  return new Vector3( dx, dy, dz );
}

naturalSelection.register( 'Bunny', Bunny );
export default Bunny;