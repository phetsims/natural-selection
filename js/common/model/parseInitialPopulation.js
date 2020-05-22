// Copyright 2020, University of Colorado Boulder

/**
 * Parses and validates the values of query parameters that describe the mutations, genotypes, and distribution
 * of the initial population. See NaturalSelectionQueryParameters for the format of the values that are being parsed.
 * See https://github.com/phetsims/natural-selection/issues/9 for design specification and history.
 *
 * Responsibilities:
 * - Parses and validates the query-parameter values
 * - Reports problems via QueryStringMachine.addWarning and to console.error
 * - Sets the dominantAlleleProperty for genes that are represented in the mutations value. See Gene.js.
 * - Builds a data structure that is used to initialize and reset the population. See typedef BunnyVariety
 *   and NaturalSelectionModel.js
 * - Reverts to defaults if there is a problem with query-parameter values
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import GenePool from './GenePool.js';

/**
 * Information needed to create a variety of Bunny. This information is parsed out of the query-parameter values.
 * @typedef BunnyVariety
 * @property {number} count - how many Bunny instances to create
 * @property {Alleles} alleles - alleles in this variety's genotype
 * @property {string} genotypeString - string that alleles was derived from, for debugging
 */

/**
 * A complete set of Alleles needed to describe the genotype for a variety of Bunny. This information is parsed
 * out of the query-parameter values. Any gene not represented in the mutations value will default to the normal allele.
 * @typedef Alleles
 * @property {Allele} fatherFurAllele
 * @property {Allele} motherFurAllele
 * @property {Allele} fatherEarsAllele
 * @property {Allele} motherEarsAllele
 * @property {Allele} fatherTeethAllele
 * @property {Allele} motherTeethAllele
 */

/**
 * Parses query parameters that describe the initial population. Because these query parameters are dependent on
 * each other, if an error is encountered in either value, a warning is added to QueryStringMachine for both query
 * parameters, and they revert to default values. We do not attempt to infer which query parameter is in error,
 * and leave it up to the user to decide.
 *
 * @param {GenePool} genePool
 * @param {string} mutationsName - name of the mutations query parameter
 * @param {string} populationName - name of the population query parameter
 * @returns {BunnyVariety[]}
 * @public
 */
function parseInitialPopulation( genePool, mutationsName, populationName ) {

  assert && assert( genePool instanceof GenePool, 'invalid genePool' );
  assert && assert( typeof mutationsName === 'string', 'invalid mutationsName' );
  assert && assert( typeof populationName === 'string', 'invalid populationName' );

  // Get the query parameter values
  const mutationsValue = NaturalSelectionQueryParameters.getValue( mutationsName );
  const populationValue = NaturalSelectionQueryParameters.getValue( populationName );

  let initialBunnyVarieties = null; // {BunnyVariety[]}
  try {
    const mutationChars = parseMutations( genePool, mutationsName, mutationsValue );
    initialBunnyVarieties = parsePopulation( genePool, mutationChars, populationName, populationValue );
  }
  catch( error ) {

    // Add warnings that QueryStringMachine will display after the sim has fully started.
    QueryStringMachine.addWarning( mutationsName, mutationsValue, error.message );
    QueryStringMachine.addWarning( populationName, populationValue, error.message );

    // Print an error to the console, since QueryStringMachine doesn't currently show the error message.
    console.error(
      `Query parameter error: ${error.message}\n` +
      `${mutationsName}=${mutationsValue}\n` +
      `${populationName}=${populationValue}`
    );

    // Revert mutations that may have been configured by parseMutations.
    genePool.genes.forEach( gene => {
      gene.dominantAlleleProperty.setInitialValue( null );
      gene.dominantAlleleProperty.reset();
    } );

    // Built the data structure for the default initial population.
    const mutationChars = parseMutations( genePool, mutationsName,
      NaturalSelectionQueryParameters.getDefaultValue( mutationsName ) );
    initialBunnyVarieties = parsePopulation( genePool, mutationChars, populationName,
      NaturalSelectionQueryParameters.getDefaultValue( populationName ) );
  }
  return initialBunnyVarieties;
}

/**
 * Parses the query-parameter value that describes mutations. Sets the dominantAlleleProperty for any genes that are
 * present. See NaturalSelectionQueryParameters.labMutations for details on the format of this value.
 *
 * @param {GenePool} genePool
 * @param {string} mutationsName - name of the mutations query parameter, used in error messages
 * @param {string} mutationsValue - value of the mutations query parameter
 * @returns {string[]} array of allele abbreviations
 * @throws {Error}
 */
