// Copyright 2019, University of Colorado Boulder

/**
 * LabView is the view for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionScreenView = require( 'NATURAL_SELECTION/common/view/NaturalSelectionScreenView' );

  class LabScreenView extends NaturalSelectionScreenView {

    /**
     * @param {LabModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( model, tandem );

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

    /**
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {
      super.step( dt );
      //TODO
    }
  }

  return naturalSelection.register( 'LabScreenView', LabScreenView );
} );