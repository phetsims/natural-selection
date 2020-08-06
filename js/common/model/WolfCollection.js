// Copyright 2019-2020, University of Colorado Boulder

/**
 * WolfCollection is the collection of Wolf instances, with methods for managing that collection.
 * It encapsulates WolfGroup (the PhetioGroup), hiding it from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCollection from './BunnyCollection.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenerationClock from './GenerationClock.js';
import Wolf from './Wolf.js';
import WolfGroup from './WolfGroup.js';

// constants
const CLOCK_WOLVES_MIN = NaturalSelectionConstants.CLOCK_WOLVES_RANGE.min;
const CLOCK_WOLVES_MAX = NaturalSelectionConstants.CLOCK_WOLVES_RANGE.max;

// Wolves are applied at the midpoint of its 'slice' of the generation clock.
// See https://github.com/phetsims/natural-selection/issues/110
const CLOCK_WOLVES_MIDPOINT = NaturalSelectionConstants.CLOCK_WOLVES_RANGE.getCenter();

// The minimum number of bunnies that match their environment that must exist in order to eat them, unless there are
// no other bunnies to eat. See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
// and https://github.com/phetsims/natural-selection/issues/152
const MIN_BUNNIES = 6;

// The minimum number of wolves
const MIN_WOLVES = 5;

// The number of bunnies per wolf. Wolves are created based on the size of the bunny population.
// The formula is: numberOfWolves = Math.max( MIN_WOLVES, numberOfBunnies / BUNNIES_PER_WOLF )
const BUNNIES_PER_WOLF = 10;

class WolfCollection {

  /**
   * @param {GenerationClock} generationClock
   * @param {EnumerationProperty.<Environment>} environmentProperty
   * @param {BunnyCollection} bunnyCollection
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( generationClock, environmentProperty, bunnyCollection, modelViewTransform, options ) {

    assert && assert( generationClock instanceof GenerationClock, 'invalid generationClock' );
    assert && AssertUtils.assertEnumerationPropertyOf( environmentProperty, Environment );
    assert && assert( bunnyCollection instanceof BunnyCollection, 'invalid bunnyCollection' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.environmentProperty = environmentProperty;
    this.bunnyCollection = bunnyCollection;

    // @public
    this.enabledProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'enabledProperty' )
    } );

    // @private Wolves hunt during the 'wolves' slice of the generation clock.
    this.isHuntingProperty = new DerivedProperty(
      [ this.enabledProperty, generationClock.percentTimeProperty ],
      ( enabled, percentTime ) => ( enabled && percentTime >= CLOCK_WOLVES_MIN && percentTime <= CLOCK_WOLVES_MAX ), {
        tandem: options.tandem.createTandem( 'isHuntingProperty' ),
        phetioType: DerivedPropertyIO( BooleanIO ),
        phetioDocumentation: 'for internal PhET use only'
      } );

    // @private the PhetioGroup that manages Wolf instances as dynamic PhET-iO elements
    this.wolfGroup = new WolfGroup( modelViewTransform, {
      tandem: options.tandem.createTandem( 'wolfGroup' )
    } );

    // @public notify when a Wolf has been created. dispose is not necessary.
    this.wolfCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Wolf } ]
    } );

    // When the group creates a Wolf, notify listeners. removeListener is not necessary.
    this.wolfGroup.elementCreatedEmitter.addListener( wolf => {
      this.wolfCreatedEmitter.emit( wolf );
    } );

    // @public emits when bunnies have been eaten. dispose is not necessary.
    this.bunniesEatenEmitter = new Emitter();

    // The wolf population exists only while it's hunting.
    this.isHuntingProperty.link( isHunting => {

      // When the isHuntingProperty changes during normal simulation use, it creates or disposes Wolf instances.
      // However, when setting PhET-iO state, isHuntingProperty and Wolf instances are restored, so executing
      // this code would result in duplicate wolves. See https://github.com/phetsims/natural-selection/issues/117
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        if ( isHunting ) {

          // Number of wolves is a function of the number of live bunnies
          const numberOfWolves = Math.max( MIN_WOLVES,
            Utils.roundSymmetric( this.bunnyCollection.liveBunnies.length / BUNNIES_PER_WOLF ) );
          for ( let i = 0; i < numberOfWolves; i++ ) {
            this.wolfGroup.createNextElement();
          }
          phet.log && phet.log( `${this.wolfGroup.count} wolves were created` );
        }
        else {

          // Dispose of all wolves
          phet.log && phet.log( `${this.wolfGroup.count} wolves were disposed` );
          this.wolfGroup.clear();
        }
      }
    } );

    // Eat bunnies at the midpoint of their 'slice' of the generation clock.
    // See https://github.com/phetsims/natural-selection/issues/110
    // unlink is not necessary.
    generationClock.percentTimeProperty.lazyLink( ( currentPercentTime, previousPercentTime ) => {

      // Execute this code only when the sim is running normally, not when setting PhET-iO state.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value &&
           this.enabledProperty.value &&
           previousPercentTime < CLOCK_WOLVES_MIDPOINT && currentPercentTime >= CLOCK_WOLVES_MIDPOINT ) {
        this.eatBunnies();
      }
    } );
  }

  /**
   * Resets the group.
   * @public
   */
  reset() {
    this.wolfGroup.clear(); // calls dispose for all Wolf instances
    this.enabledProperty.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Gets the archetype for the PhetioGroup.
   * @returns {Wolf|null} non-null only during API harvest
   * @public
   */
  getArchetype() {
    return this.wolfGroup.archetype;
  }

  /**
   * Gets the number of wolves.
   * @returns {number}
   * @public
   */
  get count() {
    return this.wolfGroup.countProperty.value;
  }

  /**
   * Moves all wolves.
   * @param {number} dt - time step, in seconds
   * @public
   */
  moveWolves( dt ) {
    this.wolfGroup.forEach( wolf => wolf.move( dt ) );
  }

  /**
   * Eats some portion of the bunny population.
   * @private
   */
  eatBunnies() {
    assert && assert( this.enabledProperty.value, 'should not be called if not enabled' );

    // Get the bunnies that are candidates for natural selection, in random order.
    const bunnies = this.bunnyCollection.getSelectionCandidates();

    if ( bunnies.length > 0 ) {

      // {Bunny[]} array for each phenotype
      const whiteBunnies = _.filter( bunnies, bunny => bunny.phenotype.hasWhiteFur() );
      const whiteCount = whiteBunnies.length;
      const brownBunnies = _.filter( bunnies, bunny => bunny.phenotype.hasBrownFur() );
      const brownCount = brownBunnies.length;
      phet.log && phet.log( `Applying wolves: ${whiteCount} white, ${brownCount} brown, environment=${this.environmentProperty.value}` );

      // Eat some of each phenotype, but a higher percentage of bunnies that don't blend into the environment.
      const percentToEatMatch = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.wolvesPercentToKill );
      const percentToEatNoMatch = percentToEatMatch * NaturalSelectionQueryParameters.wolvesEnvironmentMultiplier;

      // Eat white bunnies.
      const numberEatenWhite = eatSomeBunnies( whiteBunnies, bunnies.length,
        this.environmentProperty.value, Environment.ARCTIC, percentToEatMatch, percentToEatNoMatch );
      phet.log && phet.log( `${numberEatenWhite} of ${whiteCount} white bunnies were eaten by wolves` );

      // Eat brown bunnies.
      const numberEatenBrown = eatSomeBunnies( brownBunnies, bunnies.length,
        this.environmentProperty.value, Environment.EQUATOR, percentToEatMatch, percentToEatNoMatch );
      phet.log && phet.log( `${numberEatenBrown} of ${brownCount} brown bunnies were eaten by wolves` );

      // Notify if bunnies have been eaten.
      if ( numberEatenWhite + numberEatenBrown > 0 ) {
        this.bunniesEatenEmitter.emit();
      }
    }
  }
}

