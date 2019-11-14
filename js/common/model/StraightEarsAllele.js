// Copyright 2019, University of Colorado Boulder

/**
 * StraightEarsAllele is the variation of the ears gene that results in straight ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EarsGene = require( 'NATURAL_SELECTION/common/model/EarsGene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const straightEarsString = require( 'string!NATURAL_SELECTION/straightEars' );

  class StraightEarsAllele extends EarsGene {

    constructor() {
      super( straightEarsString );
    }
  }

  return naturalSelection.register( 'StraightEarsAllele', StraightEarsAllele );
} );