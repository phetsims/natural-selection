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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class Bunny {

    /**
     * @param {BunnyGenotype} genotype
     */
    constructor( genotype ) {
      assert && assert( genotype instanceof BunnyGenotype, 'invalid genotype' );

      // @public (read-only)
      this.genotype = genotype;
    }

    /**
     * Creates a bunny with the default genotype.
     * This is used for bunnies that have no ancestors, the long bunny and its mate.
     * @returns {Bunny}
     * @public
     */
    static createDefault() {
      return new Bunny( BunnyGenotype.createDefault() );
    }
  }

  return naturalSelection.register( 'Bunny', Bunny );
} );