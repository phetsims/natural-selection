// Copyright 2019, University of Colorado Boulder

/**
 * FurGene is the base class for genes related to fur (hair) color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Gene = require( 'NATURAL_SELECTION/common/model/Gene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const furString = require( 'string!NATURAL_SELECTION/fur' );

  class FurGene extends Gene {

    /**
     * @param {string} alleleName
     */
    constructor( alleleName ) {
      super( furString, alleleName );
    }
  }

  return naturalSelection.register( 'FurGene', FurGene );
} );