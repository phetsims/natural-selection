// Copyright 2019, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  const NaturalSelectionQueryParameters = QueryStringMachine.getAll( {

    // Step for zoom buttons on Population graph.
    // For internal use only.
    zoomStep: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 1
    }
  } );

  naturalSelection.register( 'NaturalSelectionQueryParameters', NaturalSelectionQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( NaturalSelectionQueryParameters, null, 2 ) );

  return NaturalSelectionQueryParameters;
} );