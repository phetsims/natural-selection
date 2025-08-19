// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScreen is the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import bunnyBrownFurFloppyEarsLongTeeth_png from '../../images/bunnyBrownFurFloppyEarsLongTeeth_png.js';
import bunnyBrownFurFloppyEarsShortTeeth_png from '../../images/bunnyBrownFurFloppyEarsShortTeeth_png.js';
import bunnyBrownFurStraightEarsLongTeeth_png from '../../images/bunnyBrownFurStraightEarsLongTeeth_png.js';
import bunnyBrownFurStraightEarsShortTeeth_png from '../../images/bunnyBrownFurStraightEarsShortTeeth_png.js';
import bunnyWhiteFurFloppyEarsLongTeeth_png from '../../images/bunnyWhiteFurFloppyEarsLongTeeth_png.js';
import bunnyWhiteFurFloppyEarsShortTeeth_png from '../../images/bunnyWhiteFurFloppyEarsShortTeeth_png.js';
import bunnyWhiteFurStraightEarsLongTeeth_png from '../../images/bunnyWhiteFurStraightEarsLongTeeth_png.js';
import bunnyWhiteFurStraightEarsShortTeeth_png from '../../images/bunnyWhiteFurStraightEarsShortTeeth_png.js';
import NaturalSelectionColors from '../common/NaturalSelectionColors.js';
import naturalSelection from '../naturalSelection.js';
import NaturalSelectionStrings from '../NaturalSelectionStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

export default class LabScreen extends Screen<LabModel, LabScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: NaturalSelectionStrings.screen.labStringProperty,
      homeScreenIcon: createScreenIcon(),
      backgroundColorProperty: NaturalSelectionColors.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new LabModel( tandem.createTandem( 'model' ) ),
      model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {

  const SPACING = 20;

  return new ScreenIcon( new VBox( {
    spacing: SPACING,
    children: [

      // row 1
      new HBox( {
        spacing: SPACING,
        children: [
          new Image( bunnyBrownFurStraightEarsShortTeeth_png ), new Image( bunnyWhiteFurStraightEarsShortTeeth_png ),
          new Image( bunnyBrownFurFloppyEarsShortTeeth_png ), new Image( bunnyWhiteFurFloppyEarsShortTeeth_png )
        ]
      } ),

      // row 2
      new HBox( {
        spacing: SPACING,
        children: [
          new Image( bunnyWhiteFurStraightEarsLongTeeth_png ), new Image( bunnyBrownFurStraightEarsLongTeeth_png ),
          new Image( bunnyWhiteFurFloppyEarsLongTeeth_png ), new Image( bunnyBrownFurFloppyEarsLongTeeth_png )
        ]
      } )
    ]
  } ), {
    fill: NaturalSelectionColors.screenBackgroundColorProperty
  } );
}

naturalSelection.register( 'LabScreen', LabScreen );