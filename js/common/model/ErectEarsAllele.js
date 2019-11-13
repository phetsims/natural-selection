// Copyright 2019, University of Colorado Boulder

/**
 * ErectEarsAllele is the variation of the ears gene that results in erect ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EarsGene = require( 'NATURAL_SELECTION/common/model/EarsGene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const erectEarsString = require( 'string!NATURAL_SELECTION/erectEars' );

  class ErectEarsAllele extends EarsGene {

    constructor() {
      super( erectEarsString );
    }
  }

  return naturalSelection.register( 'ErectEarsAllele', ErectEarsAllele );
} );