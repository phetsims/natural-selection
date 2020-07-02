// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationLimitDialog is displayed when the sim hits the generation limit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import bunnyBrownFurStraightEarsLongTeethImage from '../../../images/bunny-brownFur-straightEars-longTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

// constants
const ICON_SCALE = 0.75;

class GenerationLimitDialog extends OopsDialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    const iconNode = new Image( bunnyBrownFurStraightEarsLongTeethImage );
    iconNode.setScaleMagnitude( -ICON_SCALE, ICON_SCALE );

    options = merge( {
      topMargin: 50,
      bottomMargin: 50,
      scale: NaturalSelectionConstants.DIALOG_SCALE,
      iconNode: iconNode
    }, options );

    super( naturalSelectionStrings.memoryLimitMessage, options );
  }
}

naturalSelection.register( 'GenerationLimitDialog', GenerationLimitDialog );
export default GenerationLimitDialog;