// Copyright 2019-2022, University of Colorado Boulder

/**
 * NaturalSelectionQueryParameters defines query parameters that are specific to this simulation.
 * Run with ?log to print these query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import logGlobal from '../../../phet-core/js/logGlobal.js';
import naturalSelection from '../naturalSelection.js';
import NaturalSelectionUtils from './NaturalSelectionUtils.js';

const SCHEMA_MAP = {

  //------------------------------------------------------------------------------------------------------------------
  // Public facing
  //------------------------------------------------------------------------------------------------------------------

  // Determines whether allele abbreviations are visible in the UI. Setting this to false hides the Pedigree 'Alleles'
  // panel, makes the Pedigree graph wider, and allele abbreviations will not be shown in the Pedigree graph.
  allelesVisible: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  // Specifies the mutations that appear in the initial population of bunnies for the Intro screen.
  // See documentation for labMutations.
  introMutations: {
    type: 'string',
    defaultValue: '',
    public: true
  },

  // Specifies the initial population of bunnies for the Intro screen.
  // See documentation for labPopulation.
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
  //
  //   Mutation       Dominant   Recessive
  //   -----------------------------------
  //   Brown Fur         F           f
  //   Floppy Ears       E           e
  //   Long Teeth        T           t
  //
  // The value may contain characters for one or more mutations. Each mutation may appear only once.
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
  // NOTE: Allele abbreviations are (by design) not translated in query parameters. If you are using a translated
  // version of the sim, you must use the English allele abbreviations in query parameters.
  //
  labMutations: {
    type: 'string',
    defaultValue: '',
    public: true
  },

  // Specifies the genotypes and their distribution in the initial population for the Lab screen.
  // See https://github.com/phetsims/natural-selection/issues/9 for design history and specification.
  //
  // The value of labMutations determines which allele abbreviations can appear in this query parameter's value.
  // If a mutation is present in the labMutations query parameter, then the dominant and/or recessive abbreviations
  // for that allele must appear exactly twice in labPopulation.
  //
  // Related alleles must appear in pairs. The first allele in the pair is the 'father' allele, the second allele is
  // the 'mother' allele. In the Pedigree graph, the father is on the left, the mother is on the right. So for example,
  // 'Ff' and 'fF' result in a different genotype.
  //
  // If labMutations is omitted, then labPopulation must be a positive integer that indicates how many bunnies
  // are in the initial population. Those bunnies will all have normal alleles.
  //
  // Valid examples:
  //   labMutations=F&labPopulation=5FF
  //   labMutations=F&labPopulation=5FF,5Ff,5ff
  //   labMutations=FeT&labPopulation=5FFeETt
  //   labMutations=FeT&labPopulation=5FFeETt,5ffeett
  //   labPopulation=10 - initial population of 10 bunnies with normal alleles
  //
  // Invalid examples:
  //   labMutations=FE&labPopulation=FfEe - missing count
  //   labMutations=FE&labPopulation=10FEfe - related alleles are not paired, should be 10FfEe
  //   labMutations=F&labPopulation=20FfEe - Ears ('E', 'e') does not appear in labMutations
  //   labMutations=FE&labPopulation=10Ff - Ears ('E', 'e') is missing from labPopulation
  //   labMutations=FE&labPopulation=10FEe - 'F' is invalid, fur must appear exactly twice
  //   labMutations=F&labPopulation=10FfFEe - 'FfF' is invalid, fur must appear exactly twice
  //   labMutations=F&labPopulation=10FFx - 'x' is not a valid character
  //   labMutations=F&labPopulations=10 - missing mutations in labPopulations
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

  // Seconds of real time per cycle of the generation clock. This is useful for development and testing, because
  // life is too short to sit around waiting for bunnies to die or take over the world.
  secondsPerGeneration: {
    type: 'number',
    defaultValue: 10,
    isValidValue: ( value: number ) => ( value > 0 )
  },

  // Scale time by this much while the fast-forward button is pressed.
  // Tuned in https://github.com/phetsims/natural-selection/issues/100
  fastForwardScale: {
    type: 'number',
    defaultValue: 4,
    isValidValue: ( value: number ) => ( value >= 1 )
  },

  // Maximum number of generations before the sim stops and displays MemoryLimitDialog.
  // Tuned in https://github.com/phetsims/natural-selection/issues/46
  maxGenerations: {
    type: 'number',
    defaultValue: 1000,
    isValidValue: ( value: number ) => ( value > 0 )
  },

  // The number of bunnies required to 'take over the world'. Careful, because all bunnies are allowed to mate before
  // this value is checked, so the population could get ridiculously large.
  // Tuned in https://github.com/phetsims/natural-selection/issues/75
  maxPopulation: {
    type: 'number',
    defaultValue: 750,
    isValidValue: ( value: number ) => NaturalSelectionUtils.isPositiveInteger( value )
  },

  // Age at which bunnies die of old-age.
  maxAge: {
    type: 'number',
    defaultValue: 5, // Java version value is 5
    isValidValue: ( value: number ) => NaturalSelectionUtils.isPositiveInteger( value )
  },

  // Percentage of newborn bunnies that will receive a mutation.
  // Symmetric rounding is used, and at least 1 bunny will receive the mutation.
  mutationPercentage: {
    type: 'number',

    // from the Java version, see MUTATING_BUNNY_PER_BUNNIES in NaturalSelectionDefaults.java
    defaultValue: 1 / 7,

    // All 3 mutations can be applied simultaneously. Mutation is mutually-exclusive by gene. A bunny can have at
    // most 1 mutation. And we have 3 mutations, for fur, ears, and teeth. So at most 1/3 of the population can get a
    // specific mutation.
    isValidValue: ( value: number ) => ( value > 0 && value <= 1 / 3 )
  },

  // The random percentage of bunnies that will be eaten by wolves. See WolfCollection.eatBunnies.
  // Tuned in https://github.com/phetsims/natural-selection/issues/86
  wolvesPercentToEatRange: {
    type: 'custom',
    parse: parseRange,
    defaultValue: new Range( 0.35, 0.4 ),
    isValidValue: ( range: Range ) => NaturalSelectionUtils.isPercentRange( range )
  },

  // Multiplier for when the bunny's fur color does not match the environment. See WolfCollection.eatBunnies.
  // Tuned in https://github.com/phetsims/natural-selection/issues/86
  wolvesEnvironmentMultiplier: {
    type: 'number',
    defaultValue: 2.3,
    isValidValue: ( value: number ) => ( value > 1 )
  },

  // The random percentage of bunnies that will die of starvation when food is tough. See Food.starveBunnies.
  // Tuned in https://github.com/phetsims/natural-selection/issues/86
  toughFoodPercentToStarveRange: {
    type: 'custom',
    parse: parseRange,
    defaultValue: new Range( 0.4, 0.45 ),
    isValidValue: ( range: Range ) => NaturalSelectionUtils.isPercentRange( range )
  },

  // Multiplier for bunnies with short teeth when food is tough. See Food.starveBunnies.
  // Tuned in https://github.com/phetsims/natural-selection/issues/86
  shortTeethMultiplier: {
    type: 'number',
    defaultValue: 2,
    isValidValue: ( value: number ) => ( value > 1 )
  },

  // Range for the number of bunnies that can be sustained on limited food (carrying capacity). See Food.starveBunnies.
  limitedFoodPopulationRange: {
    type: 'custom',
    parse: parseRange,
    defaultValue: new Range( 90, 110 ),
    isValidValue: ( range: Range ) => ( range.min > 0 ) && ( range.min < range.max )
  },

  // Specifies the number of shrubs to show for limited (min) and abundant (max) food.
  shrubsRange: {
    type: 'custom',
    parse: parseRange,
    defaultValue: new Range( 10, 75 ),
    isValidValue: ( range: Range ) => ( range.min > 0 ) && ( range.max > range.min )
  },

  // Adds a red dot at the origin of some objects (bunnies, wolves, food)
  showOrigin: {
    type: 'flag'
  },

  // Draws a red line where the horizon is located
  showHorizon: {
    type: 'flag'
  },

  // Displays time profiling in the upper-left corner of the screen. This was used for performance profiling
  // and may be useful in the future. See https://github.com/phetsims/natural-selection/issues/60 and
  // https://github.com/phetsims/natural-selection/issues/140.
  showTimes: {
    type: 'flag'
  }
} as const;

const NaturalSelectionQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );

/**
 * Parses a query-parameter value into a Range.
 */
