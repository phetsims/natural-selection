// Copyright 2019-2020, University of Colorado Boulder

/**
 * WolfCollection is the collection of Wolf instances, with methods for managing that collection.
 * It encapsulates WolfGroup (the PhetioGroup), hiding it from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import CauseOfDeath from './CauseOfDeath.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Wolf from './Wolf.js';
import WolfGroup from './WolfGroup.js';

// constants
const MIN_WOLVES = NaturalSelectionQueryParameters.minWolves;
const BUNNIES_PER_WOLF = NaturalSelectionQueryParameters.bunniesPerWolf;

// Wolves will kill at least this percentage of the bunnies, regardless of their fur color.
const WOLVES_PERCENT_TO_KILL = new Range(
  NaturalSelectionQueryParameters.wolvesPercentToKill[ 0 ],
  NaturalSelectionQueryParameters.wolvesPercentToKill[ 1 ]
);

// Multiplier for when the bunny's fur color does not match the environment, applied to WOLVES_PERCENT_TO_KILL.
const WOLVES_ENVIRONMENT_MULTIPLIER = NaturalSelectionQueryParameters.wolvesEnvironmentMultiplier;

class WolfCollection {

  /**
   * @param {ObservableArray.<Bunny>} liveBunnies
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( liveBunnies, modelViewTransform, options ) {

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

    // @public notify when a Wolf has been created
    this.wolfCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Wolf } ]
    } );

    // @public
    this.enabledProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'enabledProperty' )
    } );

    // When the group creates a Wolf, notify listeners
    this.wolfGroup.elementCreatedEmitter.addListener( wolf => {
      this.wolfCreatedEmitter.emit( wolf );
    } );

    this.enabledProperty.lazyLink( enabled => {

      //TODO This is temporary, should only create wolves during death interval, and should not call createNextElement
      // when enabledProperty state is being restored.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        if ( enabled ) {
          const numberOfWolves = Math.max( MIN_WOLVES, Utils.roundSymmetric( liveBunnies.length / BUNNIES_PER_WOLF ) );
          phet.log && phet.log( `Creating ${numberOfWolves} wolves` );
          for ( let i = 0; i < numberOfWolves; i++ ) {
            this.wolfGroup.createNextElement();
          }
        }
        else {
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

  //TODO this is temporary, wolves should eat throughout the death interval, not all at once
  /**
   * Applies this environmental factor.
   * @param {Environment} environment
   * @public
   */
  apply( environment ) {
    assert && assert( Environment.includes( environment ), 'invalid environment' );

    if ( this.liveBunnies.length > 0 && this.enabledProperty.value ) {

      // Kill off some of each type of bunny, but a higher percentage of bunnies that don't blend into the environment.
      const bunnies = phet.joist.random.shuffle( this.liveBunnies.getArray() );
      const percentToKillMatch = NaturalSelectionUtils.nextInRange( WOLVES_PERCENT_TO_KILL );
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
    }
  }
}

naturalSelection.register( 'WolfCollection', WolfCollection );
export default WolfCollection;