// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiedDialog is displayed when all of the bunnies have died.
 * It displays the message "All of the bunnies have died."
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Text } from '../../../../scenery/js/imports.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

type SelfOptions = EmptySelfOptions;

type DiedDialogOptions = SelfOptions & PickRequired<DialogOptions, 'tandem'>;

export default class DiedDialog extends Dialog {

  public constructor( providedOptions: DiedDialogOptions ) {

    const options = optionize4<DiedDialogOptions, SelfOptions, DialogOptions>()(
      {}, NaturalSelectionConstants.DIALOG_OPTIONS, {

      // DialogOptions
      topMargin: 50,
      bottomMargin: 50,
      phetioReadOnly: true,
      phetioDocumentation: 'This dialog is displayed when all of the bunnies have died.'
    }, providedOptions );

    const messageText = new Text( NaturalSelectionStrings.allOfTheBunniesHaveDiedStringProperty, {
      font: NaturalSelectionConstants.DIALOG_FONT,
      maxWidth: 450, // determined empirically
      tandem: options.tandem.createTandem( 'messageText' )
    } );

    super( messageText, options );
  }
}

naturalSelection.register( 'DiedDialog', DiedDialog );