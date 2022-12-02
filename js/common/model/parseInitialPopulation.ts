// Copyright 2020-2022, University of Colorado Boulder

/**
 * Parses and validates the values of query parameters that describe the mutations, genotypes, and distribution
 * of the initial population.
 *
 * See NaturalSelectionQueryParameters (labMutations, labPopulation) for examples and details about the values that
 * are being parsed.
 *
 * See https://github.com/phetsims/natural-selection/issues/9 for design history.
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
import NaturalSelectionQueryParameters, { SCHEMA_MAP } from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import Allele from './Allele.js';
import BunnyVariety from './BunnyVariety.js';
import Gene from './Gene.js';
import GenePool from './GenePool.js';

type AllelesPair = {
  fatherAllele: Allele | null;
  motherAllele: Allele | null;
};

// Identifies which screen we're creating the population for.
export type ScreenKey = 'intro' | 'lab';

/**
 * Parses query parameters that describe the initial population. Because these query parameters are dependent on
 * each other, if an error is encountered in either value, a warning is added to QueryStringMachine for both query
 * parameters, and they revert to default values. We do not attempt to infer which query parameter is in error,
 * and leave it up to the user to decide.
 */
export default function parseInitialPopulation( screenKey: ScreenKey, genePool: GenePool ): BunnyVariety[] {

  const mutationsQueryParameterName = `${screenKey}Mutations`;
  const populationQueryParameterName = `${screenKey}Population`;

  // Get the query parameter values
  const mutationsValue = ( ( screenKey === 'intro' ) ? NaturalSelectionQueryParameters.introMutations : NaturalSelectionQueryParameters.labMutations )!;
  assert && assert( mutationsValue !== null, `expected ${mutationsQueryParameterName} to have a non-null default value` );
  const populationValue = ( ( screenKey === 'intro' ) ? NaturalSelectionQueryParameters.introPopulation : NaturalSelectionQueryParameters.labPopulation )!;
  assert && assert( populationValue !== null, `expected ${populationQueryParameterName} to have a non-null default value` );

  let initialBunnyVarieties: BunnyVariety[];
  try {

    // Attempt to parse what the user provided, or the defaults (we don't know which).
    const mutationChars = parseMutations( genePool, mutationsQueryParameterName, mutationsValue );
    initialBunnyVarieties = parsePopulation( genePool, populationQueryParameterName, populationValue, mutationChars );
  }
  catch( error: IntentionalAny ) {

    // Something went wrong, so fallback to default population.

    // Add warnings that QueryStringMachine will display after the sim has fully started.
    QueryStringMachine.addWarning( mutationsQueryParameterName, mutationsValue, error.message );
    QueryStringMachine.addWarning( populationQueryParameterName, populationValue, error.message );

    // Print an error to the console, since QueryStringMachine doesn't currently show the error message.
    console.error(
      `Query parameter error: ${error.message}\n` +
      `${mutationsQueryParameterName}=${mutationsValue}\n` +
      `${populationQueryParameterName}=${populationValue}`
    );

    // Revert mutations that may have been configured by parseMutations.
    genePool.genes.forEach( gene => {
      gene.dominantAlleleProperty.setInitialValue( null );
      gene.dominantAlleleProperty.reset();
    } );

    // Built the data structure for the default initial population.
    const defaultMutationsValue = ( screenKey === 'intro' ) ? SCHEMA_MAP.introMutations.defaultValue : SCHEMA_MAP.labMutations.defaultValue;
    const mutationChars = parseMutations( genePool, mutationsQueryParameterName, defaultMutationsValue );
    const defaultPopulationValue = ( screenKey === 'intro' ) ? SCHEMA_MAP.introPopulation.defaultValue : SCHEMA_MAP.labPopulation.defaultValue;
    initialBunnyVarieties = parsePopulation( genePool, populationQueryParameterName, defaultPopulationValue, mutationChars );
  }
  return initialBunnyVarieties;
}

/**
 * Parses the query-parameter value that describes mutations. Sets the dominantAlleleProperty for any genes that are
 * present. See NaturalSelectionQueryParameters.labMutations for details on the format of this value.
 *
 * @param genePool
 * @param queryParameterName - name of the mutations query parameter, used in error messages
 * @param mutationsValue - value of the mutations query parameter
 * @returns array of allele abbreviations
 * @throws {Error}
 */
