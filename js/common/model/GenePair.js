// Copyright 2019, University of Colorado Boulder

/**
 * GenePair is a pair of genes for the same trait, inherited from parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class GenePair {

    /**
     * @param {Gene} fatherGene
     * @param {Gene} motherGene
     */
    constructor( fatherGene, motherGene ) {

      // @public (read-only)
      this.fatherGene = fatherGene;
      this.motherGene = motherGene;
    }
  }

  return naturalSelection.register( 'GenePair', GenePair );
} );