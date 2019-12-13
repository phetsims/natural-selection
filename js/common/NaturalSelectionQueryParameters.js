// Copyright 2019, University of Colorado Boulder

/**
 * Query parameters that are specific to this simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  const NaturalSelectionQueryParameters = QueryStringMachine.getAll( {

    // Seconds of real time per cycle of the generation clock.
    // For internal use only.
    secondsPerGeneration: {
      type: 'number',
      defaultValue: 10,
      isValidValue: value => ( value > 0 )
    },

    // Seconds of real time per each press of the Step button.
    // For internal use only.
    secondsPerStep: {
      type: 'number',
      defaultValue: 0.1,
      isValidValue: value => ( value > 0 )
    },

    // Determines whether allele abbreviations are visible in the UI. Setting this to false hides the Pedigree 'Alleles'
    // panel, makes the Pedigree graph wider, and allele abbreviations will not be shown in the Pedigree graph.
    // Public facing.
    allelesVisible: {
      type: 'boolean',
      defaultValue: true
    }
  } );

  naturalSelection.register( 'NaturalSelectionQueryParameters', NaturalSelectionQueryParameters );

  // validate any dependencies between query parameters
  assert( NaturalSelectionQueryParameters.secondsPerStep < NaturalSelectionQueryParameters.secondsPerGeneration,
    'secondsPerStep must be < secondsPerGeneration' );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( NaturalSelectionQueryParameters, null, 2 ) );

  return NaturalSelectionQueryParameters;
} );