function parseMutations( genePool: GenePool, queryParameterName: string, mutationsValue: string ): string[] {

  // Split mutations into individual characters, e.g. 'FeT' -> [ 'F', 'e', 'T' ]
  const mutationChars = mutationsValue.split( '' );

  // Compile a list of all allele abbreviations
  const alleleAbbreviations: string[] = [];

  genePool.genes.forEach( gene => {

    const dominantAbbreviation = gene.dominantAbbreviationEnglish;
    const recessiveAbbreviation = gene.recessiveAbbreviationEnglish;
    alleleAbbreviations.push( dominantAbbreviation );
    alleleAbbreviations.push( recessiveAbbreviation );

    // Dominant and recessive abbreviations for the same gene are mutually exclusive
    verify( !( mutationChars.includes( dominantAbbreviation ) && mutationChars.includes( recessiveAbbreviation ) ),
      `${queryParameterName}: ${dominantAbbreviation} and ${recessiveAbbreviation} are mutually exclusive` );

    // If one of the abbreviations is specified, then make the mutant gene dominant or recessive.
    // This changes both the value and initialValue of dominantAlleleProperty, because this is the initial population,
    // and we want dominantAlleleProperty.reset to behave correctly.
    if ( mutationChars.includes( dominantAbbreviation ) ) {
      gene.dominantAlleleProperty.value = gene.mutantAllele;
      gene.dominantAlleleProperty.setInitialValue( gene.mutantAllele );
    }
    else if ( mutationChars.includes( recessiveAbbreviation ) ) {
      gene.dominantAlleleProperty.value = gene.normalAllele;
      gene.dominantAlleleProperty.setInitialValue( gene.normalAllele );
    }
  } );

  // Check for non-allele characters
  verify( _.every( mutationChars, char => alleleAbbreviations.includes( char ) ),
    `${queryParameterName}: ${mutationsValue} contains an invalid character` );

  return mutationChars;
}

/**
 * Parses the query-parameter value that describes genotypes and distribution of those genotypes in the initial
 * population. Builds a data structure used to initialize and reset the population.
 * See NaturalSelectionQueryParameters.labPopulation for details on the format of this value.
 *
 * @param genePool
 * @param queryParameterName - name of the population query parameter, used in error messages
 * @param populationValue - value of the population query parameter
 * @param mutationChars - array of allele abbreviations
 * @returns a description of the bunnies to create
 * @throws {Error}
 */
function parsePopulation( genePool: GenePool, queryParameterName: string, populationValue: readonly string[],
                          mutationChars: readonly string[] ): BunnyVariety[] {

  const initialPopulation: BunnyVariety[] = [];

  if ( mutationChars.length === 0 ) {

    // If there are no mutations, then population must be a positive integer
    const countErrorMessage = `${queryParameterName} must be a positive integer`;
    verify( populationValue.length === 1, countErrorMessage );
    const countString = populationValue[ 0 ];
    verify( !isNaN( Number( countString ) ), countErrorMessage );
    const count = parseFloat( countString );
    verify( NaturalSelectionUtils.isPositiveInteger( count ), countErrorMessage );
    const genotypeString = '';

    initialPopulation.push( createBunnyVariety( genePool, count, genotypeString ) );
  }
  else {

    // The total number of bunnies to be created
    let totalCount = 0;

    // The population is described as expressions that indicate the number of bunnies per genotype, e.g. '35FeT'.
    verify( populationValue.length > 0, `${queryParameterName} value is required` );
    for ( let i = 0; i < populationValue.length; i++ ) {

      // Get an expression from the array, e.g. '35FFeEtt'
      const expression = populationValue[ i ];

      // Split the expression into 2 tokens (count and genotype) e.g. '35FFeEtt' -> '35' and 'FFeEtt'
      const firstLetterIndex = expression.search( /[a-zA-Z]/ );
      verify( firstLetterIndex !== -1, `${queryParameterName}: ${expression} is missing a genotype` );

      const countString = expression.substring( 0, firstLetterIndex );
      const genotypeString = expression.substring( firstLetterIndex );

      // Count must be a positive integer
      const countErrorMessage = `${queryParameterName}: ${expression} must start with a positive integer`;
      verify( !isNaN( Number( countString ) ), countErrorMessage );
      const count = parseFloat( countString );
      verify( NaturalSelectionUtils.isPositiveInteger( count ), countErrorMessage );

      // Total of all counts must be < maximum population
      totalCount += count;
      verify( totalCount < NaturalSelectionQueryParameters.maxPopulation,
        `${queryParameterName}: the total population must be < ${NaturalSelectionQueryParameters.maxPopulation}` );

      // Genotype must contain 2 alleles for each gene represented in mutations
      const genotypeErrorMessage = `${queryParameterName}: ${genotypeString} is an invalid genotype`;
      verify( genotypeString.length === 2 * mutationChars.length, genotypeErrorMessage );
      assert && genePool.genes.forEach( gene => {

        const dominantAbbreviation = gene.dominantAbbreviationEnglish;
        const recessiveAbbreviation = gene.recessiveAbbreviationEnglish;

        // If the gene is represented in mutations...
        if ( mutationChars.includes( dominantAbbreviation ) || mutationChars.includes( recessiveAbbreviation ) ) {

          const genotypeChars = genotypeString.split( '' );

          // The expression must contain exactly 2 alleles for each gene.
          const countDominant = _.filter( genotypeChars, char => char === dominantAbbreviation ).length;
          const countRecessive = _.filter( genotypeChars, char => char === recessiveAbbreviation ).length;
          verify( countDominant + countRecessive === 2, genotypeErrorMessage );

          // The alleles must be paired (adjacent) in the expression.
          const dominantIndex = genotypeChars.indexOf( dominantAbbreviation );
          const recessiveIndex = genotypeChars.indexOf( recessiveAbbreviation );
          const maxIndex = Math.max( dominantIndex, recessiveIndex );
          const minIndex = Math.min( dominantIndex, recessiveIndex );
          const firstIndex = ( minIndex !== -1 ) ? minIndex : maxIndex;
          verify( genotypeChars[ firstIndex + 1 ] === dominantAbbreviation ||
                  genotypeChars[ firstIndex + 1 ] === recessiveAbbreviation,
            genotypeErrorMessage );
        }
      } );

      initialPopulation.push( createBunnyVariety( genePool, count, genotypeString ) );
    }
    verify( totalCount > 0, `${queryParameterName}: the total population must be > 0` );
  }

  return initialPopulation;
}

