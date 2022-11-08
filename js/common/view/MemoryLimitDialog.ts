// Copyright 2019-2022, University of Colorado Boulder

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

import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import OopsDialog, { OopsDialogOptions } from '../../../../scenery-phet/js/OopsDialog.js';
import { Image } from '../../../../scenery/js/imports.js';
import bunnyBrownFurStraightEarsLongTeeth_png from '../../../images/bunnyBrownFurStraightEarsLongTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

// constants
const ICON_SCALE = 0.75;

type SelfOptions = EmptySelfOptions;

type MemoryLimitDialogOptions = SelfOptions & PickRequired<OopsDialogOptions, 'tandem'>;

export default class MemoryLimitDialog extends OopsDialog {

  public constructor( providedOptions: MemoryLimitDialogOptions ) {

    const iconNode = new Image( bunnyBrownFurStraightEarsLongTeeth_png );
    iconNode.setScaleMagnitude( -ICON_SCALE, ICON_SCALE );

    const options = optionize4<MemoryLimitDialogOptions, SelfOptions, OopsDialogOptions>()(
      {}, NaturalSelectionConstants.DIALOG_OPTIONS, {

        // OopsDialogOptions
        topMargin: 50,
        bottomMargin: 50,
        iconNode: iconNode,
        richTextOptions: {
          font: NaturalSelectionConstants.DIALOG_FONT
        },
        phetioReadOnly: true,
        phetioDocumentation: 'This dialog is displayed when the sim has reached its memory limit.'
      }, providedOptions );

    super( NaturalSelectionStrings.memoryLimitMessageStringProperty, options );
  }
}

naturalSelection.register( 'MemoryLimitDialog', MemoryLimitDialog );