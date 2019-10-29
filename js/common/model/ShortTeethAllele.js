// Copyright 2019, University of Colorado Boulder

/**
 * ShortTeethAllele is the variation of the teeth gene that results in short teeth.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const TeethAllele = require( 'NATURAL_SELECTION/common/model/TeethAllele' );

  // strings
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );

  class ShortTeethAllele extends TeethAllele {

    constructor() {
      super( shortTeethString );
    }
  }

  return naturalSelection.register( 'ShortTeethAllele', ShortTeethAllele );
} );