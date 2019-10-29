// Copyright 2019, University of Colorado Boulder

/**
 * BrownFurAllele is the variation of the fur gene that results in brown fur.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FurGene = require( 'NATURAL_SELECTION/common/model/FurGene' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );

  class BrownFurAllele extends FurGene {

    constructor() {
      super( brownFurString );
    }
  }

  return naturalSelection.register( 'BrownFurAllele', BrownFurAllele );
} );