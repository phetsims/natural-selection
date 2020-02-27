// Copyright 2019-2020, University of Colorado Boulder

/**
 * TODO
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

class Wolves {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

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