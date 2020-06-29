// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationLimitDialog is displayed when the sim hits the generation limit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class GenerationLimitDialog extends OopsDialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      topMargin: 50,
      bottomMargin: 50,
      scale: NaturalSelectionConstants.DIALOG_SCALE
    }, options );

    super( naturalSelectionStrings.memoryLimitMessage, options );
  }
}

naturalSelection.register( 'GenerationLimitDialog', GenerationLimitDialog );
export default GenerationLimitDialog;