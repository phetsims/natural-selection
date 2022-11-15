// Copyright 2019-2022, University of Colorado Boulder

/**
 * WolfCollection is the collection of Wolf instances, with methods for managing that collection.
 * It encapsulates WolfGroup (the PhetioGroup), hiding it from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
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
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bunny from './Bunny.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants

// Wolves are applied at the midpoint of their clock slice.
// See https://github.com/phetsims/natural-selection/issues/110
const CLOCK_WOLVES_MIDPOINT = NaturalSelectionConstants.CLOCK_WOLVES_RANGE.getCenter();

// The minimum number of bunnies whose fur color matches their environment that must exist in order to eat them,
// unless there are no other bunnies to eat.
// See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
// and https://github.com/phetsims/natural-selection/issues/152
const MIN_BUNNIES = 6;

// The minimum number of wolves
const MIN_WOLVES = 5;

// The number of bunnies per wolf. Wolves are created based on the size of the bunny population.
const BUNNIES_PER_WOLF = 10;

export default class WolfCollection {

  private readonly environmentProperty: EnumerationProperty<Environment>;
  private readonly bunnyCollection: BunnyCollection;
  public readonly enabledProperty: Property<boolean>;
  private readonly isHuntingProperty: TReadOnlyProperty<boolean>; // Wolves hunt during the 'wolves' clock slice.
  private readonly wolfGroup: WolfGroup; // PhetioGroup that manages Wolf instances as dynamic PhET-iO elements
  public readonly wolfCreatedEmitter: Emitter<[Wolf]>; // emits when a Wolf has been created
  public readonly bunniesEatenEmitter: Emitter<[number]>; // emits when bunnies have been eaten, param is the generation number

  public constructor( generationClock: GenerationClock, environmentProperty: EnumerationProperty<Environment>,
                      bunnyCollection: BunnyCollection, modelViewTransform: EnvironmentModelViewTransform,
                      tandem: Tandem ) {

    this.environmentProperty = environmentProperty;
    this.bunnyCollection = bunnyCollection;

    this.enabledProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'enabledProperty' )
    } );

    this.isHuntingProperty = new DerivedProperty(
      [ this.enabledProperty, generationClock.timeInPercentProperty ],
      ( enabled, timeInPercent ) => ( enabled && NaturalSelectionConstants.CLOCK_WOLVES_RANGE.contains( timeInPercent ) ), {
        tandem: tandem.createTandem( 'isHuntingProperty' ),
        phetioValueType: BooleanIO,
        phetioDocumentation: 'for internal PhET use only'
      } );

    this.wolfGroup = new WolfGroup( modelViewTransform, {
      tandem: tandem.createTandem( 'wolfGroup' )
    } );

    this.wolfCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Wolf } ]
    } );

    // When the group creates a Wolf, notify listeners. removeListener is not necessary.
    this.wolfGroup.elementCreatedEmitter.addListener( wolf => {
      this.wolfCreatedEmitter.emit( wolf );
    } );

    this.bunniesEatenEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ] // generation number
    } );

    // The wolf population exists only while it's hunting. unlink is not necessary.
    this.isHuntingProperty.link( isHunting => {

      // When the isHuntingProperty changes during normal simulation use, it creates or disposes Wolf instances.
      // However, when setting PhET-iO state, isHuntingProperty and Wolf instances are restored, so executing
      // this code would result in duplicate wolves. See https://github.com/phetsims/natural-selection/issues/117
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        if ( isHunting ) {

          // Number of wolves is a function of the number of live bunnies
          const numberOfWolves = Math.max( MIN_WOLVES,
            Utils.roundSymmetric( this.bunnyCollection.getNumberOfLiveBunnies() / BUNNIES_PER_WOLF ) );
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

    // unlink is not necessary.
    generationClock.timeInPercentProperty.lazyLink( ( currentTimeInPercent, previousTimeInPercent ) => {

      // Execute this code only when the sim is running normally, not when setting PhET-iO state.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // Eat bunnies at the midpoint of their clock slice.
        // See https://github.com/phetsims/natural-selection/issues/110
        if ( this.enabledProperty.value &&
             previousTimeInPercent < CLOCK_WOLVES_MIDPOINT && currentTimeInPercent >= CLOCK_WOLVES_MIDPOINT ) {

          // Ensure that 'eat' event is always recorded at the same time in the clock cycle, regardless of what
          // the actual time is. See https://github.com/phetsims/natural-selection/issues/170.
          const timeInGenerations = generationClock.clockGenerationProperty.value + CLOCK_WOLVES_MIDPOINT;
          this.eatBunnies( timeInGenerations );
        }
      }
    } );
  }

  public reset(): void {
    this.wolfGroup.clear(); // calls dispose for all Wolf instances
    this.enabledProperty.reset();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Gets the number of wolves.
   */
  public get count(): number {
    return this.wolfGroup.countProperty.value;
  }

  /**
   * Moves all wolves.
   * @param dt - time step, in seconds
   */
  public moveWolves( dt: number ): void {
    this.wolfGroup.forEach( wolf => wolf.move( dt ) );
  }

  /**
   * Eats some portion of the bunny population. See the 'Wolves' section of model.md at
   * https://github.com/phetsims/natural-selection/blob/master/doc/model.md#wolves
   * @param timeInGenerations - the time (in generations) at which this event should be recorded
   */
  private eatBunnies( timeInGenerations: number ): void {
    assert && assert( this.enabledProperty.value, 'Wolves are not enabled' );
    assert && assert( timeInGenerations >= 0, `invalid timeInGenerations: ${timeInGenerations}` );

    // Get the bunnies that are candidates for selection by environmental factors, in random order.
    const bunnies = this.bunnyCollection.getSelectionCandidates();
    const totalBunnies = bunnies.length;

    if ( totalBunnies > 0 ) {

      // {Bunny[]} array for each phenotype
      const whiteBunnies = _.filter( bunnies, bunny => bunny.phenotype.hasWhiteFur() );
      const whiteCount = whiteBunnies.length;
      const brownBunnies = _.filter( bunnies, bunny => bunny.phenotype.hasBrownFur() );
      const brownCount = brownBunnies.length;
      phet.log && phet.log( `Applying wolves: ${whiteCount} white, ${brownCount} brown, environment=${this.environmentProperty.value}` );

      // Eat some of each phenotype, but eat more of the bunnies whose fur color does not match the environment.
      const percentToEat = dotRandom.nextDoubleInRange( NaturalSelectionQueryParameters.wolvesPercentToEatRange );
      phet.log && phet.log( `randomly selected ${percentToEat} from wolvesPercentToEatRange` );
      const percentToEatMatch = percentToEat;
      const percentToEatNoMatch = percentToEat * NaturalSelectionQueryParameters.wolvesEnvironmentMultiplier;

      // Eat white bunnies.
      const numberEatenWhite = eatSomeBunnies( whiteBunnies, totalBunnies,
        this.environmentProperty.value, Environment.ARCTIC, percentToEatMatch, percentToEatNoMatch );
      phet.log && phet.log( `${numberEatenWhite} of ${whiteCount} white bunnies were eaten by wolves` );

      // Eat brown bunnies.
      const numberEatenBrown = eatSomeBunnies( brownBunnies, totalBunnies,
        this.environmentProperty.value, Environment.EQUATOR, percentToEatMatch, percentToEatNoMatch );
      phet.log && phet.log( `${numberEatenBrown} of ${brownCount} brown bunnies were eaten by wolves` );

      // Notify if bunnies have been eaten.
      if ( numberEatenWhite + numberEatenBrown > 0 ) {
        this.bunniesEatenEmitter.emit( timeInGenerations );
      }
    }
  }
}

