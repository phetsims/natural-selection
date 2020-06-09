// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionQueryParameters defines query parameters that are specific to this simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../dot/js/Utils.js';
import naturalSelection from '../naturalSelection.js';
import NaturalSelectionUtils from './NaturalSelectionUtils.js';

// The schema that describes the query parameters for this simulation
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
  // NOTE: PhET-iO allows you to show/hide any of the 3 genes in both screens. It is up to the user to specify
  // only the genes that are visible for the screen. For example, the sim will happily accept 'labMutations=FeT',
  // then allow you to hide Fur in the Lab screen.  Or it will accept 'introMutations=T' and assume that PhET-iO
  // will be making Teeth visible in the Intro screen.
  //
  labMutations: {
    type: 'string',
    defaultValue: '',
    public: true
  },

  // Specifies the genotypes and their distribution in the initial population for the Lab screen.
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
    isValidValue: value => ( value > 0 )
  },

  // Seconds of real time per each press of the Step button.
  // For internal use only.
  secondsPerStep: {
    type: 'number',
    defaultValue: 0.1,
    isValidValue: value => ( value > 0 )
  },

  // The number of bunnies required to 'take over the world'.
  // For internal use only.
  maxPopulation: {
    type: 'number',
    defaultValue: 750,
    isValidValue: value => ( value > 0 && Utils.isInteger( value ) )
  },

  // The number of bunnies per litter.
  // For internal use only.
  maxAge: {
    type: 'number',
    defaultValue: 5,
    isValidValue: value => NaturalSelectionUtils.isPositiveInteger( value )
  },

  // The number of bunnies per litter.
  // For internal use only.
  litterSize: {
    type: 'number',
    defaultValue: 4,
    isValidValue: value => NaturalSelectionUtils.isPositiveInteger( value )
  },

  // This query parameter determines the percentages of bunnies that will be eaten by wolves.
  // A value is randomly chosen from this range.
  //
  // Bunnies whose fur color matches the environment will be eaten at the rate specified by wolvesPercentToKill.
  // Bunnies whose fur color does NOT match the environment will be eaten at the rate of wolvesEnvironmentMultiplier *
  // wolvesPercentToKill.
  //
  // For internal use only.
  wolvesPercentToKill: {
    type: 'array',
    elementSchema: { type: 'number' },
    defaultValue: [ 0.05, 0.05 ], // min, max
    isValidValue: array => isPercentRange( array )
  },

  // Multiplier for when the bunny's fur color does not match the environment, applied to wolvesPercentToKill.
  // For internal use only.
  wolvesEnvironmentMultiplier: {
    type: 'number',
    defaultValue: 3,
    isValidValue: value => ( value > 1 )
  },

  // This query parameter determines the percentages of bunnies that will die of starvation when food is tender.
  // A value is randomly chosen from this range.
  // Bunnies will die at this rate regardless of their teeth alleles.
  // For internal use only.
  limitedFoodPercentToKill: {
    type: 'array',
    elementSchema: { type: 'number' },
    defaultValue: [ 0.1, 0.1 ], // min, max
    isValidValue: array => isPercentRange( array )
  },

  // This query parameter determines the percentages of bunnies that will die of starvation when food is tough.
  // A value is randomly chosen from this range.
  //
  // Bunnies with long teeth will die at the rate specified by toughFoodPercentToKill.
  // Bunnies with short teeth will die at the rate of toughFoodPercentToKill * ?shortTeethMultiplier.
  // If food is also limited, then the values for both types of bunny will be multiplied by ?limitedFoodMultiplier.
  //
  // For internal use only.
  toughFoodPercentToKill: {
    type: 'array',
    elementSchema: { type: 'number' },
    defaultValue: [ 0.05, 0.05 ], // min, max
    isValidValue: array => isPercentRange( array )
  },

  // Multiplier for bunnies with short teeth when food is tough, applied to toughFoodPercentToKill.
  // For internal use only.
  shortTeethMultiplier: {
    type: 'number',
    defaultValue: 3,
    isValidValue: value => ( value > 1 )
  },

  // Multiplier for when limited food is combined with tough food, applied to toughFoodPercentToKill.
  // For internal use only.
  limitedFoodMultiplier: {
    type: 'number',
    defaultValue: 2,
    isValidValue: value => ( value > 1 )
  },

  // The minimum number of wolves
  // For internal use only.
  minWolves: {
    type: 'number',
    defaultValue: 5,
    isValidValue: value => NaturalSelectionUtils.isPositiveInteger( value )
  },

  // The number of bunnies per wolf. Wolves are created based on the size of the bunny population.
  // The formula is: numberOfWolves = Math.max( ?minWolves, numberOfBunnies / ?bunniesPerWolf )
  // For internal use only.
  bunniesPerWolf: {
    type: 'number',
    defaultValue: 10,
    isValidValue: value => NaturalSelectionUtils.isPositiveInteger( value )
  },

  // Adds a red dot at the origin of some objects (bunnies, wolves, food)
  // For internal use only.
  showOrigin: {
    type: 'flag'
  },

  // Adds various debugging info to the UI
  // For internal use only.
  showInfo: {
    type: 'flag'
  },

  // Draws a red line where the horizon is located
  // For internal use only.
  showHorizon: {
    type: 'flag'
  },

  // Determines whether mutants are homozygous (true) or heterozygous (false)
  // For internal use only.
  homozygousMutants: {
    type: 'boolean',
    defaultValue: true
  },

  // Percentage of newborn bunnies that will receive a mutation
  // For internal use only.
  mutationPercentage: {
    type: 'number',

    // from the Java version, see MUTATING_BUNNY_PER_BUNNIES in NaturalSelectionDefaults.java
    defaultValue: 1/7,

    // there are 3 mutations, and a bunny can have at most 1 mutation
    isValidValue: value => ( value > 0  && value <= 1/3 )
  }
};

