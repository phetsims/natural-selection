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
import Random from '../../../../dot/js/Random.js';
import Range from '../../../../dot/js/Range.js';
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

// The minimum number of bunnies with long teeth required for tough food to be a factor for bunnies with long teeth,
// see https://github.com/phetsims/natural-selection/issues/98
const TOUGH_FOOD_MIN_LONG_TEETH = 5;

// Margins for placing the shrubs from the edges of the model-view transform, in model coordinates
const SHRUBS_X_MARGIN = 20;
const SHRUBS_Z_MARGIN = 5;

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
    this.bunniesStarvedEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ] // generation value at which the event should be recorded
    } );

    // Use our own instance of Random to produce locations for shrubs.
    //TODO https://github.com/phetsims/natural-selection/issues/176 if we want the same locations each time, set a specific seed, and uninstrument shrubs.
    // otherwise replace random with phet.joist.random
    const random = new Random( { seed: phet.joist.random.nextDouble() } );

    const shrubsTandem = options.tandem.createTandem( 'shrubs' );

    // @public (read-only) {Shrub[]} the collection of Shrubs
    // Shrubs are placed randomly in the environment.
    // Sprites are assigned to shrubs via ShrubSpritesMap.getNextTenderSprite and getNextToughSprite.
    this.shrubs = [];
    const zRange = new Range( modelViewTransform.getMinimumZ() + SHRUBS_Z_MARGIN, modelViewTransform.getMaximumZ() - SHRUBS_Z_MARGIN );
    const numberOfShrubs = NaturalSelectionQueryParameters.shrubsRange.max;
    for ( let i = 0; i < numberOfShrubs; i++ ) {
      const z = random.nextDoubleInRange( zRange );
      const xRange = new Range( modelViewTransform.getMinimumX( z ) + SHRUBS_X_MARGIN, modelViewTransform.getMaximumX( z ) - SHRUBS_X_MARGIN );
      const x = random.nextDoubleInRange( xRange );
      this.shrubs.push( new Shrub( modelViewTransform, {
        position: modelViewTransform.getGroundPosition( x, z ),

        //TODO https://github.com/phetsims/natural-selection/issues/176 if we use fixed locations for shrubs, remove instrumentation
        tandem: shrubsTandem.createTandem( `shrub${i}` )
      } ) );
    }
    phet.log && phet.log( `${numberOfShrubs} shrubs randomly placed using seed ${random.getSeed()}` );

    // unlink is not necessary.
    generationClock.timeInPercentProperty.lazyLink( ( currentTimeInPercent, previousTimeInPercent ) => {

      // Execute this code only when the sim is running normally, not when setting PhET-iO state.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // Starve some bunnies at the midpoint of their 'slice' of the generation clock.
        // See https://github.com/phetsims/natural-selection/issues/110
        if ( this.enabledProperty.value &&
             previousTimeInPercent < CLOCK_FOOD_MIDPOINT && currentTimeInPercent >= CLOCK_FOOD_MIDPOINT ) {

          // Ensure that 'starve' event is always recorded at the same time in the clock cycle, regardless of what
          // the actual time is. See https://github.com/phetsims/natural-selection/issues/170.
          const generations = generationClock.currentGenerationProperty.value + CLOCK_FOOD_MIDPOINT;
          this.starveBunnies( generations );
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
   * @param {number} generations - the generations value at which this event should be recorded
   * @private
   */
  starveBunnies( generations ) {
    assert && assert( this.enabledProperty.value, 'Food is not enabled' );
    assert && assert( NaturalSelectionUtils.isNonNegative( generations ), `invalid generations: ${generations}` );

    let totalStarved = 0;
    if ( this.isToughProperty.value ) {
      totalStarved += this.applyToughFood();
    }
    if ( this.isLimitedProperty.value ) {
      totalStarved += this.applyLimitedFood();
    }

    // Notify if bunnies have been starved.
    if ( totalStarved > 0 ) {
      this.bunniesStarvedEmitter.emit( generations );
    }
  }

  /**
   * Applies tough food as a selection factor. Tough food is more difficult to eat, so some of each phenotype will
   * starve. Bunnies with short teeth are less adapted to eating tough food, so a larger percentage of bunnies
   * with short teeth will starve. Tough food has no affect on bunnies with long teeth when their population
   * is below a threshold. See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
   * @returns {number} the number of bunnies that died
   * @private
   */
  applyToughFood() {
    assert && assert( this.isToughProperty.value, 'tough food is not enabled' );

    let totalStarved = 0;

    // Get the bunnies that are candidates for selection by environmental factors, in random order.
    const bunnies = this.bunnyCollection.getSelectionCandidates();

    if ( bunnies.length > 0 ) {

      // {Bunny[]} array for each phenotype
      const bunniesShortTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasShortTeeth() );
      const numberShortTeeth = bunniesShortTeeth.length;
      const bunniesLongTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasLongTeeth() );
      const numberLongTeeth = bunniesLongTeeth.length;
      phet.log && phet.log( `Applying tough food: ${numberShortTeeth} short teeth, ${numberLongTeeth} long teeth` );

      // {number} percentage [0,1] of bunnies to starve for each phenotype, computed below
      let percentToStarveLongTeeth = 0;
      let percentToStarveShortTeeth = 0;

      const percentToStarve = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.toughFoodPercentToStarveRange );
      phet.log && phet.log( `randomly selected ${percentToStarve} from toughFoodPercentToStarveRange` );
      percentToStarveShortTeeth = Math.min( 1, percentToStarve * NaturalSelectionQueryParameters.shortTeethMultiplier );
      percentToStarveLongTeeth = percentToStarve;
      if ( numberLongTeeth < TOUGH_FOOD_MIN_LONG_TEETH ) {
        phet.log && phet.log( `Ignoring tough food for long teeth because their count ${numberLongTeeth} is < ${TOUGH_FOOD_MIN_LONG_TEETH}.` );
        percentToStarveLongTeeth = 0;
      }

      // Starve bunnies with short teeth.
      const numberStarvedShortTeeth = starvePercentage( bunniesShortTeeth, percentToStarveShortTeeth );
      phet.log && phet.log( `${numberStarvedShortTeeth} of ${numberShortTeeth} short teeth died from tough food` );
      totalStarved += numberStarvedShortTeeth;

      // Starve bunnies with long teeth.
      const numberStarvedLongTeeth = starvePercentage( bunniesLongTeeth, percentToStarveLongTeeth );
      phet.log && phet.log( `${numberStarvedLongTeeth} of ${numberLongTeeth} long teeth died from tough food` );
      totalStarved += numberStarvedLongTeeth;
    }

    return totalStarved;
  }

  /**
   * Applies limited food as a selection factor. Limited food can support the population up to a specific carrying
   * capacity. If the population exceeds the carrying capacity, then bunnies will die off to reduce the population
   * to the carrying capacity. See https://github.com/phetsims/natural-selection/issues/183
   * @returns {number} the number of bunnies that died
   * @private
   */
  applyLimitedFood() {
    assert && assert( this.isLimitedProperty.value, 'limited food is not enabled' );

    let totalStarved = 0;

    // Get the bunnies that are candidates for selection by environmental factors, in random order.
    const bunnies = this.bunnyCollection.getSelectionCandidates();
    const totalBunnies = bunnies.length;

    // Randomly choose the number of bunnies that can be supported by limited food.
    const carryingCapacity = Utils.roundSymmetric( phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.limitedFoodPopulationRange ) );

    if ( totalBunnies > 0 ) {
      phet.log && phet.log( `Applying limited food: population is ${totalBunnies}, carrying capacity is ${carryingCapacity}` );

      if ( totalBunnies > carryingCapacity ) {
        const numberToStarve = totalBunnies - carryingCapacity;
        for ( let i = 0; i < numberToStarve; i++ ) {
          bunnies[ i ].die();
        }
        totalStarved = numberToStarve;
        phet.log && phet.log( `Carrying capacity exceeded, ${totalStarved} bunnies died from limited food` );
      }
      else {
        phet.log && phet.log( 'Carrying capacity not exceeded, no bunnies died from limited food.' );
      }
    }

    return totalStarved;
  }
}

/**
 * Starves a percentage of some set of bunnies.
 * @param {Bunny[]} bunnies - a set of bunnies, all with the same phenotype
 * @param {number} percentToStarve - the percentage of bunnies to starve
 * @returns {number} the number of bunnies that died
 */
function starvePercentage( bunnies, percentToStarve ) {

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