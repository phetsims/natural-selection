// Copyright 2019, University of Colorado Boulder

/**
 * Gene is the base class for all genes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class Gene {

    /**
     * @param {string} geneName
     * @param {string} alleleName
     */
    constructor( geneName, alleleName ) {

      // @public (read-only)
      this.geneName = geneName;
      this.alleleName = alleleName;

      // @public whether the gene is dominant (true) or recessive (false)
      // Until a mutation is applied, all genes are recessive by default.
      this.isDominantProperty = new BooleanProperty( false );
    }
  }

  return naturalSelection.register( 'Gene', Gene );
} );