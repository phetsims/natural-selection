// Copyright 2019, University of Colorado Boulder

/**
 * DiedDialog is displayed when all of the bunnies have died.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

const allOfTheBunniesHaveDiedString = naturalSelectionStrings.allOfTheBunniesHaveDied;

class DiedDialog extends Dialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      topMargin: 50,
      bottomMargin: 50
    }, options );

    const messageText = new Text( allOfTheBunniesHaveDiedString, {
      font: NaturalSelectionConstants.DIALOG_FONT,
      scale: NaturalSelectionConstants.DIALOG_CONTENT_SCALE,
      maxWidth: 450 // determined empirically
    } );

    super( messageText, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'DiedDialog does not support dispose' );
  }
}

naturalSelection.register( 'DiedDialog', DiedDialog );
export default DiedDialog;