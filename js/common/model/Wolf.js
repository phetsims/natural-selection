// Copyright 2020, University of Colorado Boulder

/**
 * Wolf is the model of an individual wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Sprite from './Sprite.js';
import WolfIO from './WolfIO.js';

class Wolf extends Sprite {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: WolfIO
    }, options );

    super( modelViewTransform, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'Wolf does not support dispose' );
  }
}

naturalSelection.register( 'Wolf', Wolf );
export default Wolf;