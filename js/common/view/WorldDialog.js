// Copyright 2019-2020, University of Colorado Boulder

/**
 * WorldDialog is displayed when bunnies have exceeded their maximum population.
 * It displays the message "Bunnies have taken over the world".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import worldImage from '../../../images/world_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class WorldDialog extends Dialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      fill: 'black',
      closeButtonColor: 'white',
      topMargin: 25,

      // phet-io
      tandem: Tandem.REQUIRED, // see https://github.com/phetsims/natural-selection/issues/156
      phetioReadOnly: true,
      phetioDocumentation: 'This dialog is displayed when bunnies have taken over the world.'
    }, options );

    const worldNode = new Image( worldImage, {
      scale: 0.8 // determined empirically
    } );

    const messageText = new Text( naturalSelectionStrings.bunniesHaveTakenOverTheWorld, {
      font: NaturalSelectionConstants.DIALOG_FONT,
      fill: 'white',
      maxWidth: worldNode.width
    } );

    const content = new VBox( {
      spacing: 25,
      align: 'center',
      children: [ messageText, worldNode ]
    } );

    super( content, options );
  }
}

naturalSelection.register( 'WorldDialog', WorldDialog );
export default WorldDialog;