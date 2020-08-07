// Copyright 2020, University of Colorado Boulder

/**
 * Food is the model of the food supply, a collection of Shrubs.
 * It controls the type (tender or tough) and quantity of food that is available.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCollection from './BunnyCollection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenerationClock from './GenerationClock.js';
import Shrub from './Shrub.js';

// constants

// Food is applied at the midpoint of its 'slice' of the generation clock.
// See https://github.com/phetsims/natural-selection/issues/110
const CLOCK_FOOD_MIDPOINT = NaturalSelectionConstants.CLOCK_FOOD_RANGE.getCenter();

// The minimum total population required for limited food to be a factor,
// see https://github.com/phetsims/natural-selection/issues/153
const LIMITED_FOOD_MIN_TOTAL = 7;

// The minimum number of bunnies with long teeth required for tough food to be a factor for bunnies with long teeth,
// see https://github.com/phetsims/natural-selection/issues/98
const TOUGH_FOOD_MIN_LONG_TEETH = 5;

class Food {

  /**
   * @param {GenerationClock} generationClock
   * @param {BunnyCollection} bunnyCollection
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( generationClock, bunnyCollection, modelViewTransform, options ) {

    assert && assert( generationClock instanceof GenerationClock, 'invalid generationClock' );
    assert && assert( bunnyCollection instanceof BunnyCollection, 'invalid bunnyCollection' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.bunnyCollection = bunnyCollection;

    // @public
    this.isToughProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isToughProperty' ),
      phetioDocumentation: 'whether the food supply is tough (true) or tender (false)'
    } );

    // @public
    this.isLimitedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isLimitedProperty' ),
      phetioDocumentation: 'whether the food supply is limited'
    } );

    // @public whether either factor related to food is enabled. dispose is not necessary.
    this.enabledProperty = new DerivedProperty(
      [ this.isToughProperty, this.isLimitedProperty ],
      ( isTough, isLimited ) => ( isTough || isLimited )
    );

    // @public emits when bunnies have died of starvation. dispose is not necessary.
    this.bunniesStarvedEmitter = new Emitter();

    // @public (read-only) {Shrub[]} the collection of Shrubs
    // Categories (A, B, C) and approximate positions are as specified in
    // https://github.com/phetsims/natural-selection/issues/17
    this.shrubs = [

      // A
      new Shrub( modelViewTransform, {
        category: 'A',
        position: modelViewTransform.getGroundPosition( -65, 210 )
      } ),
      new Shrub( modelViewTransform, {
        category: 'A',
        position: modelViewTransform.getGroundPosition( 155, 160 )
      } ),

      // B
      new Shrub( modelViewTransform, {
        category: 'B',
        position: modelViewTransform.getGroundPosition( -155, 160 )
      } ),
      new Shrub( modelViewTransform, {
        category: 'B',
        position: modelViewTransform.getGroundPosition( 200, 250 )
      } ),

      // C
      new Shrub( modelViewTransform, {
        category: 'C',
        position: modelViewTransform.getGroundPosition( 60, 185 )
      } ),
      new Shrub( modelViewTransform, {
        category: 'C',
        position: modelViewTransform.getGroundPosition( -180, 270 )
      } )
    ];

    // unlink is not necessary.
    generationClock.percentTimeProperty.lazyLink( ( currentPercentTime, previousPercentTime ) => {

      // Execute this code only when the sim is running normally, not when setting PhET-iO state.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // Starve some bunnies at the midpoint of their 'slice' of the generation clock.
        // See https://github.com/phetsims/natural-selection/issues/110
        if ( this.enabledProperty.value &&
             previousPercentTime < CLOCK_FOOD_MIDPOINT && currentPercentTime >= CLOCK_FOOD_MIDPOINT ) {
          this.starveBunnies();
        }
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    this.isToughProperty.reset();
    this.isLimitedProperty.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Starves some portion of the bunny population.
   * @private
   */
  starveBunnies() {
    assert && assert( this.enabledProperty.value, 'Food is not enabled' );

    // Get the bunnies that are candidates for natural selection, in random order.
    const bunnies = this.bunnyCollection.getSelectionCandidates();

    if ( bunnies.length > 0 ) {

      // {Bunny[]} array for each phenotype
      const bunniesShortTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasShortTeeth() );
      const numberShortTeeth = bunniesShortTeeth.length;
      const bunniesLongTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasLongTeeth() );
      const numberLongTeeth = bunniesLongTeeth.length;
      phet.log && phet.log( 'Applying food: ' +
                            `${numberShortTeeth} short teeth, ${numberLongTeeth} long teeth, ` +
                            `limited=${this.isLimitedProperty.value}, tough=${this.isToughProperty.value}` );

      // {number} percentage [0,1] of bunnies to starve for each phenotype, computed below
      let percentToStarveLongTeeth = 0;
      let percentToStarveShortTeeth = 0;

      // Apply tough food. Tough food starves some of each type of bunny, but starves a higher percentage of bunnies with
      // short teeth. Tough food has no affect on bunnies with long teeth when their population is below a threshold.
      // See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
      if ( this.isToughProperty.value ) {
        const percentToStarve = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.toughFoodPercentToKill );
        percentToStarveShortTeeth = percentToStarve * NaturalSelectionQueryParameters.shortTeethMultiplier;
        percentToStarveLongTeeth = percentToStarve;
        if ( numberLongTeeth < TOUGH_FOOD_MIN_LONG_TEETH ) {
          phet.log && phet.log( `Ignoring tough food for long teeth because their count is < ${TOUGH_FOOD_MIN_LONG_TEETH}.` );
          percentToStarveLongTeeth = 0;
        }
      }

      // Apply limited food. If the population is below some threshold, limited food has no affect, because a small
      // population can be sustained on limited food. See https://github.com/phetsims/natural-selection/issues/153
      if ( this.isLimitedProperty.value ) {
        if ( bunnies.length < LIMITED_FOOD_MIN_TOTAL ) {
          phet.log && phet.log( `Ignoring limited food because the total population is < ${LIMITED_FOOD_MIN_TOTAL}` );
        }
        else {
          if ( this.isToughProperty.value ) {

            // If limited food is combined with tough food, apply a multiplier.
            percentToStarveShortTeeth *= NaturalSelectionQueryParameters.limitedFoodMultiplier;
            percentToStarveLongTeeth *= NaturalSelectionQueryParameters.limitedFoodMultiplier;
          }
          else {

            // If limited food is applied without tough food, starve a percentage of all bunnies, regardless of phenotype.
            const percentToStarve = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.limitedFoodPercentToKill );
            percentToStarveShortTeeth = percentToStarve;
            percentToStarveLongTeeth = percentToStarve;
          }
        }
      }

      // Starve bunnies with short teeth.
      const numberStarvedShortTeeth = starveSomeBunnies( bunniesShortTeeth, percentToStarveShortTeeth );
      phet.log && phet.log( `${numberStarvedShortTeeth} of ${numberShortTeeth} short teeth died of starvation` );

      // Starve bunnies with long teeth.
      const numberStarvedLongTeeth = starveSomeBunnies( bunniesLongTeeth, percentToStarveLongTeeth );
      phet.log && phet.log( `${numberStarvedLongTeeth} of ${numberLongTeeth} long teeth died of starvation` );

      // Notify if bunnies have been starved.
      if ( numberStarvedShortTeeth + numberStarvedLongTeeth > 0 ) {
        this.bunniesStarvedEmitter.emit();
      }
    }
  }
}

/**
 * Starves a percentage of some set of bunnies.
 * @param {Bunny[]} bunnies - a set of bunnies, all with the same phenotype
 * @param {number} percentToStarve - the percentage of bunnies to starve
 * @returns {number} the number of bunnies that were starved
 */
function starveSomeBunnies( bunnies, percentToStarve ) {

  assert && assert( Array.isArray( bunnies ), 'invalid bunnies' );
  assert && assert( NaturalSelectionUtils.isPercent( percentToStarve ), `invalid percentToStarve: ${percentToStarve}` );

  let numberToStarve = 0;

  if ( bunnies.length > 0 && percentToStarve > 0 ) {

    // Starve at least 1 bunny, if we've gotten this far.
    numberToStarve = Math.max( 1, Utils.roundSymmetric( percentToStarve * bunnies.length ) );
    for ( let i = 0; i < numberToStarve; i++ ) {
      bunnies[ i ].die();
    }
  }

  return numberToStarve;
}

naturalSelection.register( 'Food', Food );
export default Food;