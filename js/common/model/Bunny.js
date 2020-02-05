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

  // min and max number of steps that the Bunny will rest before hopping
  const MIN_REST_STEPS = 120;
  const MAX_REST_STEPS = 1200;

  // number of steps that is takes to complete a hop
  const HOP_STEPS = 10;

  // max x or z distance that a bunny hops
  const MAX_HOP_XZ = 20;

  // how high above the ground a bunny hops
  //TODO should this be randomized?
  const HOP_HEIGHT = 50;

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

      // @private {Vector3} the change in position when the bunny hops
      this.hopDelta = this.getHopDelta();

      // @private {number} the number of steps that the bunny rests before hopping
      this.restSteps = phet.joist.random.nextInt( MIN_REST_STEPS, MAX_REST_STEPS );

      // @private {number} TODO
      this.sinceHopTime = phet.joist.random.nextInt( this.restSteps );

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
        this.hop();
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
     * This is the hop cycle for a bunny. Each bunny rests, then hops, ad nauseam.
     * @private
     */
    hop() {
      //TODO this is based on number of steps, should it use dt?

      // moving expends some energy and makes the bunny more hungry
      //TODO why do we need MAX_HUNGER limit?
      this.hunger = Math.min( this.hunger + phet.joist.random.nextInt( MAX_HUNGER_DELTA ), MAX_HUNGER );

      this.sinceHopTime++;

      // When we've completed a hop...
      if ( this.sinceHopTime > this.restSteps + HOP_STEPS ) {

        assert && assert( this.modelViewTransform.isGroundPosition( this.positionProperty.value ),
          `expected bunny to be on the ground, position: ${this.positionProperty.value}` );

        this.sinceHopTime = 0;
        this.restSteps = phet.joist.random.nextInt( MIN_REST_STEPS, MAX_REST_STEPS );

        // Get the delta for the next hop cycle.
        this.hopDelta = this.getHopDelta();

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
        this.xDirectionProperty.value = ( this.hopDelta.x >= 0 ) ? 1 : -1;
      }

      // do part of a hop cycle
      if ( this.sinceHopTime > this.restSteps ) {
        const x = this.positionProperty.value.x + ( this.hopDelta.x / HOP_STEPS );
        const z = this.positionProperty.value.z + ( this.hopDelta.z / HOP_STEPS );
        const hopHeightFraction = ( this.sinceHopTime - this.restSteps ) / HOP_STEPS;
        //TODO I don't understand the last part of this
        const y = this.modelViewTransform.getGroundY( z ) + this.hopDelta.y * 2 * ( -hopHeightFraction * hopHeightFraction + hopHeightFraction );
        this.positionProperty.value = new Vector3( x, y, z );
      }
    }

    /**
     * Gets the Vector3 that describes the change in x, y, z for a hop cycle.
     * @returns {Vector3}
     * @private
     */
    getHopDelta() {

      //TODO I don't understand the use of cos, sin, and swap
      const angle = phet.joist.random.nextDoubleBetween( 0, 2 * Math.PI );
      const a = MAX_HOP_XZ * Math.cos( angle );
      const b = MAX_HOP_XZ * Math.sin( angle );

      const swap = ( Math.abs( a ) < Math.abs( b ) );

      const dx = Math.abs( swap ? b : a ) * ( this.isMovingRight() ? 1 : -1 ); // match direction of movement
      const dy = HOP_HEIGHT;
      const dz = ( swap ? a : b );
      return new Vector3( dx, dy, dz );
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

  return naturalSelection.register( 'Bunny', Bunny );
} );