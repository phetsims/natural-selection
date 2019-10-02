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

  /**
   * @constructor
   */
  class IntroModel  {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      //TODO
    }

    /**
     * @public
     */
    reset() {
      //TODO Reset things here.
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  return naturalSelection.register( 'IntroModel', IntroModel );
} );