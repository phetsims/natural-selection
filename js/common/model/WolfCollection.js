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
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import BunnyCollection from './BunnyCollection.js';
import CauseOfDeath from './CauseOfDeath.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenerationClock from './GenerationClock.js';
import Wolf from './Wolf.js';
import WolfGroup from './WolfGroup.js';

// constants
const CLOCK_WOLVES_MIN = NaturalSelectionConstants.CLOCK_WOLVES_RANGE.min;
const CLOCK_WOLVES_MAX = NaturalSelectionConstants.CLOCK_WOLVES_RANGE.max;
const CLOCK_WOLVES_MIDPOINT =
  NaturalSelectionConstants.CLOCK_WOLVES_RANGE.min + NaturalSelectionConstants.CLOCK_WOLVES_RANGE.getLength() / 2;

// Wolves will kill at least this percentage of the bunnies, regardless of their fur color.
const WOLVES_PERCENT_TO_EAT_RANGE = new Range(
  NaturalSelectionQueryParameters.wolvesPercentToKill[ 0 ],
  NaturalSelectionQueryParameters.wolvesPercentToKill[ 1 ]
);

// Multiplier for when the bunny's fur color does not match the environment, applied to the value that is
// randomly chosen from WOLVES_PERCENT_TO_EAT_RANGE.
const WOLVES_ENVIRONMENT_MULTIPLIER = NaturalSelectionQueryParameters.wolvesEnvironmentMultiplier;

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
    this.bunnyCollection = bunnyCollection;

    // @public
    this.enabledProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'enabledProperty' )
    } );

    // @public
    assert && assert( !this.visibleProperty, 'attempt to redefine visibleProperty' );
    this.visibleProperty = new DerivedProperty(
      [ this.enabledProperty, generationClock.percentTimeProperty ],
      ( enabled, percentTime ) => ( enabled && percentTime >= CLOCK_WOLVES_MIN && percentTime <= CLOCK_WOLVES_MAX ), {
        tandem: options.tandem.createTandem( 'visibleProperty' ),
        phetioType: DerivedPropertyIO( BooleanIO )
      } );

    // @private the PhetioGroup that manages Wolf instances as dynamic PhET-iO elements
    this.wolfGroup = new WolfGroup( modelViewTransform, this.visibleProperty, {
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
    this.bunniesEatenEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ] // the number of bunnies that were eaten
    } );

    // When wolves are made visible, adjust the population to match the number of bunnies.
    this.visibleProperty.link( visible => visible && this.adjustPopulation() );

    // Eat bunnies at the midpoint of CLOCK_WOLVES_RANGE.
    // See https://github.com/phetsims/natural-selection/issues/110
    // unlink is not necessary.
    generationClock.percentTimeProperty.lazyLink( ( currentPercentTime, previousPercentTime ) => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value && this.enabledProperty.value &&
           previousPercentTime < CLOCK_WOLVES_MIDPOINT && currentPercentTime >= CLOCK_WOLVES_MIDPOINT ) {
        this.eatBunnies( environmentProperty.value );
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
    return this.wolfGroup.count;
  }

  /**
   * Adjusts the wolf population to match the number of live bunnies.
   * @private
   */
  adjustPopulation() {

    // Number of wolves is a function of the number of live bunnies
    const numberOfWolves = Math.max( NaturalSelectionQueryParameters.minWolves,
      Utils.roundSymmetric( this.bunnyCollection.liveBunnies.length / NaturalSelectionQueryParameters.bunniesPerWolf ) );

    const delta = numberOfWolves - this.wolfGroup.count;
    if ( delta > 0 ) {

      // create more wolves
      for ( let i = 0; i < delta; i++ ) {
        this.wolfGroup.createNextElement();
      }
      phet.log && phet.log( `${delta} wolves were created` );
    }
    else if ( delta < 0 ) {

      // dispose of some wolves
      for ( let i = 0; i < Math.abs( delta ); i++ ) {
        this.wolfGroup.disposeElement( this.wolfGroup.getElement( this.wolfGroup.count - 1 ) );
      }
      phet.log && phet.log( `${delta} wolves were disposed` );
    }
  }

  /**
   * Moves all wolves.
   * @public
   */
   moveWolves() {
     if ( this.visibleProperty.value ) {
       this.wolfGroup.forEach( wolf => wolf.move() );
     }
  }

  /**
   * Eats some portion of the bunny population.
   * @param {Environment} environment
   * @private
   */
  eatBunnies( environment ) {
    assert && assert( Environment.includes( environment ), 'invalid environment' );
    assert && assert( this.enabledProperty.value, 'should not be called when disabled' );

    // Get the bunnies that are candidates for natural selection, in random order.
    const bunnies = this.bunnyCollection.getSelectionCandidates();

    if ( bunnies.length > 0  ) {

      let totalEaten = 0;

      // Eat off some of each type of bunny, but a higher percentage of bunnies that don't blend into the environment.
      const percentToEatMatch = phet.joist.random.nextInRange( WOLVES_PERCENT_TO_EAT_RANGE );
      assert && assert( percentToEatMatch > 0 && percentToEatMatch < 1, `invalid percentToEatMatch: ${percentToEatMatch}` );
      const percentToEatNoMatch = WOLVES_ENVIRONMENT_MULTIPLIER * percentToEatMatch;
      assert && assert( percentToEatNoMatch > 0 && percentToEatNoMatch < 1, `invalid percentToEatNoMatch: ${percentToEatNoMatch}` );

      // Eat bunnies with white fur.
      const bunniesWhiteFur = _.filter( bunnies, bunny => bunny.phenotype.hasWhiteFur() );
      if ( environment === Environment.ARCTIC && bunniesWhiteFur.length <= NaturalSelectionQueryParameters.minBunniesForWolves ) {

        // Do nothing because the population with the preferred trait is too small.
        // See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
        phet.log && phet.log( `Wolves ignored white bunnies because the population is <= ${NaturalSelectionQueryParameters.minBunniesForWolves}` );
      }
      else {
        const percentToEatWhiteFur = ( environment === Environment.ARCTIC ) ? percentToEatMatch : percentToEatNoMatch;
        const numberToEatWhiteFur = Math.ceil( percentToEatWhiteFur * bunniesWhiteFur.length );
        assert && assert( numberToEatWhiteFur <= bunniesWhiteFur.length, 'invalid numberToEatWhiteFur' );
        for ( let i = 0; i < numberToEatWhiteFur; i++ ) {
          bunniesWhiteFur[ i ].die( CauseOfDeath.WOLF );
        }
        totalEaten += numberToEatWhiteFur;
        phet.log && phet.log( `${numberToEatWhiteFur} bunnies with white fur were eaten by wolves` );
      }

      // Eat bunnies with brown fur.
      const bunniesBrownFur = _.filter( bunnies, bunny => bunny.phenotype.hasBrownFur() );
      if ( environment === Environment.EQUATOR && bunniesBrownFur.length <= NaturalSelectionQueryParameters.minBunniesForWolves ) {

        // Do nothing because the population with the preferred trait is too small.
        // See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
        phet.log && phet.log( `Wolves ignored brown bunnies because the population is <= ${NaturalSelectionQueryParameters.minBunniesForWolves}.` );
      }
      else {
        const percentToEatBrownFur = ( environment === Environment.EQUATOR ) ? percentToEatMatch : percentToEatNoMatch;
        const numberToEatBrownFur = Math.ceil( percentToEatBrownFur * bunniesBrownFur.length );
        assert && assert( numberToEatBrownFur <= bunniesBrownFur.length, 'invalid numberToEatBrownFur' );
        for ( let i = 0; i < numberToEatBrownFur; i++ ) {
          bunniesBrownFur[ i ].die( CauseOfDeath.WOLF );
        }
        totalEaten += numberToEatBrownFur;
        phet.log && phet.log( `${numberToEatBrownFur} bunnies with brown fur were eaten by wolves` );
      }

      // Notify that bunnies have been eaten.
      if ( totalEaten > 0 ) {
        this.bunniesEatenEmitter.emit( totalEaten );
      }
    }
  }
}

naturalSelection.register( 'WolfCollection', WolfCollection );
export default WolfCollection;