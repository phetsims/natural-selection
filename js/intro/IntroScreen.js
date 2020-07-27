// Copyright 2019-2020, University of Colorado Boulder

/**
 * IntroScreen is the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import brownBunnyImage from '../../images/bunny-brownFur-straightEars-shortTeeth_png.js';
import whiteBunnyImage from '../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import NaturalSelectionColors from '../common/NaturalSelectionColors.js';
import naturalSelection from '../naturalSelection.js';
import naturalSelectionStrings from '../naturalSelectionStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

class IntroScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    const options = {
      name: naturalSelectionStrings.screen.intro,
      backgroundColorProperty: new Property( NaturalSelectionColors.SCREEN_VIEW_BACKGROUND ),
      homeScreenIcon: createScreenIcon(),

      // phet-io
      tandem: tandem
    };

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Creates the icon for this screen.
 * @returns {ScreenIcon}
 */
function createScreenIcon() {
  return new ScreenIcon( new HBox( {
    spacing: 20,
    children: [ new Image( brownBunnyImage ), new Image( whiteBunnyImage ) ]
  } ), {
    fill: NaturalSelectionColors.SCREEN_VIEW_BACKGROUND
  } );
}

naturalSelection.register( 'IntroScreen', IntroScreen );
export default IntroScreen;