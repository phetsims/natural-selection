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
  const Tandem = require( 'TANDEM/Tandem' );

  /**
   * @constructor
   */
  class IntroModel  {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );
      //TODO
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      //TODO
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'IntroModel does not support dispose' );
    }

    /**
     * Steps the model.
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }
  }

  return naturalSelection.register( 'IntroModel', IntroModel );
} );