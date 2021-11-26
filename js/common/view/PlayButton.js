// Copyright 2019-2020, University of Colorado Boulder

/**
 * PlayButton is the push button that is shown when the initial population of the bunnies is > 1.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class PlayButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, NaturalSelectionConstants.RECTANGULAR_PUSH_BUTTON_OPTIONS, {
      baseColor: NaturalSelectionColors.ADD_A_MATE_BUTTON,
      xMargin: 12,
      yMargin: 8,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true // because sim state controls when this button is visible
    }, options );

    assert && assert( !options.content, 'PlayButton sets content' );
    options.content = new Text( naturalSelectionStrings.play, {
      font: NaturalSelectionConstants.PUSH_BUTTON_FONT,
      maxWidth: 150 // determined empirically
    } );

    super( options );
  }
}

naturalSelection.register( 'PlayButton', PlayButton );
export default PlayButton;