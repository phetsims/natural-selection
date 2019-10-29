// Copyright 2019, University of Colorado Boulder

/**
 * LongTeethAllele is the variation of the teeth gene that results in long teeth.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const TeethGene = require( 'NATURAL_SELECTION/common/model/TeethGene' );

  // strings
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );

  class LongTeethAllele extends TeethGene {

    constructor() {
      super( longTeethString );
    }
  }

  return naturalSelection.register( 'LongTeethAllele', LongTeethAllele );
} );