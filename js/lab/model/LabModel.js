// Copyright 2019, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionModel = require( 'NATURAL_SELECTION/common/model/NaturalSelectionModel' );
  const ToughFood = require( 'NATURAL_SELECTION/common/model/ToughFood' );
  const Wolves = require( 'NATURAL_SELECTION/common/model/Wolves' );

  /**
   * @constructor
   */
  class LabModel extends NaturalSelectionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const selectionAgents = [ new Wolves(), new ToughFood() ];

      super( selectionAgents );
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

  return naturalSelection.register( 'LabModel', LabModel );
} );