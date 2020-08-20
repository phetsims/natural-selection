// Copyright 2019-2020, University of Colorado Boulder

/**
 * LabScreen is the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Image from '../../../scenery/js/nodes/Image.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../tandem/js/Tandem.js';
import brownBunnyImage4 from '../../images/bunny-brownFur-floppyEars-longTeeth_png.js';
import brownBunnyImage2 from '../../images/bunny-brownFur-floppyEars-shortTeeth_png.js';
import brownBunnyImage3 from '../../images/bunny-brownFur-straightEars-longTeeth_png.js';
import brownBunnyImage1 from '../../images/bunny-brownFur-straightEars-shortTeeth_png.js';
import whiteBunnyImage4 from '../../images/bunny-whiteFur-floppyEars-longTeeth_png.js';
import whiteBunnyImage2 from '../../images/bunny-whiteFur-floppyEars-shortTeeth_png.js';
import whiteBunnyImage3 from '../../images/bunny-whiteFur-straightEars-longTeeth_png.js';
import whiteBunnyImage1 from '../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import NaturalSelectionColors from '../common/NaturalSelectionColors.js';
import naturalSelection from '../naturalSelection.js';
import naturalSelectionStrings from '../naturalSelectionStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

class LabScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    const options = {
      name: naturalSelectionStrings.screen.lab,
      backgroundColorProperty: new Property( NaturalSelectionColors.SCREEN_VIEW_BACKGROUND, {
        tandem: Tandem.OPT_OUT
      } ),
      homeScreenIcon: createScreenIcon(),

      // phet-io
      tandem: tandem
    };

    super(
      () => new LabModel( tandem.createTandem( 'model' ) ),
      model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
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

  const SPACING = 20;

  return new ScreenIcon( new VBox( {
    spacing: SPACING,
    children: [

      // row 1
      new HBox( {
        spacing: SPACING,
        children: [
          new Image( brownBunnyImage1 ), new Image( whiteBunnyImage1 ),
          new Image( brownBunnyImage2 ), new Image( whiteBunnyImage2 )
        ]
      } ),

      // row 2
      new HBox( {
        spacing: SPACING,
        children: [
          new Image( whiteBunnyImage3 ), new Image( brownBunnyImage3 ),
          new Image( whiteBunnyImage4 ), new Image( brownBunnyImage4 )
        ]
      } )
    ]
  } ), {
    fill: NaturalSelectionColors.SCREEN_VIEW_BACKGROUND
  } );
}

naturalSelection.register( 'LabScreen', LabScreen );
export default LabScreen;