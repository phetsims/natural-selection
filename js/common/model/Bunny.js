// Copyright 2019-2020, University of Colorado Boulder

/**
 * Bunny is the model of a bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import Vector3IO from '../../../../dot/js/Vector3IO.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyIO from './BunnyIO.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';
import Genotype from './Genotype.js';
import GenotypeIO from './GenotypeIO.js';
import Phenotype from './Phenotype.js';
import Sprite from './Sprite.js';
import SpriteDirection from './SpriteDirection.js';

// constants
const REST_STEPS_RANGE = new Range( 40, 160 );  // number of steps that the Bunny will rest before hopping
const HOP_STEPS_RANGE = new Range( 10, 20 );    // number of steps that is takes to complete a hop
const HOP_DISTANCE_RANGE = new Range( 15, 20 ); // x and z distance that a bunny hops
const HOP_HEIGHT_RANGE = new Range( 30, 50 );   // how high above the ground a bunny hops

class Bunny extends Sprite {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( modelViewTransform, genePool, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {

      father: null, // {Bunny|null} the Bunny's father, null if no father
      mother: null, // {Bunny|null} the Bunny's mother, null if no mother
      generation: 0, // {number} generation that this Bunny belongs to

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: BunnyIO,
      phetioDynamicElement: true
    }, options );

    assert && assert( Utils.isInteger( options.generation ) && options.generation >= 0, `invalid generation: ${options.generation}` );
    assert && assert( ( options.father && options.mother ) || ( !options.father && !options.mother ), 'bunny cannot have 1 parent' );

    super( modelViewTransform, options );

    // @public (read-only)
    this.generation = options.generation;
    this.father = options.father;
    this.mother = options.mother;

    // @public (read-only) the bunny's genetic blueprint
    this.genotype = new Genotype( this.father, this.mother, genePool, {
      tandem: options.tandem.createTandem( 'genotype' )
    } );

    // @public (read-only) the bunny's appearance, the manifestation of its genotype
    this.phenotype = new Phenotype( this.genotype, {
      tandem: options.tandem.createTandem( 'phenotype' )
    } );

    // @public
    this.ageProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'ageProperty' ),
      phetioDocumentation: 'age of the bunny, in generations',
      phetioReadOnly: true
    } );

    // @public (read-only)
    this.isAliveProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isAliveProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether the bunny is alive'
    } );
    this.isAliveProperty.lazyLink( isAlive => { assert && assert( !isAlive, 'bunny cannot be resurrected' ); } );

    // @private {number} number of times that step has been called in the current rest + hop cycle
    this.stepsCount = 0;

    // @private {number} the number of steps that the bunny rests before hopping, randomized in initializeMotion
    this.restSteps = REST_STEPS_RANGE.max;

    // @private {number} the number of steps required to complete one full hop, randomized in initializeMotion
    this.hopSteps = HOP_STEPS_RANGE.max;

    // @private {Vector3|null} the change in position when the bunny hops
    this.hopDelta = null;

    // @private fires when the Bunny has been disposed
    this.disposedEmitter = new Emitter();

    // @private
    this.disposeBunny = () => {
      this.genotype.dispose();
      this.phenotype.dispose();
      this.ageProperty.dispose();
      this.isAliveProperty.dispose();
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
    super.dispose();
    this.disposeBunny();
    this.disposedEmitter.emit();
    this.disposedEmitter.dispose();
  }

  /**
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    if ( this.isAliveProperty.value ) {
      this.moveAround();
    }
  }

  /**
   * Kills this bunny, forever and ever. (This sim does not support reincarnation or other forms of 'pooling' :)
   * @public
   */
  die() {
    assert && assert( this.isAliveProperty.value, 'bunny is already dead' );
    this.isAliveProperty.value = false;
  }

  /**
   * Moves the Bunny around. This is the motion cycle for a bunny. Each bunny rests, hops, rests, hops, ...
   * @private
   */
  moveAround() {
    //TODO this is based on number of steps, should it use dt?

    this.stepsCount++;

    if ( this.hopDelta === null || this.stepsCount > this.restSteps + this.hopSteps ) {

      // When we've completed a motion cycle, initialize the next cycle
      this.initializeMotion();
    }
    else if ( this.stepsCount > this.restSteps ) {

      // do part of the hop cycle
      this.hop();
    }
    else {
      // do nothing, the bunny is resting
    }
  }

  /**
   * Initializes the next motion cycle.
   * @private
   */
  initializeMotion() {

    this.stepsCount = 0;

    // Randomize motion for the next cycle
    this.restSteps = phet.joist.random.nextIntBetween( REST_STEPS_RANGE.min, REST_STEPS_RANGE.max );
    this.hopSteps = phet.joist.random.nextIntBetween( HOP_STEPS_RANGE.min, HOP_STEPS_RANGE.max );
    const hopDistance = phet.joist.random.nextIntBetween( HOP_DISTANCE_RANGE.min, HOP_DISTANCE_RANGE.max );
    const hopHeight = phet.joist.random.nextIntBetween( HOP_HEIGHT_RANGE.min, HOP_HEIGHT_RANGE.max );

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
   * @private
   */
  hop() {
    const x = this.positionProperty.value.x + ( this.hopDelta.x / this.hopSteps );
    const z = this.positionProperty.value.z + ( this.hopDelta.z / this.hopSteps );
    const hopHeightFraction = ( this.stepsCount - this.restSteps ) / this.hopSteps;
    //TODO I don't understand the last part of this
    const y = this.modelViewTransform.getGroundY( z ) + this.hopDelta.y * 2 * ( -hopHeightFraction * hopHeightFraction + hopHeightFraction );
    this.positionProperty.value = new Vector3( x, y, z );
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

    // to force reinitialization of hop sequence on next step
    this.hopDelta = null;
  }

  /**
   * Gets the minimum x coordinate for a bunny's position.
   * @returns {number}
   * @private
   */
  getMinimumX() {
    return this.modelViewTransform.getMinimumX( this.positionProperty.value.z ) +
           EnvironmentModelViewTransform.X_MARGIN_MODEL;
  }

  /**
   * Gets the maximum x coordinate for a bunny's position.
   * @returns {number}
   * @private
   */
  getMaximumX() {
    return this.modelViewTransform.getMaximumX( this.positionProperty.value.z ) -
           EnvironmentModelViewTransform.X_MARGIN_MODEL;
  }

  /**
   * Gets the minimum z coordinate for a bunny's position.
   * @returns {number}
   * @private
   */
  getMinimumZ() {
    return this.modelViewTransform.getMinimumZ() + EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }

  /**
   * Gets the maximum z coordinate for a bunny's position.
   * @returns {number}
   * @private
   */
  getMaximumZ() {
    return this.modelViewTransform.getMaximumZ() - EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Methods used by BunnyIO to save and restore state
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Returns the serialized information needed by BunnyIO.toStateObject. Providing this method prevents
   * BunnyIO from reaching into Bunny and accessing private fields. Note that instrumented Properties do not
   * need to be handled here, they are automatically restored by PhET-iO.
   * @returns {Object}
   * @public for use by BunnyIO only
   */
  toStateObject() {
    return {
      generation: NumberIO.toStateObject( this.generation ),
      father: NullableIO( ReferenceIO( BunnyIO ) ).toStateObject( this.father ),
      mother: NullableIO( ReferenceIO( BunnyIO ) ).toStateObject( this.mother ),
      genotype: GenotypeIO.toStateObject( this.genotype ),
      stepsCount: NumberIO.toStateObject( this.stepsCount ),
      restSteps: NumberIO.toStateObject( this.restSteps ),
      hopSteps: NumberIO.toStateObject( this.hopSteps ),
      hopDelta: NullableIO( Vector3IO ).toStateObject( this.hopDelta )
    };
  }

  /**
   * Deserializes the state needed by BunnyIO.stateToArgsForConstructor and BunnyIO.setValue.
   * @param {Object} stateObject - return value from toStateObject
   * @returns {Object}
   * @public for use by BunnyIO only
   */
  static fromStateObject( stateObject ) {
    return {
      generation: NumberIO.fromStateObject( stateObject.generation ),
      father: NullableIO( ReferenceIO( BunnyIO ) ).fromStateObject( stateObject.father ),
      mother: NullableIO( ReferenceIO( BunnyIO ) ).fromStateObject( stateObject.mother ),
      genotype: GenotypeIO.fromStateObject( stateObject.genotype ),
      stepsCount: NumberIO.fromStateObject( stateObject.stepsCount ),
      restSteps: NumberIO.fromStateObject( stateObject.restSteps ),
      hopSteps: NumberIO.fromStateObject( stateObject.hopSteps ),
      hopDelta: NullableIO( Vector3IO ).fromStateObject( stateObject.hopDelta )
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
    // Everything will be restored via setValue.
    return [ {} ];  // explicit options arg to Bunny constructor
  }

  /**
   * Restores private state for PhET-iO. This is called by BunnyIO.setValue after a Bunny has been instantiated
   * during deserialization. Providing this method prevents BunnyIO from reaching into Bunny and accessing
   * private fields.
   * @param {Object} state - return value of fromStateObject
   * @public for use by BunnyIO only
   */
  setValue( state ) {
    required( state );
    this.generation = required( state.generation );
    this.father = required( state.father );
    this.mother = required( state.mother );
    this.genotype.setValue( state.genotype );
    this.stepsCount = required( state.stepsCount );
    this.restSteps = required( state.restSteps );
    this.hopSteps = required( state.hopSteps );
    this.hopDelta = required( state.hopDelta );
    this.validateInstance();
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( typeof this.generation === 'number', 'invalid generation' );
    assert && assert( this.father instanceof Bunny || this.father === null, 'invalid father' );
    assert && assert( this.mother instanceof Bunny || this.mother === null, 'invalid mother' );
    assert && assert( this.genotype instanceof Genotype, 'invalid genotype' );
    assert && assert( typeof this.stepsCount === 'number', 'invalid stepsCount' );
    assert && assert( typeof this.restSteps === 'number', 'invalid restSteps' );
    assert && assert( typeof this.hopSteps === 'number', 'invalid hopSteps' );
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