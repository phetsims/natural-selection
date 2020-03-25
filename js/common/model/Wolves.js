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
import Wolf from './Wolf.js';

// constants
const NUMBER_OF_WOLVES = 8;

class Wolves {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

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

    // @public
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
}

naturalSelection.register( 'Wolves', Wolves );
export default Wolves;