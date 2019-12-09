// Copyright 2019, University of Colorado Boulder

/**
 * LabViewProperties contains view-specific Properties for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionViewProperties = require( 'NATURAL_SELECTION/common/view/NaturalSelectionViewProperties' );

  class LabViewProperties extends NaturalSelectionViewProperties {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super( tandem );
      //TODO
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      //TODO
    }
  }

  return naturalSelection.register( 'LabViewProperties', LabViewProperties );
} );