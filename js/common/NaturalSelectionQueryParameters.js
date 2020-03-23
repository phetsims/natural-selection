// Copyright 2019-2020, University of Colorado Boulder

/**
 * Query parameters that are specific to this simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * Running with ?dev shows the following things that are specific to this sim:
 * - generation number is shown below the generation clock in GenerationClockNode
 * - horizon line is shown in EnvironmentNode
 * - a red dot is rendered at the origin of various objects (bunnies, food, wolves,...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../dot/js/Utils.js';
import naturalSelection from '../naturalSelection.js';

const NaturalSelectionQueryParameters = QueryStringMachine.getAll( {

  //------------------------------------------------------------------------------------------------------------------
  // Public facing
  //------------------------------------------------------------------------------------------------------------------

  // Determines whether allele abbreviations are visible in the UI. Setting this to false hides the Pedigree 'Alleles'
  // panel, makes the Pedigree graph wider, and allele abbreviations will not be shown in the Pedigree graph.
  // Public facing.
  allelesVisible: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  // Specifies the mutations that appear in the initial population of bunnies. The value determines which
  // alleles abbreviations can appear in the population query parameter.
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  //TODO https://github.com/phetsims/natural-selection/issues/9 how to specify mutations per screen?
  mutations: {
    type: 'array',
    elementSchema: {
      type: 'string'
    },
    defaultValue: [],
    isValidValue: mutations => true, //TODO https://github.com/phetsims/natural-selection/issues/9
    public: true
  },

  // Specifies the initial population of bunnies. The value of the mutations query parameter determines which
  // alleles abbreviations can appear in this query parameter's value.
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  //TODO https://github.com/phetsims/natural-selection/issues/9 how to specify population per screen?
  // population: {
  //   type: 'array',
  //   elementSchema: {
  //     type: 'string'
  //   },
  //   defaultValue: [ '1' ],
  //   isValidValue: population => true, //TODO https://github.com/phetsims/natural-selection/issues/9
  //   public: true
  // },

  //TODO https://github.com/phetsims/natural-selection/issues/9 for now, ignore mutations and specify the initial number of bunnies
  population: {
    type: 'number',
    defaultValue: 1,
    isValidValue: population => ( population > 0 && Utils.isInteger( population ) ),
    public: true
  },

  //------------------------------------------------------------------------------------------------------------------
  // For internal use only
  //------------------------------------------------------------------------------------------------------------------

  // Seconds of real time per cycle of the generation clock.
  // For internal use only.
  secondsPerGeneration: {
    type: 'number',
    defaultValue: 10,
    isValidValue: secondsPerGeneration => ( secondsPerGeneration > 0 )
  },

  // Seconds of real time per each press of the Step button.
  // For internal use only.
  secondsPerStep: {
    type: 'number',
    defaultValue: 0.1,
    isValidValue: secondsPerStep => ( secondsPerStep > 0 )
  },

  // The number of bunnies required to 'take over the world'.
  // For internal use only.
  maxBunnies: {
    type: 'number',
    defaultValue: 1000,
    isValidValue: maxBunnies => ( maxBunnies > 0 && Utils.isInteger( maxBunnies ) )
  }
} );

// check dependencies between query parameters

// Check that population is valid for mutations, see https://github.com/phetsims/natural-selection/issues/9
//TODO https://github.com/phetsims/natural-selection/issues/49, validate mutations and population, call QueryStringMachine.addWarning

assert && assert( NaturalSelectionQueryParameters.secondsPerStep < NaturalSelectionQueryParameters.secondsPerGeneration,
  'secondsPerStep must be < secondsPerGeneration' );

// log the values of all sim-specific query parameters
phet.log && phet.log( 'query parameters: ' + JSON.stringify( NaturalSelectionQueryParameters, null, 2 ) );

naturalSelection.register( 'NaturalSelectionQueryParameters', NaturalSelectionQueryParameters );
export default NaturalSelectionQueryParameters;