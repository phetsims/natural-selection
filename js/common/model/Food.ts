// Copyright 2020-2022, University of Colorado Boulder

/**
 * Food is the model of the food supply, a collection of Shrubs.
 * It controls the type (tender or tough) and quantity of food that is available.
 * See also the 'Food' section of model.md at https://github.com/phetsims/natural-selection/blob/master/doc/model.md#food
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Random from '../../../../dot/js/Random.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import Bunny from './Bunny.js';
import BunnyCollection from './BunnyCollection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenerationClock from './GenerationClock.js';
import Shrub from './Shrub.js';

// Food is applied at the midpoint of its clock slice.
// See https://github.com/phetsims/natural-selection/issues/110
const CLOCK_FOOD_MIDPOINT = NaturalSelectionConstants.CLOCK_FOOD_RANGE.getCenter();

// The minimum number of bunnies with long teeth required for tough food to be a factor for bunnies with long teeth,
// see https://github.com/phetsims/natural-selection/issues/98
const TOUGH_FOOD_MIN_LONG_TEETH = 5;

// Margins for placing the shrubs from the edges of the model-view transform, in model coordinates
const SHRUBS_X_MARGIN = 20;
const SHRUBS_Z_MARGIN = 5;

type SelfOptions = EmptySelfOptions;

type FoodOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Food {

  private readonly bunnyCollection: BunnyCollection;
  public readonly isToughProperty: Property<boolean>;
  public readonly isLimitedProperty: Property<boolean>;

  // whether either factor related to food is enabled
  public readonly enabledProperty: TReadOnlyProperty<boolean>;

  // emits when bunnies have died of starvation, param is the time in generations
  public readonly bunniesStarvedEmitter: Emitter<[number]>;

  // the collection of Shrubs
  public readonly shrubs: Shrub[];

  /**
   * @param generationClock
   * @param bunnyCollection
   * @param modelViewTransform
   * @param shrubsSeed - seed for random number generator used to position shrubs
   * @param providedOptions
   */
  public constructor( generationClock: GenerationClock, bunnyCollection: BunnyCollection,
                      modelViewTransform: EnvironmentModelViewTransform, shrubsSeed: number,
                      providedOptions: FoodOptions ) {

    const options = providedOptions;

    this.bunnyCollection = bunnyCollection;

    this.isToughProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isToughProperty' ),
      phetioDocumentation: 'whether the food supply is tough (true) or tender (false)'
    } );

    this.isLimitedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isLimitedProperty' ),
      phetioDocumentation: 'whether the food supply is limited'
    } );

    this.enabledProperty = new DerivedProperty(
      [ this.isToughProperty, this.isLimitedProperty ],
      ( isTough, isLimited ) => ( isTough || isLimited ), {
        tandem: Tandem.OPT_OUT
      } );

    this.bunniesStarvedEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ] // timeInGenerations at which the event should be recorded
    } );

    // Use our own instance of Random to produce positions for shrubs.
    // See https://github.com/phetsims/natural-selection/issues/176
    const random = new Random( { seed: shrubsSeed } );

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
        position: modelViewTransform.getGroundPosition( x, z )
      } ) );
    }
    phet.log && phet.log( `${numberOfShrubs} shrubs randomly placed using seed ${random.getSeed()}` );

    // unlink is not necessary.
    generationClock.timeInPercentProperty.lazyLink( ( currentTimeInPercent, previousTimeInPercent ) => {

      // Execute this code only when the sim is running normally, not when setting PhET-iO state.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // Starve some bunnies at the midpoint of their clock slice.
        // See https://github.com/phetsims/natural-selection/issues/110
        if ( this.enabledProperty.value &&
             previousTimeInPercent < CLOCK_FOOD_MIDPOINT && currentTimeInPercent >= CLOCK_FOOD_MIDPOINT ) {

          // Ensure that 'starve' event is always recorded at the same time in the clock cycle, regardless of what
          // the actual time is. See https://github.com/phetsims/natural-selection/issues/170.
          const timeInGenerations = generationClock.clockGenerationProperty.value + CLOCK_FOOD_MIDPOINT;
          this.starveBunnies( timeInGenerations );
        }
      }
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.isToughProperty.reset();
    this.isLimitedProperty.reset();
  }

  /**
   * Starves some portion of the bunny population.
   * @param timeInGenerations - the time (in generations) at which this event should be recorded
   */
  private starveBunnies( timeInGenerations: number ): void {
    assert && assert( this.enabledProperty.value, 'Food is not enabled' );
    assert && assert( timeInGenerations >= 0, `invalid timeInGenerations: ${timeInGenerations}` );

    let totalStarved = 0;
    if ( this.isToughProperty.value ) {
      totalStarved += this.applyToughFood();
    }
    if ( this.isLimitedProperty.value ) {
      totalStarved += this.applyLimitedFood();
    }

    // Notify if bunnies have been starved.
    if ( totalStarved > 0 ) {
      this.bunniesStarvedEmitter.emit( timeInGenerations );
    }
  }

  /**
   * Applies tough food as a selection factor. Tough food is more difficult to eat, so some of each phenotype will
   * starve. Bunnies with short teeth are less adapted to eating tough food, so a larger percentage of bunnies
   * with short teeth will starve. Tough food has no affect on bunnies with long teeth when their population
   * is below a threshold. See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
   * See also the 'Tough Food' section of model.md at https://github.com/phetsims/natural-selection/blob/master/doc/model.md#tough-food
   * @returns the number of bunnies that died
   */
  private applyToughFood(): number {
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

      const percentToStarve = dotRandom.nextDoubleInRange( NaturalSelectionQueryParameters.toughFoodPercentToStarveRange );
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
   * See also the 'Limited Food' section of model.md at https://github.com/phetsims/natural-selection/blob/master/doc/model.md#limited-food
   * @returns the number of bunnies that died
   */
  private applyLimitedFood(): number {
    assert && assert( this.isLimitedProperty.value, 'limited food is not enabled' );

    let totalStarved = 0;

    // Get the bunnies that are candidates for selection by environmental factors, in random order.
    const bunnies = this.bunnyCollection.getSelectionCandidates();
    const totalBunnies = bunnies.length;

    // Randomly choose the number of bunnies that can be supported by limited food.
    const carryingCapacity = Utils.roundSymmetric( dotRandom.nextDoubleInRange( NaturalSelectionQueryParameters.limitedFoodPopulationRange ) );

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
 * @param bunnies - a set of bunnies, all with the same phenotype
 * @param percentToStarve - the percentage of bunnies to starve
 * @returns the number of bunnies that died
 */
function starvePercentage( bunnies: Bunny[], percentToStarve: number ): number {

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