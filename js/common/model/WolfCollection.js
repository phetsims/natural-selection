// Copyright 2019-2020, University of Colorado Boulder

/**
 * WolfCollection is the collection of Wolf instances, with methods for managing that collection.
 * It encapsulates WolfGroup (the PhetioGroup), hiding it from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import CauseOfDeath from './CauseOfDeath.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenerationClock from './GenerationClock.js';
import Wolf from './Wolf.js';
import WolfGroup from './WolfGroup.js';

// Wolves will kill at least this percentage of the bunnies, regardless of their fur color.
const WOLVES_PERCENT_TO_KILL_RANGE = new Range(
  NaturalSelectionQueryParameters.wolvesPercentToKill[ 0 ],
  NaturalSelectionQueryParameters.wolvesPercentToKill[ 1 ]
);

// Multiplier for when the bunny's fur color does not match the environment, applied to the value that is
// randomly chosen from WOLVES_PERCENT_TO_KILL_RANGE.
const WOLVES_ENVIRONMENT_MULTIPLIER = NaturalSelectionQueryParameters.wolvesEnvironmentMultiplier;

class WolfCollection {

  /**
   * @param {GenerationClock} generationClock
   * @param {EnumerationProperty.<Environment>} environmentProperty
   * @param {ObservableArray.<Bunny>} liveBunnies
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( generationClock, environmentProperty, liveBunnies, modelViewTransform, options ) {

    assert && assert( generationClock instanceof GenerationClock, 'invalid generationClock' );
    assert && assert( environmentProperty instanceof EnumerationProperty, 'invalid environmentProperty' );
    assert && assert( liveBunnies instanceof ObservableArray, 'invalid liveBunnies' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.liveBunnies = liveBunnies;

    // @private the PhetioGroup that manages Wolf instances as dynamic PhET-iO elements
    this.wolfGroup = new WolfGroup( modelViewTransform, {
      tandem: options.tandem.createTandem( 'wolfGroup' )
    } );

    // @public notify when a Wolf has been created. dispose is not necessary.
    this.wolfCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Wolf } ]
    } );

    // @public
    this.enabledProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'enabledProperty' )
    } );

    // When the group creates a Wolf, notify listeners. removeListener is not necessary.
    this.wolfGroup.elementCreatedEmitter.addListener( wolf => {
      this.wolfCreatedEmitter.emit( wolf );
    } );

    // When disabled, dispose of all wolves. unlink is not necessary.
    this.enabledProperty.lazyLink( enabled => {
      if ( !enabled && this.wolfGroup.count > 0 ) {
        phet.log && phet.log( `Disposing of ${this.wolfGroup.count} wolves` );
        this.wolfGroup.clear();
      }
    } );

    // @public emits when bunnies have been eaten. dispose is not necessary.
    this.bunniesEatenEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ] // the number of bunnies that were eaten
    } );

    // Eat some bunnies. unlink is not necessary.
    //TODO Temporarily eat all bunnies at once, instead of over CLOCK_WOLVES_RANGE
    generationClock.percentTimeProperty.lazyLink( ( currentPercentTime, previousPercentTime ) => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // Part of the generation clock when wolves are active
        const wolvesRangeMin = NaturalSelectionConstants.CLOCK_WOLVES_RANGE.min;
        const wolvesRangeMax = NaturalSelectionConstants.CLOCK_WOLVES_RANGE.max;

        if ( this.enabledProperty.value && previousPercentTime < wolvesRangeMin && currentPercentTime >= wolvesRangeMin ) {

          // Create wolves
          assert && assert( this.wolfGroup.count === 0, 'expected there to be no wolves' );
          const numberOfWolves = Math.max( NaturalSelectionQueryParameters.minWolves,
            Utils.roundSymmetric( liveBunnies.length / NaturalSelectionQueryParameters.bunniesPerWolf ) );
          phet.log && phet.log( `Creating ${numberOfWolves} wolves` );
          for ( let i = 0; i < numberOfWolves; i++ ) {
            this.wolfGroup.createNextElement();
          }

          // Eat bunnies
          this.eatBunnies( environmentProperty.value );
        }
        else if ( currentPercentTime > wolvesRangeMax && this.wolfGroup.count > 0 ) {

          // Dispose of all wolves
          phet.log && phet.log( `Disposing of ${this.wolfGroup.count} wolves` );
          this.wolfGroup.clear();
        }
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
   * Moves all wolves.
   * @public
   */
   moveWolves() {
    this.wolfGroup.forEach( wolf => wolf.move() );
  }

  /**
   * Eats some portion of the bunny population.
   * @param {Environment} environment
   * @private
   */
  eatBunnies( environment ) {
    assert && assert( Environment.includes( environment ), 'invalid environment' );

    if ( this.liveBunnies.length > 0 && this.enabledProperty.value ) {

      // Kill off some of each type of bunny, but a higher percentage of bunnies that don't blend into the environment.
      const bunnies = phet.joist.random.shuffle( this.liveBunnies.getArray() );
      const percentToKillMatch = NaturalSelectionUtils.nextInRange( WOLVES_PERCENT_TO_KILL_RANGE );
      assert && assert( percentToKillMatch > 0 && percentToKillMatch < 1, `invalid percentToKillMatch: ${percentToKillMatch}` );
      const percentToKillNoMatch = WOLVES_ENVIRONMENT_MULTIPLIER * percentToKillMatch;
      assert && assert( percentToKillNoMatch > 0 && percentToKillNoMatch < 1, `invalid percentToKillNoMatch: ${percentToKillNoMatch}` );

      // Kill off bunnies with white fur.
      const bunniesWhiteFur = _.filter( bunnies, bunny => bunny.phenotype.hasWhiteFur() );
      const percentToKillWhiteFur = ( environment === Environment.EQUATOR ) ? percentToKillNoMatch : percentToKillMatch;
      const numberToKillWhiteFur = Math.ceil( percentToKillWhiteFur * bunniesWhiteFur.length );
      assert && assert( numberToKillWhiteFur <= bunniesWhiteFur.length, 'invalid numberToKillWhiteFur' );
      for ( let i = 0; i < numberToKillWhiteFur; i++ ) {
        bunniesWhiteFur[ i ].die( CauseOfDeath.WOLF );
      }
      phet.log && phet.log( `${numberToKillWhiteFur} bunnies with white fur were eaten by wolves` );

      // Kill off bunnies with brown fur.
      const bunniesBrownFur = _.filter( bunnies, bunny => bunny.phenotype.hasBrownFur() );
      const percentToKillBrownFur = ( environment === Environment.EQUATOR ) ? percentToKillMatch : percentToKillNoMatch;
      const numberToKillBrownFur = Math.ceil( percentToKillBrownFur * bunniesBrownFur.length );
      assert && assert( numberToKillBrownFur <= bunniesBrownFur.length, 'invalid numberToKillBrownFur' );
      for ( let i = 0; i < numberToKillBrownFur; i++ ) {
        bunniesBrownFur[ i ].die( CauseOfDeath.WOLF );
      }
      phet.log && phet.log( `${numberToKillBrownFur} bunnies with brown fur were eaten by wolves` );

      // Notify that bunnies have been eaten.
      if ( numberToKillWhiteFur + numberToKillBrownFur > 0 ) {
        this.bunniesEatenEmitter.emit( numberToKillWhiteFur + numberToKillBrownFur );
      }
    }
  }
}

naturalSelection.register( 'WolfCollection', WolfCollection );
export default WolfCollection;