/**
 * Eats a percentage of some set of bunnies, depending on whether their fur color matches the environment.
 * @param bunnies - a set of bunnies, all with the same phenotype
 * @param totalBunnies - the total number of live bunnies
 * @param environment - the current environment that is selected
 * @param environmentMatch - the environment that matches the set of bunnies' fur color
 * @param percentToEatMatch - the percentage of bunnies to eat if fur color matches the environment
 * @param percentToEatNoMatch - the percentage of bunnies to eat if fur color does NOT match the environment
 * @returns the number of bunnies that were eaten
 */
function eatSomeBunnies( bunnies: Bunny[], totalBunnies: number, environment: Environment, environmentMatch: Environment,
                         percentToEatMatch: number, percentToEatNoMatch: number ): number {

  assert && assert( Array.isArray( bunnies ), 'invalid bunnies' );
  assert && assert( NaturalSelectionUtils.isNonNegativeInteger( totalBunnies ), `invalid totalBunnies: ${totalBunnies}` );
  assert && assert( Environment.enumeration.includes( environment ), 'invalid environment' );
  assert && assert( Environment.enumeration.includes( environmentMatch ), 'invalid environmentMatch' );
  assert && assert( NaturalSelectionUtils.isPercent( percentToEatMatch ), `invalid percentToEatMatch: ${percentToEatMatch}` );
  assert && assert( NaturalSelectionUtils.isPercent( percentToEatNoMatch ), `invalid percentToEatNoMatch: ${percentToEatNoMatch}` );

  const percentToEat = ( environment === environmentMatch ) ? percentToEatMatch : percentToEatNoMatch;
  let numberToEat = 0;

  if ( bunnies.length > 0 && percentToEat > 0 ) {

    if ( ( environmentMatch === environment ) && ( bunnies.length < MIN_BUNNIES ) && ( totalBunnies > bunnies.length ) ) {

      // Do nothing. The population whose fur color matches their environment is too small, and there are other bunnies to eat.

      // Get fur color names for log messages. Assumes that all bunnies have the same fur phenotype.
      const bunny0 = bunnies[ 0 ];
      const thisFurColor = bunny0.phenotype.hasBrownFur() ? 'brown' : 'white';
      const otherFurColor = bunny0.phenotype.hasBrownFur() ? 'white' : 'brown';
      phet.log && phet.log( `Wolves ignored ${thisFurColor} bunnies because their count is < ${MIN_BUNNIES} ` +
                            `and there are ${otherFurColor} bunnies to eat` );
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