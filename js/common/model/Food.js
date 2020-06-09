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
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import shrubTenderAImage from '../../../images/shrub-tender-A_png.js';
import shrubTenderBImage from '../../../images/shrub-tender-B_png.js';
import shrubTenderCImage from '../../../images/shrub-tender-C_png.js';
import shrubToughAImage from '../../../images/shrub-tough-A_png.js';
import shrubToughBImage from '../../../images/shrub-tough-B_png.js';
import shrubToughCImage from '../../../images/shrub-tough-C_png.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import CauseOfDeath from './CauseOfDeath.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenerationClock from './GenerationClock.js';
import Shrub from './Shrub.js';

// constants

// Limited tender food will cause this percentage of bunnies to die of starvation, regardless of their teeth genes.
const LIMITED_FOOD_PERCENT_TO_KILL = new Range(
  NaturalSelectionQueryParameters.limitedFoodPercentToKill[ 0 ],
  NaturalSelectionQueryParameters.limitedFoodPercentToKill[ 1 ]
);

// Tough unlimited food will cause this percentage of bunnies to die of starvation, regardless of their teeth genes.
const TOUGH_FOOD_PERCENT_TO_KILL = new Range(
  NaturalSelectionQueryParameters.toughFoodPercentToKill[ 0 ],
  NaturalSelectionQueryParameters.toughFoodPercentToKill[ 1 ]
);

// Multiplier for when limited food is combined with tough food, applied to TOUGH_FOOD_PERCENT_TO_KILL.
const LIMITED_FOOD_MULTIPLIER = NaturalSelectionQueryParameters.limitedFoodMultiplier;

// Multiplier for bunnies with short teeth when food is tough, applied to TOUGH_FOOD_PERCENT_TO_KILL.
const SHORT_TEETH_MULTIPLIER = NaturalSelectionQueryParameters.shortTeethMultiplier;

class Food {

