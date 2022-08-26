// Copyright 2019-2022, University of Colorado Boulder

/**
 * TextPushButton is a push button with a text label.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class TextPushButton extends RectangularPushButton {

  /**
   * @param {string} label
   * @param {Object} [options]
   */
  constructor( label, options ) {

    options = merge( {}, NaturalSelectionConstants.RECTANGULAR_PUSH_BUTTON_OPTIONS, {
      textOptions: {
        font: NaturalSelectionConstants.PUSH_BUTTON_FONT,
        maxWidth: 150 // determined empirically
      },
      baseColor: NaturalSelectionColors.ADD_A_MATE_BUTTON,
      xMargin: 12,
      yMargin: 8,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true // because sim state controls when this button is visible
    }, options );

    assert && assert( !options.content, 'TextPushButton sets content' );
    options.content = new Text( label, options.textOptions );

    super( options );
  }
}

naturalSelection.register( 'TextPushButton', TextPushButton );
export default TextPushButton;