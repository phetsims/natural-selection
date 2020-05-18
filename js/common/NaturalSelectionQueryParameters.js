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
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  //
  // The value determines which mutant alleles are present, whether they are dominant or recessive,
  // and which allele abbreviations can appear in the population query-parameter value.
  //
  // Valid characters for the mutations are as follows:
  //   Fur:   'F' = dominant, 'f' = recessive
  //   Ears:  'E' = dominant, 'e' = recessive
  //   Teeth: 'T' = dominant, 't' = recessive
  //
  // The string can contain characters for zero or more mutations. Each mutation may appear only once.
  //
  // Valid examples:
  //   introMutations=F
  //   introMutations=f
  //   introMutations=fTe
  //
  // Invalid examples:
  //   introMutations=FfEt - fur mutation appears twice ('F' and 'f')
  //   introMutations=Fx - 'x' is not a valid character
  //
  introMutations: {
    type: 'string',
    defaultValue: '',
    public: true
  },

  // Specifies the initial population of bunnies for the Intro screen.
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  //
  // The value of introMutations determines which alleles abbreviations can appear in this query parameter's value.
  // If a mutation is present in the mutations query parameter, then the dominant and/or recessive abbreviations for
  // that allele must appear exactly twice in introPopulation.
  //
  // Valid examples:
  //   introMutations=F&introPopulation=Ff
  //   introMutations=FeT&introPopulation=FFeETt
  //
  // Invalid examples:
  //   introMutations=F&introPopulation=FfEe - Ears ('E', 'e') does not appear in introMutations
  //   introMutations=FE&introPopulation=Ff - Ears ('E', 'e') is missing from introPopulation
  //   introMutations=FE&introPopulation=FEe - Fur ('F', 'f') must appear exactly twice in introPopulation
  //   introMutations=F&introPopulation=FfF - Fur ('F', 'f') must appear exactly twice in introPopulation
  //   introMutations=F&introPopulation=FFx - 'x' is not a valid character
  //
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
    defaultValue: 750,
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
    defaultValue: 4,
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