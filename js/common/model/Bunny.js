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
  const Emitter = require( 'AXON/Emitter' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Property = require( 'AXON/Property' );
  const Utils = require( 'DOT/Utils' );
  const Vector3 = require( 'DOT/Vector3' );

  // Number of bunnies instantiated.
  let bunnyCount = 0;

  class Bunny {

    /**
     * @param {Vector3} position
     * @param {Object} [options]
     */
    constructor( position, options ) {

      options = merge( {
        generation: 0,
        father: null, // {Bunny|null} null if no father
        mother: null // {Bunny|null} null if no mother
      }, options );

      assert && assert( Utils.isInteger( options.generation ), `invalid generation: ${options.generation}` );

      // @public
      this.positionProperty = new Property( position, {
        valueType: Vector3
      } );
      this.positionProperty.lazyLink( position => {
        assert && assert( !this.isDisposed, 'bunny is disposed' );
      } );

      // @public
      this.isAliveProperty = new BooleanProperty( true );
      this.isAliveProperty.lazyLink( isAlive => {
        assert && assert( !this.isDisposed, 'bunny is disposed' );
        assert && assert( !isAlive, 'bunny cannot be resurrected' );
      } );

      // @public (read-only)
      this.id = bunnyCount++;
      this.movingRight = phet.joist.random.nextBoolean();
      this.generation = options.generation;
      this.father = options.father;
      this.mother = options.mother;
      this.isDisposed = false;
      this.disposedEmitter = new Emitter( {
        parameters: [ { valueType: Bunny } ]
      } );
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      assert && assert( !this.isDisposed, 'bunny is disposed' );
      if ( this.isAliveProperty.value ) {
        //TODO
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
     * @public
     */
    static resetStatic() {
      bunnyCount = 0;
    }
  }

  return naturalSelection.register( 'Bunny', Bunny );
} );