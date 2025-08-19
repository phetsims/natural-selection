// Copyright 2019-2025, University of Colorado Boulder

/**
 * IntroScreen is the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import bunnyBrownFurStraightEarsShortTeeth_png from '../../images/bunnyBrownFurStraightEarsShortTeeth_png.js';
import bunnyWhiteFurStraightEarsShortTeeth_png from '../../images/bunnyWhiteFurStraightEarsShortTeeth_png.js';
import NaturalSelectionColors from '../common/NaturalSelectionColors.js';
import naturalSelection from '../naturalSelection.js';
import NaturalSelectionStrings from '../NaturalSelectionStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: NaturalSelectionStrings.screen.introStringProperty,
      homeScreenIcon: createScreenIcon(),
      backgroundColorProperty: NaturalSelectionColors.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( new HBox( {
    spacing: 20,
    children: [ new Image( bunnyBrownFurStraightEarsShortTeeth_png ), new Image( bunnyWhiteFurStraightEarsShortTeeth_png ) ]
  } ), {
    fill: NaturalSelectionColors.screenBackgroundColorProperty
  } );
}

naturalSelection.register( 'IntroScreen', IntroScreen );