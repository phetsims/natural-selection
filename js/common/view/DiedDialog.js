// Copyright 2019-2020, University of Colorado Boulder

/**
 * DiedDialog is displayed when all of the bunnies have died.
 * It displays the message "All of the bunnies have died."
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class DiedDialog extends Dialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      topMargin: 50,
      bottomMargin: 50,

      // phet-io
      tandem: Tandem.REQUIRED, // see https://github.com/phetsims/natural-selection/issues/156
      phetioReadOnly: true
    }, options );

    const messageText = new Text( naturalSelectionStrings.allOfTheBunniesHaveDied, {
      font: NaturalSelectionConstants.DIALOG_FONT,
      maxWidth: 450 // determined empirically
    } );

    super( messageText, options );
  }
}

naturalSelection.register( 'DiedDialog', DiedDialog );
export default DiedDialog;