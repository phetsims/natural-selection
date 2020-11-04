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
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';
import Genotype from './Genotype.js';
import Organism from './Organism.js';
import Phenotype from './Phenotype.js';
import XDirection from './XDirection.js';

// constants
const HOP_TIME_RANGE = new Range( 0.25, 0.5 ); // time to complete a hop cycle, in seconds
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
      phetioType: Bunny.BunnyIO,
      phetioDynamicElement: true
    }, options );

    // Validate options
    assert && assert( ( options.father && options.mother ) || ( !options.father && !options.mother ),
      'bunny must have both parents or no parents' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( options.generation ), 'invalid generation' );

    super( modelViewTransform, options );

    // @public (read-only)
    this.father = options.father; // {Bunny|null} null if the bunny had no father, or the father was disposed
    this.mother = options.mother; // {Bunny|null} null if the bunny had no mother, or the mother was disposed
    this.generation = options.generation; // {number}
    this.isAlive = true; // dead bunnies are kept for the Pedigree graph

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

    // @private dynamic range for time spent resting between hops, in seconds. This is set by BunnyCollection based
    // on the total number of bunnies, so that bunnies rest longer when the population is larger. More details at
    // BunnyCollection.bunnyRestRangeProperty.
    this.bunnyRestRangeProperty = bunnyRestRangeProperty;

    // @private {number} time to rest before hopping, randomized in initializeMotion
    this.restTime = this.bunnyRestRangeProperty.value.min;

    // @private {number} the cumulative time spent resting since the last hop, in seconds
    // Initialized with a random value so that bunnies born at the same time don't all hop at the same time.
    this.cumulativeRestTime = phet.joist.random.nextDoubleInRange( this.bunnyRestRangeProperty.value );

    // @private {number} time to complete one full hop, randomized in initializeMotion
    this.hopTime = HOP_TIME_RANGE.max;

    // @private {number} the cumulative time spent hopping since the last reset, in seconds
    this.cumulativeHopTime = 0;

    // @private {Vector3|null} the change in position when the bunny hops, randomized in initializeMotion
    this.hopDelta = null;

    // Initialize the first motion cycle.
    this.initializeMotion();

    // @public fires when the Bunny has died. dispose is required.
    this.diedEmitter = new Emitter();

    // @public fires when the Bunny has been disposed. dispose is required.
    this.disposedEmitter = new Emitter();

    // When the father or mother is disposed, set them to null to free memory.
    // See https://github.com/phetsims/natural-selection/issues/112
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

    // @private {function}
    this.disposeBunny = () => {
      this.genotype.dispose();
      this.phenotype.dispose();

      // diedEmitter is disposed after it fires, so don't do dispose again if the bunny is already dead.
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
  dispose() {
    assert && assert( !this.isDisposed, 'bunny is already disposed' );
    this.disposeBunny();
    super.dispose();
    this.disposedEmitter.emit();
    this.disposedEmitter.dispose();
  }

  /**
   * Kills this bunny, forever and ever. (This sim does not support reincarnation or other forms of 'pooling' :)
   * @public
   */
  die() {
    assert && assert( this.isAlive, 'bunny is already dead' );
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
   * Initializes the next motion cycle. A bunny will continue to hop until it gets to the edge of the screen.
   * Then it reverses direction.
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
   * Performs part of a hop cycle.
   * @param {number} dt - time step, in seconds
   * @private
   */
  hop( dt ) {

    // x and y parts of the hop. Don't do more than the remaining portion of the hop cycle.
    const xzFraction = Math.min( dt, this.hopTime - this.cumulativeHopTime ) / this.hopTime;
    const x = this.positionProperty.value.x + ( xzFraction * this.hopDelta.x );
    const z = this.positionProperty.value.z + ( xzFraction * this.hopDelta.z );

    // Hop height (y) follows a quadratic arc. Again, don't do more than the remaining portion of the hop cycle.
    const yFraction = Math.min( 1, this.cumulativeHopTime / this.hopTime );
    const yAboveGround = this.hopDelta.y * 2 * ( -( yFraction * yFraction ) + yFraction );
    const y = this.modelViewTransform.getGroundY( z ) + yAboveGround;

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
           `genotype='${this.genotype.toAbbreviation()}', ` +
           `father=${this.father ? this.father.tandem.name : null}, ` +
           `mother=${this.mother ? this.mother.tandem.name : null}, ` +
           `isOriginalMutant=${this.isOriginalMutant()}`;
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

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by BunnyIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this Bunny instance.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {

      // Even though father and mother are stateful, we need a reference to them.
      father: NullableIO( ReferenceIO( Bunny.BunnyIO ) ).toStateObject( this.father ),
      mother: NullableIO( ReferenceIO( Bunny.BunnyIO ) ).toStateObject( this.mother ),

      generation: NumberIO.toStateObject( this.generation ),
      isAlive: BooleanIO.toStateObject( this.isAlive ),
      age: NumberIO.toStateObject( this.age ),

      // genotype and phenotype are stateful and will be serialized automatically.

      // private fields, will not be shown in Studio
      private: {
        restTime: NumberIO.toStateObject( this.restTime ),
        hopTime: NumberIO.toStateObject( this.hopTime ),
        cumulativeRestTime: NumberIO.toStateObject( this.cumulativeRestTime ),
        cumulativeHopTime: NumberIO.toStateObject( this.cumulativeHopTime ),
        hopDelta: NullableIO( Vector3.Vector3IO ).toStateObject( this.hopDelta )
      }
    };
  }

  /**
   * Creates the args that BunnyGroup uses to instantiate a Bunny.
   * @param {Object} state
   * @returns {Object[]}
   * @public
   */
  static stateToArgsForConstructor( state ) {

    // stateToArgsForConstructor is called only for dynamic elements that are part of a group.
    // So we are not restoring anything through options, because that would not support static elements.
    // Everything will be restored via applyState.
    return [ {} ];  // explicit options arg to Bunny constructor
  }

  /**
   * Restores Bunny state after instantiation.
   * @param {Object} stateObject - return value of fromStateObject
   * @public
   */
  applyState( stateObject ) {
    required( stateObject );

    // public fields
    this.father = required( NullableIO( ReferenceIO( Bunny.BunnyIO ) ).fromStateObject( stateObject.father ) );
    this.mother = required( NullableIO( ReferenceIO( Bunny.BunnyIO ) ).fromStateObject( stateObject.mother ) );
    this.generation = required( NumberIO.fromStateObject( stateObject.generation ) );
    this.isAlive = required( BooleanIO.fromStateObject( stateObject.isAlive ) );
    this.age = required( NumberIO.fromStateObject( stateObject.age ) );

    // private fields
    this.restTime = required( NumberIO.fromStateObject( stateObject.private.restTime ) );
    this.hopTime = required( NumberIO.fromStateObject( stateObject.private.hopTime ) );
    this.cumulativeRestTime = required( NumberIO.fromStateObject( stateObject.private.cumulativeRestTime ) );
    this.cumulativeHopTime = required( NumberIO.fromStateObject( stateObject.private.cumulativeHopTime ) );
    this.hopDelta = required( NullableIO( Vector3.Vector3IO ).fromStateObject( stateObject.private.hopDelta ) );

    this.validateInstance();
  }
}

/**
 * Gets the (dx, dy, dz) for a hop cycle.
 * @param {number} hopDistance - maximum x and z distance that the bunny will hop
 * @param {number} hopHeight - height above the ground that the bunny will hop
 * @param {XDirection} xDirection - direction that the bunny is facing along the x axis
 * @returns {Vector3}
 */
function getHopDelta( hopDistance, hopHeight, xDirection ) {

  assert && assert( typeof hopDistance === 'number', 'invalid hopDistance' );
  assert && assert( NaturalSelectionUtils.isNonNegative( hopHeight ), `invalid hopHeight: ${hopHeight}` );
  assert && assert( XDirection.includes( xDirection ), 'invalid xDirection' );

  const angle = phet.joist.random.nextDoubleBetween( 0, 2 * Math.PI );

  // Do some basic trig to compute motion in x and z planes
  const hypotenuse = hopDistance;
  const adjacent = hypotenuse * Math.cos( angle ); // cos(theta) = adjacent/hypotenuse
  const opposite = hypotenuse * Math.sin( angle ); // sin(theta) = opposite/hypotenuse

  // We'll use the larger motion for dx, the smaller for dz.
  const oppositeIsLarger = ( Math.abs( opposite ) > Math.abs( adjacent ) );

  const dx = Math.abs( oppositeIsLarger ? opposite : adjacent ) * XDirection.toSign( xDirection );
  const dy = hopHeight;
  const dz = ( oppositeIsLarger ? adjacent : opposite );
  return new Vector3( dx, dy, dz );
}

/**
 * @public
 * BunnyIO handles PhET-iO serialization of Bunny. Because serialization involves accessing private members,
 * it delegates to Bunny. The methods that BunnyIO overrides are typical of 'Dynamic element serialization',
 * as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 */
Bunny.BunnyIO = new IOType( 'BunnyIO', {
  valueType: Bunny,
  toStateObject: bunny => bunny.toStateObject(),
  stateToArgsForConstructor: Bunny.stateToArgsForConstructor,
  applyState: ( bunny, stateObject ) => bunny.applyState( stateObject )
} );

naturalSelection.register( 'Bunny', Bunny );
export default Bunny;