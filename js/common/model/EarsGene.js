// Copyright 2019, University of Colorado Boulder

/**
 * EarsGene is the base class for genes related to ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Gene = require( 'NATURAL_SELECTION/common/model/Gene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const earsString = require( 'string!NATURAL_SELECTION/ears' );

  class EarsGene extends Gene {

    /**
     * @param {string} alleleName
     */
    constructor( alleleName ) {
      super( earsString, alleleName );
    }
  }

  return naturalSelection.register( 'EarsGene', EarsGene );
} );