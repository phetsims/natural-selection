// Copyright 2019-2025, University of Colorado Boulder

/**
 * WorldDialog is displayed when bunnies have exceeded their maximum population.
 * It displays the message "Bunnies have taken over the world".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import world_png from '../../../images/world_png.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

type SelfOptions = EmptySelfOptions;

type WorldDialogOptions = SelfOptions & PickRequired<DialogOptions, 'tandem'>;

export default class WorldDialog extends Dialog {

  public constructor( providedOptions: WorldDialogOptions ) {

    const options = optionize4<WorldDialogOptions, SelfOptions, DialogOptions>()(
      {}, NaturalSelectionConstants.DIALOG_OPTIONS, {

        // DialogOptions
        fill: 'black',
        closeButtonColor: 'white',
        topMargin: 25,
        phetioReadOnly: true,
        phetioDocumentation: 'This dialog is displayed when bunnies have taken over the world.'
      }, providedOptions );

    const worldNode = new Image( world_png, {
      scale: 0.8 // determined empirically
    } );

    const messageText = new Text( NaturalSelectionStrings.bunniesHaveTakenOverTheWorldStringProperty, {
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