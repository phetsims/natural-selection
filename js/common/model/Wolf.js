// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Sprite from './Sprite.js';
import WolfIO from './WolfIO.js';

class Wolf extends Sprite {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: WolfIO
    }, options );

    super( modelViewTransform, options );
  }
}

naturalSelection.register( 'Wolf', Wolf );
export default Wolf;