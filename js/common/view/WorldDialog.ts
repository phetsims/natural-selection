// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * WorldDialog is displayed when bunnies have exceeded their maximum population.
 * It displays the message "Bunnies have taken over the world".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Image, Text, VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import world_png from '../../../images/world_png.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class WorldDialog extends Dialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, NaturalSelectionConstants.DIALOG_OPTIONS, {
      fill: 'black',
      closeButtonColor: 'white',
      topMargin: 25,

      // phet-io
      tandem: Tandem.REQUIRED, // see https://github.com/phetsims/natural-selection/issues/156
      phetioReadOnly: true,
      phetioDocumentation: 'This dialog is displayed when bunnies have taken over the world.'
    }, options );

    const worldNode = new Image( world_png, {
      scale: 0.8 // determined empirically
    } );

    const messageText = new Text( NaturalSelectionStrings.bunniesHaveTakenOverTheWorldStringProperty, {
      font: NaturalSelectionConstants.DIALOG_FONT,
      fill: 'white',
      maxWidth: worldNode.width,
      tandem: options.tandem.createTandem( 'messageText' )
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