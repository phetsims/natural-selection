// Copyright 2019-2020, University of Colorado Boulder

/**
 * MemoryLimitDialog is displayed when the sim hits the generation limit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import bunnyBrownFurStraightEarsLongTeethImage from '../../../images/bunny-brownFur-straightEars-longTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

// constants
const ICON_SCALE = 0.75;

class MemoryLimitDialog extends OopsDialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    const iconNode = new Image( bunnyBrownFurStraightEarsLongTeethImage );
    iconNode.setScaleMagnitude( -ICON_SCALE, ICON_SCALE );

    options = merge( {
      topMargin: 50,
      bottomMargin: 50,
      iconNode: iconNode,
      richTextOptions: {
        font: NaturalSelectionConstants.DIALOG_FONT
      },

      // phet-io
      tandem: Tandem.REQUIRED, // see https://github.com/phetsims/natural-selection/issues/156
      phetioReadOnly: true,
      phetioDocumentation: 'This dialog is displayed when the sim has reached its memory limit.'
    }, options );

    super( naturalSelectionStrings.memoryLimitMessage, options );
  }
}

naturalSelection.register( 'MemoryLimitDialog', MemoryLimitDialog );
export default MemoryLimitDialog;