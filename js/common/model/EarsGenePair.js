// Copyright 2019, University of Colorado Boulder

/**
 * EarsGenePair is a pair of genes for the ears trait, inherited from parents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EarsGene = require( 'NATURAL_SELECTION/common/model/EarsGene' );
  const GenePair = require( 'NATURAL_SELECTION/common/model/GenePair' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class EarsGenePair extends GenePair {

    /**
     * @param {EarsGene} fatherGene
     * @param {EarsGene} motherGene
     */
    constructor( fatherGene, motherGene ) {
      assert && assert( fatherGene instanceof EarsGene, 'invalid fatherGene' );
      assert && assert( motherGene instanceof EarsGene, 'invalid motherGene' );

      super( fatherGene, motherGene );
    }
  }

  return naturalSelection.register( 'EarsGenePair', EarsGenePair );
} );