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
  const BETWEEN_HOP_TIME = 50;
  const HOP_TIME = 10;
  const MAX_HOP_XZ = 20; // max x or z distance that a bunny hops
  const HOP_HEIGHT = 50; // how high above the ground a bunny hops

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

      // private
      this.hunger = phet.joist.random.nextInt( MAX_HUNGER );
      this.sinceHopTime = phet.joist.random.nextInt( BETWEEN_HOP_TIME );
      this.hopDelta = this.getHopDelta(); // {Vector3}

      // @public (read-only)
      this.isDisposed = false;
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
             'father:' + ( (this.father && this.father.id) || null ) + ', ' +
             'mother:' + ( (this.mother && this.mother.id) || null ) + ', ' +
             `position: ${this.positionProperty.value}` +
             ']';
    }

    /**
     * This is the hop cycle for a bunny. Each bunny rests, then hops, ad nauseam.
     * @param {number} dt - time step, in seconds
     * @private
     */
    hop( dt ) {
      //TODO use dt

      // moving expends some energy and makes the bunny more hungry
      //TODO why do we need MAX_HUNGER limit?
      this.hunger = Math.min( this.hunger + phet.joist.random.nextInt( MAX_HUNGER_DELTA ), MAX_HUNGER );

      this.sinceHopTime++;

      // When we've completed a hop...
      if ( this.sinceHopTime > BETWEEN_HOP_TIME + HOP_TIME ) {

        this.sinceHopTime = 0;

        // Get the delta for the next hop cycle.
        this.hopDelta = this.getHopDelta();

        // Adjust delta z if the hop would exceed X boundaries
        const hopEndX = this.positionProperty.value.x + this.hopDelta.x;
        if ( hopEndX <= this.getMinimumX() || hopEndX >= this.getMaximumX() ) {
          this.hopDelta.setX( -this.hopDelta.x );
        }

        // Adjust delta z if the hop would exceed z boundaries
        const hopEndZ = this.positionProperty.value.z + this.hopDelta.z;
        if ( hopEndZ <= this.getMinimumZ() || hopEndZ >= this.getMaximumZ() ) {
          this.hopDelta.setZ( -this.hopDelta.z );
        }

        // Adjust the x direction to match the hop delta x
        this.xDirectionProperty.value = ( this.hopDelta.x >= 0 ) ? 1 : -1;
      }

      // do part of a hop cycle
      if ( this.sinceHopTime > BETWEEN_HOP_TIME ) {
        const x = this.positionProperty.value.x + this.hopDelta.x / HOP_TIME;
        const z = this.positionProperty.value.z + this.hopDelta.z / HOP_TIME;
        const hopHeightFraction = ( this.sinceHopTime - BETWEEN_HOP_TIME ) / HOP_TIME;
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