/**
 * Eats a percentage of some set of bunnies, depending on whether their fur color matches the environment.
 * @param {Bunny[]} bunnies - a set of bunnies, all with the same phenotype
 * @param totalBunnies - the total number of bunnies that were eligible for selection, both phenotypes
 * @param {Environment} environment - the current environment that is selected
 * @param {Environment} environmentMatch - the environment that matches the set of bunnies' fur color
 * @param {number} percentToEatMatch - the percentage of bunnies to eat if fur color matches the environment
 * @param percentToEatNoMatch - the percentage of bunnies to eat if fur color does NOT match the environment
 * @returns {number} - the number of bunnies that were eaten
 */
function eatSomeBunnies( bunnies, totalBunnies, environment, environmentMatch, percentToEatMatch, percentToEatNoMatch ) {

  assert && assert( Array.isArray( bunnies ), 'invalid bunnies' );
  assert && assert( NaturalSelectionUtils.isNonNegativeInteger( totalBunnies ), `invalid totalBunnies: ${totalBunnies}` );
  assert && assert( Environment.includes( environment ), 'invalid environment' );
  assert && assert( Environment.includes( environmentMatch ), 'invalid environmentMatch' );
  assert && assert( NaturalSelectionUtils.isPercent( percentToEatMatch ), `invalid percentToEatMatch: ${percentToEatMatch}` );
  assert && assert( NaturalSelectionUtils.isPercent( percentToEatNoMatch ), `invalid percentToEatNoMatch: ${percentToEatNoMatch}` );

  const percentToEat = ( environment === environmentMatch ) ? percentToEatMatch : percentToEatNoMatch;
  let numberToEat = 0;

  if ( bunnies.length > 0 && percentToEat > 0 ) {

    // Assumes that all bunnies have the same fur phenotype
    const bunny0 = bunnies[ 0 ];
    const furColorName = bunny0.phenotype.hasBrownFur() ? 'brown' : 'white'; // for logging
    const otherFurColorName = bunny0.phenotype.hasBrownFur() ? 'white' : 'brown'; // for logging

    if ( ( environmentMatch === environment ) && ( bunnies.length < MIN_BUNNIES ) && ( totalBunnies >= MIN_BUNNIES ) ) {

      // Do nothing. The population whose fur color matches their environment is too small, and there are other bunnies to eat.
      phet.log && phet.log( `Wolves ignored ${furColorName} bunnies because their count is < ${MIN_BUNNIES} ` +
        `and there are ${otherFurColorName} bunnies to eat` );
    }
    else {

      // Eat at least 1 bunny, if we've gotten this far.
      numberToEat = Math.max( 1, Utils.roundSymmetric( percentToEat * bunnies.length ) );
      assert && assert( numberToEat <= bunnies.length, 'invalid numberToEat' );
      for ( let i = 0; i < numberToEat; i++ ) {
        bunnies[ i ].die();
      }
    }
  }

  return numberToEat;
}

naturalSelection.register( 'WolfCollection', WolfCollection );
export default WolfCollection;