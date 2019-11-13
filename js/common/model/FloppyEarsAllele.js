// Copyright 2019, University of Colorado Boulder

/**
 * FloppyEarsAllele is the variation of the ears gene that results in floppy (lop) ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EarsGene = require( 'NATURAL_SELECTION/common/model/EarsGene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const floppyEarsString = require( 'string!NATURAL_SELECTION/floppyEars' );

  class FloppyEarsAllele extends EarsGene {

    constructor() {
      super( floppyEarsString );
    }
  }

  return naturalSelection.register( 'FloppyEarsAllele', FloppyEarsAllele );
} );