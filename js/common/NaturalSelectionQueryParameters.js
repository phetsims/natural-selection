// Copyright 2019-2020, University of Colorado Boulder

/**
 * Query parameters that are specific to this simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../dot/js/Utils.js';
import naturalSelection from '../naturalSelection.js';

const SCHEMA = {

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

  // Specifies the mutations that appear in the initial population of bunnies for the Lab screen.
  // See labMutations.
  introMutations: {
    type: 'string',
    defaultValue: '',
    public: true
  },

  // Specifies the initial population of bunnies for the Lab screen.
  // See labPopulation.
  introPopulation: {
    type: 'array',
    elementSchema: {
      type: 'string'
    },
    defaultValue: [ '1' ],
    public: true
  },

  // Specifies the mutations that appear in the initial population of bunnies for the Lab screen.
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  //
  // The value determines which mutant alleles are present, whether they are dominant or recessive,
  // and which allele abbreviations can appear in the labPopulation query-parameter value.
  //
  // Valid characters for the mutations are as follows:
  //   Fur:   'F' = dominant, 'f' = recessive
  //   Ears:  'E' = dominant, 'e' = recessive
  //   Teeth: 'T' = dominant, 't' = recessive
  //
  // The string can contain characters for zero or more mutations. Each mutation may appear only once.
  //
  // Valid examples:
  //   labMutations=F
  //   labMutations=f
  //   labMutations=fTe
  //
  // Invalid examples:
  //   labMutations=FfEt - fur mutation appears twice ('F' and 'f')
  //   labMutations=Fx - 'x' is not a valid character
  //
  // NOTE: PhET-iO allows you show/hide any of the 3 genes in both screens. It is up to the user to specify
  // only the genes that are visible for the screen. For example, the sim will happily accept 'labMutations=FeT',
  // then allow you to hide Fur in the Lab screen.  Or it will accept 'introMutations=T' and assume that PhET-iO
  // will be making Teeth visible in the Intro screen.
  //
  labMutations: {
    type: 'string',
    defaultValue: '',
    public: true
  },

  // Specifies the initial population of bunnies for the Lab screen.
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  //
  // The value of labMutations determines which alleles abbreviations can appear in this query parameter's value.
  // If a mutation is present in the labMutations query parameter, then the dominant and/or recessive abbreviations
  // for that allele must appear exactly twice in labPopulation.
  //
  // Valid examples:
  //   labMutations=F&labPopulation=5FF
  //   labMutations=F&labPopulation=5FF,5Ff,5ff
  //   labMutations=FeT&labPopulation=5FFeETt
  //   labMutations=FeT&labPopulation=5FFeETt,5ffeett
  //
  // Invalid examples:
  //   labMutations=F&labPopulation=FfEe - missing count
  //   labMutations=F&labPopulation=20FfEe - Ears ('E', 'e') does not appear in labMutations
  //   labMutations=FE&labPopulation=10Ff - Ears ('E', 'e') is missing from labPopulation
  //   labMutations=FE&labPopulation=10FEe - Fur ('F', 'f') must appear exactly twice in labPopulation
  //   labMutations=F&labPopulation=10FfF - Fur ('F', 'f') must appear exactly twice in labPopulation
  //   labMutations=F&labPopulation=10FFx - 'x' is not a valid character
  //
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
};

const NaturalSelectionQueryParameters = QueryStringMachine.getAll( SCHEMA );

NaturalSelectionQueryParameters.SCHEMA = SCHEMA;

// validate query parameters
assert && assert( NaturalSelectionQueryParameters.secondsPerStep < NaturalSelectionQueryParameters.secondsPerGeneration,
  'secondsPerStep must be < secondsPerGeneration' );

// log the values of all sim-specific query parameters
phet.log && phet.log( 'query parameters: ' + JSON.stringify( NaturalSelectionQueryParameters, null, 2 ) );

naturalSelection.register( 'NaturalSelectionQueryParameters', NaturalSelectionQueryParameters );
export default NaturalSelectionQueryParameters;