const NaturalSelectionQueryParameters = QueryStringMachine.getAll( SCHEMA );

/**
 * Gets the value for a query parameter.
 * @param {string} key - the query parameter key
 * @returns {*}
 */
NaturalSelectionQueryParameters.getValue = function( key ) {
  return NaturalSelectionQueryParameters[ key ];
};

/**
 * Gets the default value for a query parameter.
 * @param {string} key - the query parameter key
 * @returns {*}
 */
NaturalSelectionQueryParameters.getDefaultValue = function( key ) {
  return SCHEMA[ key ].defaultValue;
};

/**
 * Is the query parameter value a min/max range for a percentage?
 * @param {*} array
 * @returns {boolean}
 */
function isPercentRange( array ) {
  return ( Array.isArray( array ) && ( array.length === 2 ) && ( array[ 0 ] <= array[ 1 ] ) &&
           _.every( array, element => ( element > 0 && element < 1 ) )
  );
}

// validate query parameters
assert && assert( NaturalSelectionQueryParameters.secondsPerStep < NaturalSelectionQueryParameters.secondsPerGeneration,
  'secondsPerStep must be < secondsPerGeneration' );
assert && assert( NaturalSelectionQueryParameters.wolvesEnvironmentMultiplier *
                  NaturalSelectionQueryParameters.wolvesPercentToKill[ 1 ] <= 1,
  'wolvesEnvironmentMultiplier * wolvesPercentToKill.max must be <= 1' );
assert && assert( NaturalSelectionQueryParameters.limitedFoodMultiplier *
                  NaturalSelectionQueryParameters.shortTeethMultiplier *
                  NaturalSelectionQueryParameters.toughFoodPercentToKill[ 1 ] <= 1,
  'limitedFoodMultiplier * shortTeethMultiplier * toughFoodPercentToKill.max must be <= 1' );

// log the values of all sim-specific query parameters
phet.log && phet.log( 'query parameters: ' + JSON.stringify( NaturalSelectionQueryParameters, null, 2 ) );

naturalSelection.register( 'NaturalSelectionQueryParameters', NaturalSelectionQueryParameters );
export default NaturalSelectionQueryParameters;