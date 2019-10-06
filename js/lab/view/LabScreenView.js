// Copyright 2019, University of Colorado Boulder

/**
 * LabView is the view for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const LabViewProperties = require( 'NATURAL_SELECTION/lab/view/LabViewProperties' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionScreenView = require( 'NATURAL_SELECTION/common/view/NaturalSelectionScreenView' );

  class LabScreenView extends NaturalSelectionScreenView {

    /**
     * @param {LabModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      const viewProperties = new LabViewProperties();

      super( model, viewProperties, tandem );

      //TODO

      // @private
      this.viewProperties = viewProperties;
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.viewProperties.reset();
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