function parseMutations( genePool, mutationsName, mutationsValue ) {

  assert && assert( genePool instanceof GenePool, 'invalid genePool' );
  assert && assert( typeof mutationsName === 'string', 'invalid mutationsName' );
  assert && assert( typeof mutationsValue === 'string', 'invalid mutationsValue' );

  // Split mutations into individual characters, e.g. 'FeT' -> [ 'F', 'e', 'T' ]
  const mutationChars = mutationsValue.split( '' );

  // Compile a list of all allele abbreviations
  const alleleAbbreviations = [];

  genePool.genes.forEach( gene => {

    const dominantAbbreviation = gene.dominantAbbreviationEnglish;
    const recessiveAbbreviation = gene.recessiveAbbreviationEnglish;
    alleleAbbreviations.push( dominantAbbreviation );
    alleleAbbreviations.push( recessiveAbbreviation );

    // Dominant and recessive abbreviations for the same gene are mutually exclusive
    verify( !( mutationChars.indexOf( dominantAbbreviation ) !== -1 && mutationChars.indexOf( recessiveAbbreviation ) !== -1 ),
      `${mutationsName}: ${dominantAbbreviation} and ${recessiveAbbreviation} are mutually exclusive` );

    // If one of the abbreviations is specified, then make the mutant gene dominant or recessive.
    // This changes both the value and initialValue of dominantAlleleProperty, because this is the initial population,
    // and we want dominantAlleleProperty.reset behave correctly.
    if ( mutationChars.indexOf( dominantAbbreviation ) !== -1 ) {
      gene.dominantAlleleProperty.value = gene.mutantAllele;
      gene.dominantAlleleProperty.setInitialValue( gene.dominantAlleleProperty.value );
    }
    else if ( mutationChars.indexOf( recessiveAbbreviation ) !== -1 ) {
      gene.dominantAlleleProperty.value = gene.normalAllele;
      gene.dominantAlleleProperty.setInitialValue( gene.dominantAlleleProperty.value );
    }
  } );

  // Check for non-allele characters
  verify( _.every( mutationChars, char => alleleAbbreviations.indexOf( char ) !== -1 ),
    `${mutationsName}: ${mutationsValue} contains an invalid character` );

  return mutationChars;
}

/**
 * Parses the query-parameter value that describes genotypes and distribution of those genotypes in the initial
 * population. Builds a data structure used to initialize and reset the population.
 * See NaturalSelectionQueryParameters.labPopulation for details on the format of this value.
 *
 * @param {GenePool} genePool
 * @param {string[]} mutationChars - array of allele abbreviations
 * @param {string} populationName - name of the population query parameter, used in error messages
 * @param {string[]} populationValue - value of the population query parameter
 * @returns {BunnyVariety[]}
 * @throws {Error}
 */
function parsePopulation( genePool, mutationChars, populationName, populationValue ) {

  assert && assert( genePool instanceof GenePool, 'invalid genePool' );
  assert && assert( Array.isArray( mutationChars ), 'invalid mutationChars' );
  assert && assert( typeof populationName === 'string', 'invalid populationName' );
  assert && assert( Array.isArray( populationValue ), 'invalid populationValue' );

  const initialPopulation = []; // {BunnyVariety[]}

  if ( mutationChars.length === 0 ) {

    // If there are no mutations, then population must be a positive integer
    const countErrorMessage = `${populationName} must be a positive integer`;
    verify( populationValue.length === 1, countErrorMessage );
    const countString = populationValue[ 0 ];
    verify( !isNaN( countString ), countErrorMessage );
    const count = parseFloat( countString );
    verify( NaturalSelectionUtils.isPositiveInteger( count ), countErrorMessage );
    const genotypeString = '';

    initialPopulation.push( {
      count: count,
      alleles: genotypeToAlleles( genePool, genotypeString ),
      genotypeString: genotypeString
    } );
  }
  else {

    // The total number of bunnies to be created
    let totalCount = 0;

    // The population is described as expressions that indicate the number of bunnies per genotype, e.g. '35FeT'.
    verify( populationValue.length > 0, `${populationName} value is required` );
    for ( let i = 0; i < populationValue.length; i++ ) {

      // Get an expression from the array, e.g. '35FFeEtt'
      const expression = populationValue[ i ];

      // Split the expression into 2 tokens (count and genotype) e.g. '35FFeEtt' -> '35' and 'FFeEtt'
      const firstLetterIndex = expression.search( /[a-zA-Z]/ );
      verify( firstLetterIndex !== -1, `${populationName}: ${expression} is missing a genotype` );

      const countString = expression.substring( 0, firstLetterIndex );
      const genotypeString = expression.substring( firstLetterIndex );

      // Count must be a positive integer
      const countErrorMessage = `${populationName}: ${expression} must start with a positive integer`;
      verify( !isNaN( countString ), countErrorMessage );
      const count = parseFloat( countString );
      verify( NaturalSelectionUtils.isPositiveInteger( count ), countErrorMessage );

      // Total of all counts must be < maximum population
      totalCount += count;
      verify( totalCount < NaturalSelectionConstants.MAX_POPULATION,
        `${populationName}: the total population must be < ${NaturalSelectionConstants.MAX_POPULATION}` );

      // Genotype must contain 2 alleles for each gene represented in mutations
      const genotypeErrorMessage = `${populationName}: ${genotypeString} is an invalid genotype`;
      verify( genotypeString.length === 2 * mutationChars.length, genotypeErrorMessage );
      assert && genePool.genes.forEach( gene => {

        const dominantAbbreviation = gene.dominantAbbreviationEnglish;
        const recessiveAbbreviation = gene.recessiveAbbreviationEnglish;

        if ( mutationChars.indexOf( dominantAbbreviation ) !== -1 || mutationChars.indexOf( recessiveAbbreviation ) !== -1 ) {
          const countDominant = _.filter( genotypeString.split( '' ), char => char === dominantAbbreviation ).length;
          const countRecessive = _.filter( genotypeString.split( '' ), char => char === recessiveAbbreviation ).length;
          verify( countDominant + countRecessive === 2, genotypeErrorMessage );
        }
      } );

      initialPopulation.push( {
        count: count,
        alleles: genotypeToAlleles( genePool, genotypeString ),
        genotypeString: genotypeString // for debugging
      } );
    }
    verify( totalCount > 0, `${populationName}: the total population must be > 0` );
  }

  return initialPopulation;
}

