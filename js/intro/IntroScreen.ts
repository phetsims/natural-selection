// Copyright 2019-2023, University of Colorado Boulder

/**
 * IntroScreen is the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { HBox, Image } from '../../../scenery/js/imports.js';
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

    const options = {

      // Screen options
      name: NaturalSelectionStrings.screen.introStringProperty,
      homeScreenIcon: createScreenIcon(),
      backgroundColorProperty: new Property( NaturalSelectionColors.SCREEN_VIEW_BACKGROUND, {
        tandem: Tandem.OPT_OUT
      } ),

      // phet-io
      tandem: tandem
    };

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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
    fill: NaturalSelectionColors.SCREEN_VIEW_BACKGROUND
  } );
}

naturalSelection.register( 'IntroScreen', IntroScreen );