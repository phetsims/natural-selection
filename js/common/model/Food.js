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
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        const midPoint = NaturalSelectionConstants.CLOCK_FOOD_RANGE.getCenter();
        if ( previousPercentTime < midPoint && currentPercentTime >= midPoint ) {
          this.starveBunnies( bunnyCollection.getSelectionCandidates() );
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
   * @param {Bunny[]} bunnies - a list of bunnies, already in a random order
   * @private
   */
  starveBunnies( bunnies ) {
    assert && assert( Array.isArray( bunnies ), 'invalid bunnies' );
    phet.log && phet.log( 'attempting to starve bunnies' );

    if ( bunnies.length > 0 && ( this.isLimitedProperty.value || this.isToughProperty.value ) ) {

      let totalStarved = 0;

      // Compute the percentage of bunnies to starve based on their phenotype.
      let percentToStarveLongTeeth = 0;
      let percentToStarveShortTeeth = 0;
      if ( this.isToughProperty.value ) {

        // Starve some of each type of bunny, but a higher percentage of bunnies with short teeth.
        percentToStarveLongTeeth = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.toughFoodPercentToKill );
        if ( this.isLimitedProperty.value ) {
          percentToStarveLongTeeth *= NaturalSelectionQueryParameters.limitedFoodMultiplier;
        }
        percentToStarveShortTeeth = NaturalSelectionQueryParameters.shortTeethMultiplier * percentToStarveLongTeeth;
      }
      else {
        assert && assert( this.isLimitedProperty.value, 'logic error' );

        // Starve a percentage of all bunnies, regardless of their Teeth genes.
        percentToStarveLongTeeth = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.limitedFoodPercentToKill );
        percentToStarveShortTeeth = percentToStarveLongTeeth;
      }
      assert && assert( percentToStarveLongTeeth > 0 && percentToStarveLongTeeth < 1,
        `invalid percentToStarveLongTeeth: ${percentToStarveLongTeeth}` );
      assert && assert( percentToStarveShortTeeth > 0 && percentToStarveShortTeeth < 1,
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
      const bunniesLongTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasLongTeeth() );
      if ( bunniesLongTeeth.length <= NaturalSelectionQueryParameters.minBunniesForFood ) {

        // Do nothing because the population with the preferred trait is too small.
        // See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
        phet.log && phet.log( `No bunnies with long teeth were starved because the population is <= ${NaturalSelectionQueryParameters.minBunniesForFood}.` );
      }
      else {
        const numberToStarveLongTeeth = Math.ceil( percentToStarveLongTeeth * bunniesLongTeeth.length );
        assert && assert( numberToStarveLongTeeth <= bunniesLongTeeth.length, 'invalid numberToStarveLongTeeth' );
        for ( let i = 0; i < numberToStarveLongTeeth; i++ ) {
          bunniesLongTeeth[ i ].die( causeOfDeath );
        }
        phet.log && phet.log( `${numberToStarveLongTeeth} bunnies with long teeth died of starvation` );
        totalStarved += numberToStarveLongTeeth;
      }

      // Starve bunnies with short teeth.
      const bunniesShortTeeth = _.filter( bunnies, bunny => bunny.phenotype.hasShortTeeth() );
      const numberToStarveShortTeeth = Math.ceil( percentToStarveShortTeeth * bunniesShortTeeth.length );
      assert && assert( numberToStarveShortTeeth <= bunniesShortTeeth.length, 'invalid numberToStarveShortTeeth' );
      for ( let i = 0; i < numberToStarveShortTeeth; i++ ) {
        bunniesShortTeeth[ i ].die( causeOfDeath );
      }
      phet.log && phet.log( `${numberToStarveShortTeeth} bunnies with short teeth died of starvation` );
      totalStarved += numberToStarveShortTeeth;

      // Notify that bunnies have been starved to death.
      if ( totalStarved > 0 ) {
        this.bunniesStarvedEmitter.emit( totalStarved );
      }
    }
  }
}

naturalSelection.register( 'Food', Food );
export default Food;