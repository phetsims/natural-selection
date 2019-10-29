// Copyright 2019, University of Colorado Boulder

/**
 * TallEarsAllele is the variation of the ears gene that results in tall (erect) ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EarsGene = require( 'NATURAL_SELECTION/common/model/EarsGene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const tallEarsString = require( 'string!NATURAL_SELECTION/tallEars' );

  class TallEarsAllele extends EarsGene {

    constructor() {
      super( tallEarsString );
    }
  }

  return naturalSelection.register( 'TallEarsAllele', TallEarsAllele );
} );