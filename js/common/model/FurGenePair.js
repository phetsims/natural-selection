// Copyright 2019, University of Colorado Boulder

/**
 * FurGenePair is a pair of genes for the fur trait, inherited from parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FurGene = require( 'NATURAL_SELECTION/common/model/FurGene' );
  const GenePair = require( 'NATURAL_SELECTION/common/model/GenePair' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class FurGenePair extends GenePair {

    /**
     * @param {FurGene} fatherGene
     * @param {FurGene} motherGene
     */
    constructor( fatherGene, motherGene ) {
      assert && assert( fatherGene instanceof FurGene, 'invalid fatherGene' );
      assert && assert( motherGene instanceof FurGene, 'invalid motherGene' );

      super( fatherGene, motherGene );
    }
  }

  return naturalSelection.register( 'FurGenePair', FurGenePair );
} );