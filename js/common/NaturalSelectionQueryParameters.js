// Copyright 2019-2020, University of Colorado Boulder

/**
 * Query parameters that are specific to this simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
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

  // Specifies the mutations that appear in the initial population of bunnies for the Intro screen.
  // The value determines which mutant alleles are present, whether they are dominant or recessive,
  // and which allele abbreviations can appear in the population query-parameter value.
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  introMutations: {
    type: 'string',
    defaultValue: '',
    public: true
  },

  // Specifies the initial population of bunnies for the Intro screen. The value of the mutations query parameter
  // determines which alleles abbreviations can appear in this query parameter's value.
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  introPopulation: {
    type: 'array',
    elementSchema: {
      type: 'string'
    },
    defaultValue: [ '1' ],
    public: true
  },

  // Specifies the mutations that appear in the initial population of bunnies for the Lab screen.
  // See introMutations.
  labMutations: {
    type: 'string',
    defaultValue: '',
    public: true
  },

  // Specifies the initial population of bunnies for the Lab screen.
  // See introPopulation.
  labPopulation: {
    type: 'array',
    elementSchema: {
      type: 'string'
    },
    defaultValue: [ '1' ],
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
  maxPopulation: {
    type: 'number',
    defaultValue: 1000,
    isValidValue: maxPopulation => ( maxPopulation > 0 && Utils.isInteger( maxPopulation ) )
  },

  // The number of bunnies per litter.
  // For internal use only.
  maxAge: {
    type: 'number',
    defaultValue: 5,
    isValidValue: maxAge => ( maxAge > 0 && Utils.isInteger( maxAge ) )
  },

  // The number of bunnies per litter.
  // For internal use only.
  litterSize: {
    type: 'number',
    defaultValue: 1,
    isValidValue: litterSize => ( litterSize > 0 && Utils.isInteger( litterSize ) )
  },

  // Adds a red dot at the origin of some objects (bunnies, wolves, food)
  showOrigin: {
    type: 'flag'
  },

  // Adds various debugging info to the UI
  showInfo: {
    type: 'flag'
  },

  // Draws a red line where the horizon is located.
  showHorizon: {
    type: 'flag'
  }
} );

// validate query parameters
assert && assert( NaturalSelectionQueryParameters.secondsPerStep < NaturalSelectionQueryParameters.secondsPerGeneration,
  'secondsPerStep must be < secondsPerGeneration' );

// log the values of all sim-specific query parameters
phet.log && phet.log( 'query parameters: ' + JSON.stringify( NaturalSelectionQueryParameters, null, 2 ) );

naturalSelection.register( 'NaturalSelectionQueryParameters', NaturalSelectionQueryParameters );
export default NaturalSelectionQueryParameters;