  /**
   * @param {GenerationClock} generationClock
   *  @param {ObservableArray.<Bunny>} liveBunnies
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( generationClock, liveBunnies, modelViewTransform, options ) {

    assert && assert( generationClock instanceof GenerationClock, 'invalid generationClock' );
    assert && assert( liveBunnies instanceof ObservableArray, 'invalid liveBunnies' );
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

    // @public whether either factor related to food is enabled
    this.enabledProperty = new DerivedProperty(
      [ this.isToughProperty, this.isLimitedProperty ],
      ( isTough, isLimited ) => ( isTough || isLimited )
    );

    // @public emits when bunnies have been starved to death
    this.bunniesStarvedEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ] // the number of bunnies that were starved to death
    } );

    // {ShrubConfig[]} describes the collection of shrubs
    //
    // @typedef ShrubConfig
    // @property {HTMLImageElement} tenderImage - image used for tender shrubs
    // @property {HTMLImageElement} toughImage - image used for tough shrubs
    // @property {number} x - x position in model coordinates
    // @property {number} z - z position in model coordinates
    //
    // A, B, C labeling of images comes from https://github.com/phetsims/natural-selection/issues/17
    const shrubConfigs = [
      { tenderImage: shrubTenderAImage, toughImage: shrubToughAImage, x: -65, z: 210 },
      { tenderImage: shrubTenderAImage, toughImage: shrubToughAImage, x: 155, z: 160 },
      { tenderImage: shrubTenderBImage, toughImage: shrubToughBImage, x: -155, z: 160 },
      { tenderImage: shrubTenderBImage, toughImage: shrubToughBImage, x: 200, z: 250 },
      { tenderImage: shrubTenderCImage, toughImage: shrubToughCImage, x: 60, z: 185 },
      { tenderImage: shrubTenderCImage, toughImage: shrubToughCImage, x: -180, z: 270 }
    ];

    // @public (read-only) {Shrub[]} the collection of Shrubs
    this.shrubs = [];
    shrubConfigs.forEach( shrubConfig => {
      this.shrubs.push( new Shrub( shrubConfig.tenderImage, shrubConfig.toughImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( shrubConfig.x, shrubConfig.z )
      } ) );
    } );

    // When food is limited, hide half of the food (odd-indexed Shrubs)
    assert && assert( this.shrubs.length % 2 === 0, 'an even number of Shrubs is required' );
    this.isLimitedProperty.link( isLimited => {
      for ( let i = 1; i < this.shrubs.length; i = i + 2 ) {
        this.shrubs[ i ].visibleProperty.value = !isLimited;
      }
    } );

    // Starve some bunnies.
    //TODO Temporarily starve all bunnies at once, instead of over CLOCK_FOOD_RANGE
    generationClock.percentTimeProperty.lazyLink( ( currentPercentTime, previousPercentTime ) => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        const foodRangeMin = NaturalSelectionConstants.CLOCK_FOOD_RANGE.min;
        if ( previousPercentTime < foodRangeMin && currentPercentTime >= foodRangeMin ) {
          this.starveBunnies( liveBunnies.getArray() );
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
    assert && assert( false, 'Food does not support dispose' );
  }

  /**
   * Starves some portion of the bunny population.
   * @param {Bunny[]} bunnies
   * @private
   */
  starveBunnies( bunnies ) {
    assert && assert( Array.isArray( bunnies ), 'invalid bunnies' );

    if ( bunnies.length > 0 && ( this.isLimitedProperty.value || this.isToughProperty.value ) ) {

      bunnies = phet.joist.random.shuffle( bunnies );

      let totalStarved = 0;

      if ( this.isToughProperty.value ) {

        // Kill off some of each type of bunny, but a higher percentage of bunnies with short teeth.
        const causeOfDeath = this.isLimitedProperty.value ? CauseOfDeath.TOUGH_LIMITED_FOOD : CauseOfDeath.TOUGH_FOOD;

        // Kill off bunnies with long teeth.
        const bunniesLongTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasLongTeeth() );
        let percentToKillLongTeeth = NaturalSelectionUtils.nextInRange( TOUGH_FOOD_PERCENT_TO_KILL );
        if ( this.isLimitedProperty.value ) {
          percentToKillLongTeeth *= LIMITED_FOOD_MULTIPLIER;
        }
        assert && assert( percentToKillLongTeeth > 0 && percentToKillLongTeeth < 1,
          `invalid percentToKillLongTeeth: ${percentToKillLongTeeth}` );
        const numberToKillLongTeeth = Math.ceil( percentToKillLongTeeth * bunniesLongTeeth.length );
        assert && assert( numberToKillLongTeeth <= bunniesLongTeeth.length, 'invalid numberToKillLongTeeth' );
        for ( let i = 0; i < numberToKillLongTeeth; i++ ) {
          bunniesLongTeeth[ i ].die( causeOfDeath );
        }
        phet.log && phet.log( `${numberToKillLongTeeth} bunnies with long teeth died of starvation` );
        totalStarved += numberToKillLongTeeth;

        // Kill off bunnies with short teeth.
        const bunniesShortTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasShortTeeth() );
        const percentToKillShortTeeth = SHORT_TEETH_MULTIPLIER * percentToKillLongTeeth;
        assert && assert( percentToKillShortTeeth > 0 && percentToKillShortTeeth < 1,
          `invalid percentToKillShortTeeth: ${percentToKillShortTeeth}` );
        const numberToKillShortTeeth = Math.ceil( percentToKillShortTeeth * bunniesShortTeeth.length );
        assert && assert( numberToKillShortTeeth <= bunniesShortTeeth.length, 'invalid numberToKillShortTeeth' );
        for ( let i = 0; i < numberToKillShortTeeth; i++ ) {
          bunniesShortTeeth[ i ].die( causeOfDeath );
        }
        phet.log && phet.log( `${numberToKillShortTeeth} bunnies with short teeth died of starvation` );
        totalStarved += numberToKillShortTeeth;
      }
      else if ( this.isLimitedProperty.value ) {

        // Kill off a percentage of all bunnies, regardless of their Teeth genes.
        const percentToKill = NaturalSelectionUtils.nextInRange( LIMITED_FOOD_PERCENT_TO_KILL );
        assert && assert( percentToKill > 0 && percentToKill < 1, `invalid percentToKill: ${percentToKill}` );
        const numberToKill = Math.ceil( percentToKill * bunnies.length );
        assert && assert( numberToKill <= bunnies.length, 'invalid numberToKill' );
        for ( let i = 0; i < numberToKill; i++ ) {
          bunnies[ i ].die( CauseOfDeath.LIMITED_FOOD );
        }
        phet.log && phet.log( `${numberToKill} bunnies died of starvation` );
        totalStarved += numberToKill;
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