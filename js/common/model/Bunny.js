// Copyright 2019-2020, University of Colorado Boulder

/**
 * Bunny is the model of a bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyIO from './BunnyIO.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Sprite from './Sprite.js';

// constants
const REST_STEPS_RANGE = new Range( 40, 160 );  // number of steps that the Bunny will rest before hopping
const HOP_STEPS_RANGE = new Range( 10, 20 );    // number of steps that is takes to complete a hop
const HOP_DISTANCE_RANGE = new Range( 15, 20 ); // x and z distance that a bunny hops
const HOP_HEIGHT_RANGE = new Range( 30, 50 );   // how high above the ground a bunny hops

// Number of bunnies instantiated, used to assign unique ids to Bunny instances for debugging
let bunnyCount = 0;

class Bunny extends Sprite {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    options = merge( {

      generation: 0,
      father: null, // {Bunny|null} null if no father
      mother: null, // {Bunny|null} null if no mother

      stepsCount: 0,
      restSteps: REST_STEPS_RANGE.max,
      hopSteps: HOP_STEPS_RANGE.max,
      hopDelta: null,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: BunnyIO,
      phetioDynamicElement: true
    }, options );

    assert && assert( Utils.isInteger( options.generation ) && options.generation >= 0, `invalid generation: ${options.generation}` );

    super( modelViewTransform, options );

    // @public (read-only)
    this.isAliveProperty = new BooleanProperty( true );
    this.isAliveProperty.lazyLink( isAlive => {
      assert && assert( !isAlive, 'bunny cannot be resurrected' );
    } );

    // @public (read-only) FOR DEBUGGING ONLY!
    this.id = bunnyCount++;

    // @public (read-only)
    this.generation = options.generation;
    this.father = options.father;
    this.mother = options.mother;

    // @private {number} number of times that step has been called in the current rest + hop cycle
    this.stepsCount = options.stepsCount;

    // @private {number} the number of steps that the bunny rests before hopping, randomized in initializeMotion
    this.restSteps = options.restSteps;

    // @private {number} the number of steps required to complete one full hop, randomized in initializeMotion
    this.hopSteps = options.hopSteps;

    // @private {Vector3|null} the change in position when the bunny hops
    this.hopDelta = options.hopDelta;

    // @public (read-only)
    this.isDisposed = false;

    // @public emit(Bunny) is called when this Bunny is disposed
    this.disposedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );
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
   */
  dispose() {
    assert && assert( !this.isDisposed, 'bunny is disposed' );
    this.isDisposed = true;
    this.disposedEmitter.emit( this );
    this.disposedEmitter.dispose();
    //TODO
  }

  /**
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    assert && assert( !this.isDisposed, 'bunny is disposed' );
    if ( this.isAliveProperty.value ) {
      this.moveAround();
    }
  }

  /**
   * Kills this bunny, forever and ever. (This sim does not support reincarnation or other forms of 'pooling' :)
   * @public
   */
  kill() {
    assert && assert( this.isAliveProperty.value, 'bunny is dead' );
    assert && assert( !this.isDisposed, 'bunny is disposed' );
    this.isAliveProperty.value = false;
  }

  //TODO delete this later in development?
  /**
   * String representation of this bunny. For debugging only. DO NOT RELY ON THE FORMAT OF THIS STRING!
   * @returns {string}
   * @public
   */
  toString() {
    return 'Bunny[' +
           `id:${this.id}, ` +
           `generation:${this.generation}, ` +
           'father:' + ( ( this.father && this.father.id ) || null ) + ', ' +
           'mother:' + ( ( this.mother && this.mother.id ) || null ) + ', ' +
           `position: ${this.positionProperty.value}` +
           ']';
  }

  /**
   * This is the motion cycle for a bunny. Each bunny rests, then hops, ad nauseam.
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
    this.hopDelta = getHopDelta( hopDistance, hopHeight, this.isMovingRight() );

    // Reverse delta x if the hop would exceed x boundaries
    //TODO bunnies only reverse direction when they hit the left/right edges, should they change direction randomly?
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
    this.xDirectionProperty.value = ( this.hopDelta.x >= 0 ) ? 1 : -1;
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

  /**
   * @public
   */
  static resetStatic() {
    bunnyCount = 0;
  }

  /**
   * Creates a PhetioGroup for Bunny instances, which are dynamically created.
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Tandem} tandem
   * @returns {PhetioGroup}
   */
  static createGroup( modelViewTransform, tandem ) {
    return new PhetioGroup(

      /**
       * createMember argument, called to instantiate a Bunny.
       * @param {Tandem} tandem - PhetioGroup requires this to be the first param
       * @param {Object} [options]
       * @returns {Bunny}
       */
      ( tandem, options ) => {
        return new Bunny( modelViewTransform, merge( {}, options, {
          tandem: tandem
        } ) );
      },

      // defaultArguments, passed to createMember during API harvest
      [ {} ],

      // options
      {
        tandem: tandem,
        phetioType: PhetioGroupIO( BunnyIO ),
        phetioDocumentation: 'TODO'
      }
    );
  }
}

/**
 * Gets the Vector3 that describes the change in x, y, and z for a hop cycle.
 * @param {number} hopDistance - maximum x and z distance that the bunny will hop
 * @param {number} hopHeight - height above the ground that the bunny will hop
 * @param {boolean} isMovingRight - true if the bunny is moving to the right
 * @returns {Vector3}
 */
function getHopDelta( hopDistance, hopHeight, isMovingRight ) {

  //TODO I don't understand the use of cos, sin, and swap
  const angle = phet.joist.random.nextDoubleBetween( 0, 2 * Math.PI );
  const a = hopDistance * Math.cos( angle );
  const b = hopDistance * Math.sin( angle );

  const swap = ( Math.abs( a ) < Math.abs( b ) );

  const dx = Math.abs( swap ? b : a ) * ( isMovingRight ? 1 : -1 ); // match direction of movement
  const dy = hopHeight;
  const dz = ( swap ? a : b );
  return new Vector3( dx, dy, dz );
}

naturalSelection.register( 'Bunny', Bunny );
export default Bunny;