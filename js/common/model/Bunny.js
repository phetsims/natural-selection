// Copyright 2019, University of Colorado Boulder

/**
 * Bunny is the model of a bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BunnyGenotype = require( 'NATURAL_SELECTION/common/model/BunnyGenotype' );
  const Emitter = require( 'AXON/Emitter' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class Bunny {

    /**
     * @param {BunnyGenotype} genotype
     */
    constructor( genotype ) {
      assert && assert( genotype instanceof BunnyGenotype, 'invalid genotype' );

      // @public (read-only)
      this.genotype = genotype;

      // @public (read-only)
      this.deathEmitter = new Emitter();
      this.isAlive = true;
      this.isDisposed = false;
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      assert && assert( !this.isDisposed, 'attempted to step a disposed bunny' );
      if ( this.isAlive ) {
        //TODO
      }
    }

    /**
     * Kills this bunny, forever and ever. (This sim does not support reincarnation or other forms of 'pooling' :)
     * @public
     */
    kill() {
      assert && assert( this.isAlive, 'bunny is already dead' );
      assert && assert( !this.isDisposed, 'attempted to kill a disposed bunny' );
      this.isAlive = false;
      this.deathEmitter.emit();
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( !this.isDisposed, 'bunny is already disposed' );
      //TODO
      this.isDisposed = true;
    }

    /**
     * Creates a bunny with the default genotype.
     * This is used for bunnies that have no ancestors, the lone bunny and its mate.
     * @returns {Bunny}
     * @public
     */
    static createDefault() {
      return new Bunny( BunnyGenotype.createDefault() );
    }
  }

  return naturalSelection.register( 'Bunny', Bunny );
} );