function parseRange( value: string ): Range {
  const tokens = value.split( ',' );
  assert && assert( tokens.length === 2, `range format is min,max: ${value}` );
  assert && assert( _.every( tokens, token => isFinite( Number( token ) ) ), `range must be 2 numbers: ${value}` );
  const numbers = _.map( tokens, token => Number( token ) );
  return new Range( numbers[ 0 ], numbers[ 1 ] );
}

// validate query parameters
assert && assert( NaturalSelectionQueryParameters.wolvesEnvironmentMultiplier *
                  NaturalSelectionQueryParameters.wolvesPercentToEatRange.max <= 1,
  'wolvesEnvironmentMultiplier * wolvesPercentToEatRange.max must be <= 1' );

// Tweaking the parameters for tough food required that we clamp this computation to 1. This warning is a reminder.
// See https://github.com/phetsims/natural-selection/issues/168#issuecomment-673048314
if ( NaturalSelectionQueryParameters.shortTeethMultiplier *
     NaturalSelectionQueryParameters.toughFoodPercentToStarveRange.max > 1 ) {
  phet.log && phet.log( 'WARNING: shortTeethMultiplier * toughFoodPercentToStarveRange.max > 1, and will be clamped to 1' );
}

naturalSelection.register( 'NaturalSelectionQueryParameters', NaturalSelectionQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.naturalSelection.NaturalSelectionQueryParameters' );

export default NaturalSelectionQueryParameters;
export { SCHEMA_MAP };
