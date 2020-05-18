// Copyright 2020, University of Colorado Boulder

/**
 * PopulationParser parses the values of the mutation and population query parameters, validates the values,
 * and converts them to a data structure that can be used by the model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import GenePool from './GenePool.js';

/**
 * @typedef PopulationDescription
 * @property {number} count
 * @property {string} genotypeString
 */

const PopulationParser = {

  /**
   * @param {GenePool} genePool
   * @param {string} mutations - value of the mutations query parameter
   * @param {string[]} population - value of the population query parameter
   * @returns {PopulationDescription[]}
   */
  parse( genePool, mutations, population ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( typeof mutations === 'string', 'invalid mutations' );
    assert && assert( Array.isArray( population ), 'invalid population' );

    // {PopulationDescription[]} Data structure that describes the initial population
    const initialPopulation = [];

    if ( mutations.length === 0 ) {

      // If there are no mutations, then population must be a positive integer
      const countString = population[ 0 ];
      assert && assert( !isNaN( countString ), `population must be a number: ${countString}` );
      const count = parseFloat( countString );
      assert && assert( Utils.isInteger( count ) && count > 0, `population must be a positive integer: ${count}` );

      initialPopulation.push( {
        count: count,
        genotypeString: ''
      } );
    }
    else {

      // Split mutations into individual characters, e.g. 'FeT' -> [ 'F', 'e', 'T' ]
      const mutationChars = mutations.split( '' );

      // Compile a list of all allele abbreviations
      const alleleAbbreviations = [];

      const genes = genePool.genes;
      genes.forEach( gene => {

        const dominantAbbreviation = gene.dominantAbbreviationEnglish;
        const recessiveAbbreviation = gene.recessiveAbbreviationEnglish;
        alleleAbbreviations.push( dominantAbbreviation );
        alleleAbbreviations.push( recessiveAbbreviation );

        // Dominant and recessive abbreviations for the same gene are mutually exclusive
        assert && assert( !( mutationChars.indexOf( dominantAbbreviation ) !== -1 && mutationChars.indexOf( recessiveAbbreviation ) !== -1 ),
          `${dominantAbbreviation} and ${recessiveAbbreviation} are mutually exclusive: ${mutations}` );

        // If one of the abbreviations is specified, then make the mutant gene dominant or recessive
        if ( mutationChars.indexOf( dominantAbbreviation ) !== -1 ) {
          gene.dominantAlleleProperty.value = gene.mutantAllele;
        }
        else if ( mutationChars.indexOf( recessiveAbbreviation ) !== -1 ) {
          gene.dominantAlleleProperty.value = gene.normalAllele;
        }
      } );

      // Check for non-allele characters
      assert && assert( _.every( mutationChars, char => alleleAbbreviations.indexOf( char ) !== -1 ),
        `invalid character in mutations: ${mutations}` );

      // The total number of bunnies to be created
      let totalCount = 0;

      // The population is described as expressions that indicate the number of bunnies per genotype, e.g. '35FeT'.
      assert && assert( population.length > 0, 'at least 1 population expression is required' );
      for ( let i = 0; i < population.length; i++ ) {

        // Get an expression from the array, e.g. '35FFeEtt'
        const expression = population[ i ];

        // Split the expression into 2 tokens (count and genotype) e.g. '35FFeEtt' -> '35' and 'FFeEtt'
        const firstLetterIndex = expression.search( /[a-zA-Z]/ );
        assert && assert( firstLetterIndex !== -1 && firstLetterIndex < expression.length - 1,
          `malformed population expression: ${expression}` );
        const countString = expression.substring( 0, firstLetterIndex );
        const genotypeString = expression.substring( firstLetterIndex );

        // Count must be a positive integer
        assert && assert( !isNaN( countString ), `${countString} is not a number` );
        const count = parseFloat( countString );
        assert && assert( Utils.isInteger( count ) && count > 0, `${count} must be a positive integer` );

        // Total of all counts must be < maximum population
        totalCount += count;
        assert && assert( totalCount < NaturalSelectionConstants.MAX_POPULATION,
          `total population must be < ${NaturalSelectionConstants.MAX_POPULATION}` );

        // Genotype must contain 2 alleles for each gene represented in mutations
        assert && assert( genotypeString.length === 2 * mutationChars.length, `invalid genotypeString: ${genotypeString}` );
        assert && genes.forEach( gene => {

          const dominantAbbreviation = gene.dominantAbbreviationEnglish;
          const recessiveAbbreviation = gene.recessiveAbbreviationEnglish;

          if ( mutationChars.indexOf( dominantAbbreviation ) !== -1 || mutationChars.indexOf( recessiveAbbreviation ) !== -1 ) {
            const countDominant = _.filter( genotypeString.split( '' ), char => char === dominantAbbreviation ).length;
            const countRecessive = _.filter( genotypeString.split( '' ), char => char === recessiveAbbreviation ).length;
            assert && assert( countDominant + countRecessive === 2, `invalid genotypeString: ${genotypeString}` );
          }
        } );

        initialPopulation.push( {
          count: count,
          genotypeString: genotypeString
        } );
      }
      assert && assert( totalCount > 0, 'total population must be > 0' );
    }

    return initialPopulation;
  }
};

naturalSelection.register( 'PopulationParser', PopulationParser );
export default PopulationParser;