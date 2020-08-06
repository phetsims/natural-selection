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
import BunnyCollection from './BunnyCollection.js';
import CauseOfDeath from './CauseOfDeath.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenerationClock from './GenerationClock.js';
import Shrub from './Shrub.js';

// constants
const CLOCK_FOOD_MIDPOINT = NaturalSelectionConstants.CLOCK_FOOD_RANGE.getCenter();

// The minimum population size required for limited food to be a factor,
// see https://github.com/phetsims/natural-selection/issues/153
const MIN_POPULATION_FOR_LIMITED_FOOD = 7;

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

    // @public emits when bunnies have been starved to death. dispose is not necessary.
    this.bunniesStarvedEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ] // the number of bunnies that were starved to death
    } );

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

    // Starve some bunnies at the midpoint of CLOCK_FOOD_RANGE.
    // See https://github.com/phetsims/natural-selection/issues/110
    // unlink is not necessary.
    generationClock.percentTimeProperty.lazyLink( ( currentPercentTime, previousPercentTime ) => {

      // Execute this code only when the sim is running normally, not when setting PhET-iO state.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value &&
           this.enabledProperty.value &&
           previousPercentTime < CLOCK_FOOD_MIDPOINT && currentPercentTime >= CLOCK_FOOD_MIDPOINT ) {
        this.starveBunnies( bunnyCollection.getSelectionCandidates() );
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
   * @param {Bunny[]} bunnies - a list of bunnies, already in a random order
   * @private
   */
  starveBunnies( bunnies ) {
    assert && assert( Array.isArray( bunnies ), 'invalid bunnies' );
    assert && assert( this.enabledProperty.value, 'should not be called if not enabled' );
    phet.log && phet.log( `Applying food, limited=${this.isLimitedProperty.value}, tough=${this.isToughProperty.value}` );

    if ( bunnies.length > 0 && ( this.isLimitedProperty.value || this.isToughProperty.value ) ) {

      let totalStarved = 0;

      // Compute the percentage of bunnies to starve for each phenotype.
      let percentToStarveLongTeeth = 0;
      let percentToStarveShortTeeth = 0;

      // Apply tough food.
      // Tough food starves some of each type of bunny, but starves a higher percentage of bunnies with short teeth.
      if ( this.isToughProperty.value ) {
        const percentToStarve = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.toughFoodPercentToKill );
        percentToStarveLongTeeth = percentToStarve;
        percentToStarveShortTeeth = percentToStarve * NaturalSelectionQueryParameters.shortTeethMultiplier;
      }

      // Apply limited food if the population is greater than some minimum size.
      if ( this.isLimitedProperty.value ) {
        if ( bunnies.length >= MIN_POPULATION_FOR_LIMITED_FOOD ) {
          if ( this.isToughProperty.value ) {

            // If limited food is combined with tough food, apply a multiplier.
            percentToStarveLongTeeth *= NaturalSelectionQueryParameters.limitedFoodMultiplier;
            percentToStarveShortTeeth *= NaturalSelectionQueryParameters.limitedFoodMultiplier;
          }
          else {

            // If limited food is applied without tough food, starve a percentage of all bunnies, regardless of phenotype.
            const percentToStarve = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.limitedFoodPercentToKill );
            percentToStarveLongTeeth = percentToStarve;
            percentToStarveShortTeeth = percentToStarve;
          }
        }
        else {
          phet.log && phet.log( `limited food is not a factor because population is < ${MIN_POPULATION_FOR_LIMITED_FOOD}` );
        }
      }

      assert && assert( percentToStarveLongTeeth >= 0 && percentToStarveLongTeeth <= 1,
        `invalid percentToStarveLongTeeth: ${percentToStarveLongTeeth}` );
      assert && assert( percentToStarveShortTeeth >= 0 && percentToStarveShortTeeth <= 1,
        `invalid percentToStarveShortTeeth: ${percentToStarveShortTeeth}` );

      // Compute cause of death
      let causeOfDeath = null;
      if ( this.isToughProperty.value && this.isLimitedProperty.value ) {
        causeOfDeath = CauseOfDeath.TOUGH_LIMITED_FOOD;
      }
      else if ( this.isToughProperty.value ) {
        causeOfDeath = CauseOfDeath.TOUGH_FOOD;
      }
      else {
        assert && assert( this.isLimitedProperty.value, 'logic error' );
        causeOfDeath = CauseOfDeath.LIMITED_FOOD;
      }

      // Starve bunnies with long teeth.
      if ( percentToStarveLongTeeth > 0 ) {
        const bunniesLongTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasLongTeeth() );
        const numberLongTeeth = bunniesLongTeeth.length;
        if ( numberLongTeeth > 0 ) {
          if ( numberLongTeeth <= NaturalSelectionQueryParameters.minBunniesForFood ) {

            // Do nothing because the population with the preferred trait is too small.
            // See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
            phet.log && phet.log( `No bunnies with long teeth were starved because the population is <= ${NaturalSelectionQueryParameters.minBunniesForFood}.` );
          }
          else {

            // Starve at least 1 bunny, if we've gotten this far.
            const numberToStarveLongTeeth = Math.max( 1, Utils.roundSymmetric( percentToStarveLongTeeth * numberLongTeeth ) );
            assert && assert( numberToStarveLongTeeth <= numberLongTeeth, 'invalid numberToStarveLongTeeth' );
            for ( let i = 0; i < numberToStarveLongTeeth; i++ ) {
              bunniesLongTeeth[ i ].die( causeOfDeath );
            }
            totalStarved += numberToStarveLongTeeth;
            phet.log && phet.log( `${numberToStarveLongTeeth} of ${numberLongTeeth} bunnies with long teeth died of starvation` );
          }
        }
      }

      // Starve bunnies with short teeth.
      if ( percentToStarveShortTeeth > 0 ) {
        const bunniesShortTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasShortTeeth() );
        const numberShortTeeth = bunniesShortTeeth.length;
        if ( numberShortTeeth > 0 ) {

          // Starve at least 1 bunny, if we've gotten this far.
          const numberToStarveShortTeeth = Math.max( 1, Utils.roundSymmetric( percentToStarveShortTeeth * numberShortTeeth ) );
          assert && assert( numberToStarveShortTeeth <= numberShortTeeth, 'invalid numberToStarveShortTeeth' );
          for ( let i = 0; i < numberToStarveShortTeeth; i++ ) {
            bunniesShortTeeth[ i ].die( causeOfDeath );
          }
          totalStarved += numberToStarveShortTeeth;
          phet.log && phet.log( `${numberToStarveShortTeeth} of ${numberShortTeeth} bunnies with short teeth died of starvation` );
        }
      }

      // Notify that bunnies have been starved to death.
      if ( totalStarved > 0 ) {
        this.bunniesStarvedEmitter.emit( totalStarved );
      }
    }
  }
}

naturalSelection.register( 'Food', Food );
export default Food;