// Copyright 2019, University of Colorado Boulder

/**
 * TeethGene is the base class for genes related to teeth.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Gene = require( 'NATURAL_SELECTION/common/model/Gene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );

  class TeethGene extends Gene {

    /**
     * @param {string} alleleName
     */
    constructor( alleleName ) {
      super( teethString, alleleName );
    }
  }

  return naturalSelection.register( 'TeethGene', TeethGene );
} );