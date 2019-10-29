// Copyright 2019, University of Colorado Boulder

/**
 * WhiteFurAllele is the variation of the fur gene that results in white fur.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FurGene = require( 'NATURAL_SELECTION/common/model/FurGene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class WhiteFurAllele extends FurGene {

    constructor() {
      super( whiteFurString );
    }
  }

  return naturalSelection.register( 'WhiteFurAllele', WhiteFurAllele );
} );