/**
 * Converts a genotype expression to a data structure that describes the count and genotype for a bunny variety.
 * Alleles not present in the string default to the normal allele for their associated gene.
 */
function createBunnyVariety( genePool: GenePool, count: number, genotypeString: string ): BunnyVariety {

  assert && assert( NaturalSelectionUtils.isPositiveInteger( count ), 'invalid count' );

  // To make this code easier to read
  const furGene = genePool.furGene;
  const earsGene = genePool.earsGene;
  const teethGene = genePool.teethGene;

  // Start with no alleles, populate these data structures in the forEach loop.
  const furPair: AllelesPair = { fatherAllele: null, motherAllele: null };
  const earsPair: AllelesPair = { fatherAllele: null, motherAllele: null };
  const teethPair: AllelesPair = { fatherAllele: null, motherAllele: null };

  // For each character in the genotype abbreviation...
  const alleleAbbreviations = genotypeString.split( '' );
  alleleAbbreviations.forEach( alleleAbbreviation => {
    abbreviationToAllele( alleleAbbreviation, furGene, furPair );
    abbreviationToAllele( alleleAbbreviation, earsGene, earsPair );
    abbreviationToAllele( alleleAbbreviation, teethGene, teethPair );
  } );

  return new BunnyVariety( count, genotypeString,

    // Default to the normal allele for any allele that was not specified
    furPair.fatherAllele || furGene.normalAllele,
    furPair.motherAllele || furGene.normalAllele,
    earsPair.fatherAllele || earsGene.normalAllele,
    earsPair.motherAllele || earsGene.normalAllele,
    teethPair.fatherAllele || teethGene.normalAllele,
    teethPair.motherAllele || teethGene.normalAllele
  );
}

/**
 * Converts an allele abbreviation to an allele, and puts it in allelesPair.
 */
function abbreviationToAllele( alleleAbbreviation: string, gene: Gene, allelesPair: AllelesPair ): void {
  if ( alleleAbbreviation === gene.dominantAbbreviationEnglish || alleleAbbreviation === gene.recessiveAbbreviationEnglish ) {
    assert && assert( gene.dominantAlleleProperty.value, `expected a value for ${gene.nameProperty.value} dominantAlleleProperty` );

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
 */
function verify( predicate: boolean, message: string ): void {
  if ( !predicate ) {
    throw new Error( message );
  }
}

naturalSelection.register( 'parseInitialPopulation', parseInitialPopulation );