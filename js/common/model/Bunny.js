// Copyright 2019-2020, University of Colorado Boulder

/**
 * Bunny is the model of a bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnvironmentModelViewTransform = require( 'NATURAL_SELECTION/common/model/EnvironmentModelViewTransform' );
  const Emitter = require( 'AXON/Emitter' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Sprite = require( 'NATURAL_SELECTION/common/model/Sprite' );
  const Utils = require( 'DOT/Utils' );
  const Vector3 = require( 'DOT/Vector3' );

  // constants
  const MAX_HUNGER = 600; //TODO describe
  const MAX_HUNGER_DELTA = 3; //TODO describe

  // number of steps that the Bunny will rest before hopping
  const MIN_REST_STEPS = 40;
  const MAX_REST_STEPS = 160;

  // number of steps that is takes to complete a hop
  const MIN_HOP_STEPS = 10;
  const MAX_HOP_STEPS = 20;

  // x and z distance that a bunny hops
  const MIN_HOP_DISTANCE = 15;
  const MAX_HOP_DISTANCE = 20;

  // how high above the ground a bunny hops
  const MIN_HOP_HEIGHT = 30;
  const MAX_HOP_HEIGHT = 50;

  // Number of bunnies instantiated.
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
        mother: null // {Bunny|null} null if no mother
      }, options );

      assert && assert( Utils.isInteger( options.generation ), `invalid generation: ${options.generation}` );
      assert && assert( !options.tandem, 'Bunny instances should not be instrumented' );

      super( modelViewTransform, options );

      // @public (read-only)
      this.isAliveProperty = new BooleanProperty( true );
      this.isAliveProperty.lazyLink( isAlive => {
        assert && assert( !this.isDisposed, 'bunny is disposed' );
        assert && assert( !isAlive, 'bunny cannot be resurrected' );
      } );

      // @public (read-only)
      this.id = bunnyCount++;
      this.generation = options.generation;
      this.father = options.father;
      this.mother = options.mother;

      // @private
      this.hunger = phet.joist.random.nextInt( MAX_HUNGER );

      // @private {number} number of times that step has been called in the current rest + hop cycle
      this.stepsCount = 0;

      // @private {number} the number of steps that the bunny rests before hopping, randomized in initializeMotion
      this.restSteps = MAX_REST_STEPS;

      // @private {number} the number of steps required to complete one full hop, randomized in initializeMotion
      this.hopSteps = MAX_HOP_STEPS;

      // @private {Vector3|null} the change in position when the bunny hops
      this.hopDelta = null;

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

      // moving expends some energy and makes the bunny more hungry
      //TODO why do we need MAX_HUNGER limit?
      //TODO should this happen only when the bunny hops? hopping uses more energy than resting
      //TODO should hungrier bunnies rest longer? hop shorter distances?
      //TODO why a random (possibly zero) delta?
      this.hunger = Math.min( this.hunger + phet.joist.random.nextInt( MAX_HUNGER_DELTA ), MAX_HUNGER );

      this.stepsCount++;

      if ( this.hopDelta === null || this.stepsCount > this.restSteps + this.hopSteps ) {

        // When we've completed a cycle, initialize the next cycle
        this.initializeMotion();
      }
      else if ( this.stepsCount > this.restSteps ) {

        // do part of a hop cycle
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
      this.restSteps = phet.joist.random.nextIntBetween( MIN_REST_STEPS, MAX_REST_STEPS );
      this.hopSteps = phet.joist.random.nextIntBetween( MIN_HOP_STEPS, MAX_HOP_STEPS );
      const hopDistance = phet.joist.random.nextIntBetween( MIN_HOP_DISTANCE, MAX_HOP_DISTANCE );
      const hopHeight = phet.joist.random.nextIntBetween( MIN_HOP_HEIGHT, MAX_HOP_HEIGHT );

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
     * Do part of a hop cycle.
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

    //TODO dx could be zero, and that is undesirable
    const dx = Math.abs( swap ? b : a ) * ( isMovingRight ? 1 : -1 ); // match direction of movement
    const dy = hopHeight;
    const dz = ( swap ? a : b );
    return new Vector3( dx, dy, dz );
  }

  return naturalSelection.register( 'Bunny', Bunny );
} );