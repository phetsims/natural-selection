// Copyright 2019-2020, University of Colorado Boulder

/**
 * Wolves is the model of a pack of wolves.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Wolf from './Wolf.js';

// constants
const NUMBER_OF_WOLVES = 8; //TODO this must be proportional to the number of bunnies, not constant

class Wolves {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only)
    this.wolves = [];
    for ( let i = 0; i < NUMBER_OF_WOLVES; i++ ) {
      this.wolves.push( new Wolf( modelViewTransform, {
        tandem: options.tandem.createTandem( `wolf${i}` )
      } ) );
    }

    // @public TODO rename to activeProperty? areHuntingProperty?
    this.enabledProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'enabledProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.enabledProperty.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'Wolves does not support dispose' );
  }

  /**
   * Applies this environmental factor.
   * @param {Bunny[]} bunnies
   * @param {Environment} environment
   * @public
   */
  apply( bunnies, environment ) {
    assert && assert( Array.isArray( bunnies ), 'invalid bunnies' );
    assert && assert( Environment.includes( environment ), 'invalid environment' );

    if ( bunnies.length > 0 && this.enabledProperty.value ) {

      // Kill off some of each type of bunny, but a higher percentage of bunnies that don't blend into the environment.
      bunnies = phet.joist.random.shuffle( bunnies );
      const percentageToKillMatch = 0.05;
      assert && assert( percentageToKillMatch > 0 && percentageToKillMatch < 1, `invalid percentageToKillMatch: ${percentageToKillMatch}` );
      const percentageToKillNoMatch = 3 * percentageToKillMatch;
      assert && assert( percentageToKillNoMatch > 0 && percentageToKillNoMatch < 1, `invalid percentageToKillNoMatch: ${percentageToKillNoMatch}` );

      // Kill off bunnies with white fur.
      const bunniesWhiteFur = _.filter( bunnies, bunny => bunny.phenotype.hasWhiteFur() );
      const percentageToKillWhiteFur = ( environment === Environment.EQUATOR ) ? percentageToKillNoMatch : percentageToKillMatch;
      const numberToKillWhiteFur = Math.ceil( percentageToKillWhiteFur * bunniesWhiteFur.length );
      assert && assert( numberToKillWhiteFur <= bunniesWhiteFur.length, 'invalid numberToKillWhiteFur' );
      for ( let i = 0; i < numberToKillWhiteFur; i++ ) {
        bunniesWhiteFur[ i ].die();
      }
      phet.log( `${numberToKillWhiteFur} bunnies with white fur were eaten by wolves` );

      // Kill off bunnies with brown fur.
      const bunniesBrownFur = _.filter( bunnies, bunny => bunny.phenotype.hasBrownFur() );
      const percentageToKillBrownFur = ( environment === Environment.EQUATOR ) ? percentageToKillMatch : percentageToKillNoMatch;
      const numberToKillBrownFur = Math.ceil( percentageToKillBrownFur * bunniesBrownFur.length );
      assert && assert( numberToKillBrownFur <= bunniesBrownFur.length, 'invalid numberToKillBrownFur' );
      for ( let i = 0; i < numberToKillBrownFur; i++ ) {
        bunniesBrownFur[ i ].die();
      }
      phet.log( `${numberToKillBrownFur} bunnies with brown fur were eaten by wolves` );
    }
  }
}

naturalSelection.register( 'Wolves', Wolves );
export default Wolves;