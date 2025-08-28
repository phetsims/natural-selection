// Copyright 2019-2025, University of Colorado Boulder

/**
 * Bunny is the model of a bunny. Every bunny has a Genotype (genetic blueprint) and Phenotype (appearance).
 * All bunnies except generation-zero have 2 parents, referred to as 'father' and 'mother', although bunnies
 * are sexless. Generation-zero bunnies have no parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector3, { Vector3StateObject } from '../../../../dot/js/Vector3.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType, { AnyIOType } from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import { CompositeSchema } from '../../../../tandem/js/types/StateSchema.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';
import Genotype, { GenotypeOptions } from './Genotype.js';
import Organism, { OrganismOptions } from './Organism.js';
import Phenotype from './Phenotype.js';
import XDirection from './XDirection.js';

const HOP_TIME_RANGE = new Range( 0.25, 0.5 ); // time to complete a hop cycle, in seconds
const HOP_DISTANCE_RANGE = new Range( 15, 20 ); // straight-line distance that a bunny hops in the xz plane
const HOP_HEIGHT_RANGE = new Range( 30, 50 ); // how high above the ground a bunny hops
const X_MARGIN = 28; // determined empirically, to keep bunnies inside bounds of the environment

type SelfOptions = {
  father?: Bunny | null; // the Bunny's father, null if no father, or the father has died
  mother?: Bunny | null; // the Bunny's mother, null if no mother, or the mother has died
  generation?: number; // generation that this Bunny belongs to
  genotypeOptions?: StrictOmit<GenotypeOptions, 'tandem'>; // options for creating the Bunny's genetic blueprint
};

export type BunnyOptions = SelfOptions & PickRequired<OrganismOptions, 'tandem'>;

type BunnyStateObject = {
  father: BunnyStateObject | null;
  mother: BunnyStateObject | null;
  isAlive: boolean;
  generation: number;
  age: number;
  _restTime: number;
  _hopTime: number;
  _cumulativeRestTime: number;
  _cumulativeHopTime: number;
  _hopDelta: Vector3StateObject;
  _hopStartPosition: Vector3StateObject;
};

export default class Bunny extends Organism {

  private _father: Bunny | null;
  private _mother: Bunny | null;
  private _isAlive: boolean;
  private _generation: number; // not readonly so that BunnyIO.applyState can restore it
  public age: number; // intended to be modified only by BunnyCollection and BunnyIO.applyState

  // the bunny's genetic blueprint
  public readonly genotype: Genotype;

  // the bunny's appearance, the manifestation of its genotype
  public readonly phenotype: Phenotype;

  // Dynamic range for time spent resting between hops, in seconds. This is set by BunnyCollection based
  // on the total number of bunnies, so that bunnies rest longer when the population is larger. More details at
  // BunnyCollection.bunnyRestRangeProperty.
  private readonly bunnyRestRangeProperty: TReadOnlyProperty<Range>;

  // time to rest before hopping, randomized in initializeMotion
  private restTime: number;

  // the cumulative time spent resting since the last hop, in seconds
  // Initialized with a random value so that bunnies born at the same time don't all hop at the same time.
  private cumulativeRestTime: number;

  // time to complete one full hop, randomized in initializeMotion
  private hopTime: number;

  // the cumulative time spent hopping since the last reset, in seconds
  private cumulativeHopTime: number;

  // the change in position when the bunny hops, randomized in initializeMotion
  private hopDelta: Vector3;

  // position at the start of a hop cycle
  private hopStartPosition: Vector3;

  // fires when the Bunny has died. dispose is required.
  public readonly diedEmitter: Emitter;

  // fires when the Bunny has been disposed. dispose is required.
  public readonly disposedEmitter: Emitter;

  private readonly disposeBunny: () => void;

  /**
   * @param genePool
   * @param modelViewTransform
   * @param bunnyRestRangeProperty - range for time spent resting between hops, in seconds
   * @param providedOptions
   */
  public constructor( genePool: GenePool,
                      modelViewTransform: EnvironmentModelViewTransform,
                      bunnyRestRangeProperty: TReadOnlyProperty<Range>,
                      providedOptions: BunnyOptions ) {

    const options = optionize<BunnyOptions, StrictOmit<SelfOptions, 'genotypeOptions'>, OrganismOptions>()( {

      // SelfOptions
      father: null,
      mother: null,
      generation: 0,

      // OrganismOptions
      position: modelViewTransform.getRandomGroundPosition( X_MARGIN ),
      xDirection: XDirection.getRandom(),
      phetioType: Bunny.BunnyIO,
      phetioDynamicElement: true
    }, providedOptions );

    // Validate options
    assert && assert( ( options.father && options.mother ) || ( !options.father && !options.mother ),
      'bunny must have both parents or no parents' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( options.generation ), 'invalid generation' );

    super( modelViewTransform, options );

    this._father = options.father;
    this._mother = options.mother;
    this._isAlive = true;
    this._generation = options.generation;
    this.age = 0;

    this.genotype = new Genotype( genePool, combineOptions<GenotypeOptions>( {
      tandem: options.tandem.createTandem( 'genotype' )
    }, options.genotypeOptions ) );

    this.phenotype = new Phenotype( this.genotype, {
      tandem: options.tandem.createTandem( 'phenotype' )
    } );

    this.bunnyRestRangeProperty = bunnyRestRangeProperty;
    this.restTime = this.bunnyRestRangeProperty.value.min;
    this.cumulativeRestTime = dotRandom.nextDoubleInRange( this.bunnyRestRangeProperty.value );
    this.hopTime = HOP_TIME_RANGE.max;
    this.cumulativeHopTime = 0;
    this.hopDelta = new Vector3( 0, 0, 0 );
    this.hopStartPosition = this.positionProperty.value;

    // Initialize the first motion cycle.
    this.initializeMotion();

    this.diedEmitter = new Emitter();
    this.disposedEmitter = new Emitter();

    // When the father or mother is disposed, set them to null to free memory.
    // See https://github.com/phetsims/natural-selection/issues/112
    const fatherDisposedListener = () => {
      if ( this._father ) {
        this._father.disposedEmitter.removeListener( fatherDisposedListener );
        this._father = null;
      }
    };
    this._father && this._father.disposedEmitter.addListener( fatherDisposedListener );

    const motherDisposedListener = () => {
      if ( this._mother ) {
        this._mother.disposedEmitter.removeListener( motherDisposedListener );
        this._mother = null;
      }
    };
    this._mother && this._mother.disposedEmitter.addListener( motherDisposedListener );

    this.disposeBunny = () => {
      this.genotype.dispose();
      this.phenotype.dispose();

      // diedEmitter is disposed after it fires, so don't do dispose again if the bunny is already dead.
      if ( !this.diedEmitter.isDisposed ) {
        this.diedEmitter.dispose();
      }

      if ( this._father && this._father.disposedEmitter.hasListener( fatherDisposedListener ) ) {
        this._father.disposedEmitter.removeListener( fatherDisposedListener );
      }
      if ( this._mother && this._mother.disposedEmitter.hasListener( motherDisposedListener ) ) {
        this._mother.disposedEmitter.removeListener( motherDisposedListener );
      }
    };
  }

  public override dispose(): void {
    assert && assert( !this.isDisposed, 'bunny is already disposed' );
    this.disposeBunny();
    super.dispose();
    this.disposedEmitter.emit();
    this.disposedEmitter.dispose();
  }

  public get father(): Bunny | null { return this._father; }

  public get mother(): Bunny | null { return this._mother; }

  public get isAlive(): boolean { return this._isAlive; }

  public get generation(): number { return this._generation; }

  /**
   * Kills this bunny, forever and ever. (This sim does not support reincarnation or other forms of 'pooling' :)
   */
  public die(): void {
    assert && assert( this._isAlive, 'bunny is already dead' );
    this._isAlive = false;
    this.diedEmitter.emit();
    this.diedEmitter.dispose();
  }

  /**
   * Moves the Bunny around. This is the motion cycle for a bunny. Each bunny rests, hops, rests, hops, ...
   * @param dt - time step, in seconds
   */
  public move( dt: number ): void {
    assert && assert( this._isAlive, 'dead bunny cannot move' );

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
   */
  private initializeMotion(): void {

    // Verify that the bunny is in z bounds.
    // See https://github.com/phetsims/natural-selection/issues/131
    const currentZ = this.positionProperty.value.z;
    const minZ = this.getMinimumZ();
    const maxZ = this.getMaximumZ();
    assert && assert( currentZ >= minZ || currentZ <= maxZ,
      `bunny is out of z bounds: z=${currentZ}, minZ=${minZ}, maxZ=${maxZ}` );

    // Verify that the bunny is 'reasonably' in x bounds. The modelViewTransform is a trapezoid, where x range depends
    // on z coordinate. So a bunny may be slightly outside of this trapezoid. We decided that's OK, and it doesn't
    // negatively impact the learning goals. The assertion below detects bounds conditions are not 'reasonable'.
    // See https://github.com/phetsims/natural-selection/issues/131
    const currentX = this.positionProperty.value.x;
    const minX = this.getMinimumX() + X_MARGIN;
    const maxX = this.getMaximumX() - X_MARGIN;
    assert && assert( currentX >= minX - HOP_DISTANCE_RANGE.max || currentX <= maxX + HOP_DISTANCE_RANGE.max,
      `bunny is way out of x bounds: x=${currentX}, minX=${minX}, maxX=${maxX}` );

    // Record the position at the start of the hop.
    this.hopStartPosition = this.positionProperty.value;

    // Zero out cumulative times
    this.cumulativeRestTime = 0;
    this.cumulativeHopTime = 0;

    // Randomize motion for the next cycle
    this.restTime = dotRandom.nextDoubleInRange( this.bunnyRestRangeProperty.value );
    this.hopTime = dotRandom.nextDoubleInRange( HOP_TIME_RANGE );
    const hopDistance = dotRandom.nextDoubleInRange( HOP_DISTANCE_RANGE );
    const hopHeight = dotRandom.nextDoubleInRange( HOP_HEIGHT_RANGE );

    // Get motion delta for the next cycle
    this.hopDelta = getHopDelta( hopDistance, hopHeight, this.xDirectionProperty.value );

    // If the hop will exceed z boundaries, reverse delta z.  Do this before checking x, because the range of
    // x depends on the value of z.
    let hopEndZ = this.hopStartPosition.z + this.hopDelta.z;
    if ( hopEndZ < minZ || hopEndZ > maxZ ) {
      this.hopDelta.setZ( -this.hopDelta.z );
      hopEndZ = this.hopStartPosition.z + this.hopDelta.z;
    }

    // After checking z, now we can check x. If the hop will exceed x boundaries, point the bunny in the correct
    // direction. Note that this is not a matter of simply flipping the sign of hopDelta.x, because the range of
    // x is based on z. See https://github.com/phetsims/natural-selection/issues/131
    const hopEndX = this.hopStartPosition.x + this.hopDelta.x;
    const endMinX = this.modelViewTransform.getMinimumX( hopEndZ ) + X_MARGIN;
    const endMaxX = this.modelViewTransform.getMaximumX( hopEndZ ) - X_MARGIN;
    if ( hopEndX < endMinX ) {
      this.hopDelta.setX( Math.abs( this.hopDelta.x ) ); // move to the right
    }
    else if ( hopEndX > endMaxX ) {
      this.hopDelta.setX( -Math.abs( this.hopDelta.x ) ); // move to the left
    }

    // Adjust the x direction to match the hop delta x
    this.xDirectionProperty.value = ( this.hopDelta.x >= 0 ) ? XDirection.RIGHT : XDirection.LEFT;
  }

  /**
   * Performs part of a hop cycle.
   * @param dt - time step, in seconds
   */
  private hop( dt: number ): void {
    assert && assert( this.cumulativeHopTime < this.hopTime, 'hop should not have been called' );

    this.cumulativeHopTime += dt;

    // Portion of the hop cycle to do. Don't do more than 1 hop cycle.
    const hopFraction = Math.min( 1, this.cumulativeHopTime / this.hopTime );

    // x and z components of the hop.
    const x = this.hopStartPosition.x + ( hopFraction * this.hopDelta.x );
    const z = this.hopStartPosition.z + ( hopFraction * this.hopDelta.z );

    // Hop height (y) follows a quadratic arc.
    const yAboveGround = this.hopDelta.y * 2 * ( -( hopFraction * hopFraction ) + hopFraction );
    const y = this.modelViewTransform.getGroundY( z ) + yAboveGround;

    this.positionProperty.value = new Vector3( x, y, z );
  }

  /**
   * Interrupts a bunny's hop, and moves it immediately to the ground. This is used to prevent bunnies from being
   * stuck up in the air mid-hop when the simulation ends.
   */
  public interruptHop(): void {

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
   */
  public isOriginalMutant(): boolean {
    return !!this.genotype.mutation;
  }

  /**
   * Converts Bunny to a string. This is intended for debugging only. Do not rely on the format of this string!
   */
  public override toString(): string {
    return `${this.tandem.name}, ` +
           `generation=${this._generation}, ` +
           `age=${this.age}, ` +
           `isAlive=${this._isAlive}, ` +
           `genotype='${this.genotype.toAbbreviation()}', ` +
           `father=${this._father ? this._father.tandem.name : null}, ` +
           `mother=${this._mother ? this._mother.tandem.name : null}, ` +
           `isOriginalMutant=${this.isOriginalMutant()}`;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by BunnyIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Returns a function that returns a map of state keys and their associated IOTypes, see IOType for details.
   * We need to use a function because the state schema recursive references BunnyIO.
   */
  private static getStateSchema( BunnyIO: AnyIOType ): CompositeSchema<BunnyStateObject> {
    return {

      // Even though father and mother are stateful, we need a reference to them.
      father: NullableIO( ReferenceIO( BunnyIO ) ),
      mother: NullableIO( ReferenceIO( BunnyIO ) ),
      generation: NumberIO,
      isAlive: BooleanIO,
      age: NumberIO,

      // genotype and phenotype are stateful and will be serialized automatically.

      // Fields that begin with '_' will not be shown in Studio.
      _restTime: NumberIO,
      _hopTime: NumberIO,
      _cumulativeRestTime: NumberIO,
      _cumulativeHopTime: NumberIO,
      _hopDelta: Vector3.Vector3IO,
      _hopStartPosition: Vector3.Vector3IO
    };
  }

  /**
   * BunnyIO implements 'Dynamic element serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Dynamic element serialization is appropriate because Bunny instances are created dynamically - either as a
   * "generation-zero" bunny, or via mating. See BunnyCollection.createBunny.
   */
  public static readonly BunnyIO = new IOType<Bunny, BunnyStateObject>( 'BunnyIO', {
    valueType: Bunny,
    stateSchema: Bunny.getStateSchema
    // toStateObject: The default works fine here, and handles serializing this._father to stateObject.father, etc.
    // stateObjectToCreateElementArguments: Not needed because BunnyGroup.createElement has no required arguments,
    //   and we will be restoring everything via applyState.
    // applyState: The default works fine here, and handles deserializing stateObject.father to this._father, etc.
  } );
}

/**
 * Gets the (dx, dy, dz) for a hop cycle.
 * @param hopDistance - maximum straight-line distance that the bunny will hop in the xz plane
 * @param hopHeight - height above the ground that the bunny will hop
 * @param xDirection - direction that the bunny is facing along the x-axis
 */
function getHopDelta( hopDistance: number, hopHeight: number, xDirection: XDirection ): Vector3 {

  assert && assert( hopHeight > 0, `invalid hopHeight: ${hopHeight}` );

  const angle = dotRandom.nextDoubleBetween( 0, 2 * Math.PI );

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

naturalSelection.register( 'Bunny', Bunny );