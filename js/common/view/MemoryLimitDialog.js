// Copyright 2019-2021, University of Colorado Boulder

/**
 * MemoryLimitDialog is displayed when the sim has hit its memory limit.
 *
 * It's possible to put this sim in a state where the population stabilizes, and the sim will run forever. The sim
 * would continue to create data points for the Population graph, and would eventually crash the browser. So the sim
 * has a limit on the number of generations, see maxGenerations in NaturalSelectionQueryParameters. When this limit
 * is reached, the sim stops, MemoryLimitDialog is displayed, and the student can review the final state of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import { Image } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import bunnyBrownFurStraightEarsLongTeeth_png from '../../../images/bunnyBrownFurStraightEarsLongTeeth_png.js';
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

    const iconNode = new Image( bunnyBrownFurStraightEarsLongTeeth_png );
    iconNode.setScaleMagnitude( -ICON_SCALE, ICON_SCALE );

    options = merge( {}, NaturalSelectionConstants.DIALOG_OPTIONS, {
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