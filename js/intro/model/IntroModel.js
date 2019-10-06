// Copyright 2019, University of Colorado Boulder

/**
 * IntroModel is the model for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionModel = require( 'NATURAL_SELECTION/common/model/NaturalSelectionModel' );

  /**
   * @constructor
   */
  class IntroModel extends NaturalSelectionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super();
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

  return naturalSelection.register( 'IntroModel', IntroModel );
} );