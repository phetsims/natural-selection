// Copyright 2019, University of Colorado Boulder

/**
 * FlatEarsAllele is the variation of the ears gene that results in flat (full lop) ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EarsGene = require( 'NATURAL_SELECTION/common/model/EarsGene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const flatEarsString = require( 'string!NATURAL_SELECTION/flatEars' );

  class FlatEarsAllele extends EarsGene {

    constructor() {
      super( flatEarsString );
    }
  }

  return naturalSelection.register( 'FlatEarsAllele', FlatEarsAllele );
} );