// Copyright 2019, University of Colorado Boulder

/**
 * TeethGenePair is a pair of genes for the teeth trait, inherited from parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const TeethGene = require( 'NATURAL_SELECTION/common/model/TeethGene' );
  const GenePair = require( 'NATURAL_SELECTION/common/model/GenePair' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class TeethGenePair extends GenePair {

    /**
     * @param {TeethGene} fatherGene
     * @param {TeethGene} motherGene
     */
    constructor( fatherGene, motherGene ) {
      assert && assert( fatherGene instanceof TeethGene, 'invalid fatherGene' );
      assert && assert( motherGene instanceof TeethGene, 'invalid motherGene' );

      super( fatherGene, motherGene );
    }
  }

  return naturalSelection.register( 'TeethGenePair', TeethGenePair );
} );