/**
 * Converts a genotype string to a set of alleles that describe the genotype. Alleles not present in the string
 * default to the normal allele for their associated gene.
 *
 * @param {GenePool} genePool
 * @param {string} genotypeString
 * @returns {Alleles}
 */
function genotypeToAlleles( genePool, genotypeString ) {

  assert && assert( genePool instanceof GenePool, 'invalid genePool' );
  assert && assert( typeof genotypeString === 'string', 'invalid genotypeString' );

  // To make this code easier to read
  const furGene = genePool.furGene;
  const earsGene = genePool.earsGene;
  const teethGene = genePool.teethGene;

  // Start with no alleles, populate these data structures in the forEach loop.
  const furPair = { fatherAllele: null, motherAllele: null };
  const earsPair = { fatherAllele: null, motherAllele: null };
  const teethPair = { fatherAllele: null, motherAllele: null };

  // For each character in the genotype abbreviation...
  const alleleAbbreviations = genotypeString.split( '' );
  alleleAbbreviations.forEach( alleleAbbreviation => {
    abbreviationToAllele( alleleAbbreviation, furGene, furPair );
    abbreviationToAllele( alleleAbbreviation, earsGene, earsPair );
    abbreviationToAllele( alleleAbbreviation, teethGene, teethPair );
  } );

  // Default to the normal allele for any allele that was not specified
  return {
    fatherFurAllele: furPair.fatherAllele || furGene.normalAllele,
    motherFurAllele: furPair.motherAllele || furGene.normalAllele,
    fatherEarsAllele: earsPair.fatherAllele || earsGene.normalAllele,
    motherEarsAllele: earsPair.motherAllele || earsGene.normalAllele,
    fatherTeethAllele: teethPair.fatherAllele || teethGene.normalAllele,
    motherTeethAllele: teethPair.motherAllele || teethGene.normalAllele
  };
}

/**
 * Converts an allele abbreviation to an allele, and puts it in allelesPair.
 *
 * @param {string} alleleAbbreviation
 * @param {Gene} gene
 * @param {fatherAllele:Allele, motherAllele:Allele} allelesPair
 */
function abbreviationToAllele( alleleAbbreviation, gene, allelesPair ) {
  if ( alleleAbbreviation === gene.dominantAbbreviationEnglish || alleleAbbreviation === gene.recessiveAbbreviationEnglish ) {
    assert && assert( gene.dominantAlleleProperty.value, `expected a value for ${gene.name} dominantAlleleProperty` );

    const isMutantDominant = ( gene.dominantAlleleProperty.value === gene.mutantAllele );
    const isAbbreviationDominant = ( alleleAbbreviation === gene.dominantAbbreviationEnglish );

    const allele = ( ( isMutantDominant && isAbbreviationDominant ) || ( !isMutantDominant && !isAbbreviationDominant ) ) ?
                   gene.mutantAllele : gene.normalAllele;

    // Populate fatherAllele first, motherAllele second
    if ( !allelesPair.fatherAllele ) {
      allelesPair.fatherAllele = allele;
    }
    else {
      assert && assert( !allelesPair.motherAllele, 'motherAllele should be null' );
      allelesPair.motherAllele = allele;
    }
  }
}

/**
 * Verifies that a predicate is true. If it's not true, throw an Error that includes the specified message.
 * @param {boolean} predicate
 * @param {string} message
 * @throws {Error}
 */
function verify( predicate, message ) {
  if ( !predicate ) {
    throw new Error( message );
  }
}

naturalSelection.register( 'parseInitialPopulation', parseInitialPopulation );
export default parseInitialPopulation;