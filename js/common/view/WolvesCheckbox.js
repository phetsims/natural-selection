// Copyright 2019-2020, University of Colorado Boulder

/**
 * WolvesCheckbox is a checkbox for enabling the 'Wolves' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import wolfImage from '../../../images/wolf_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import NaturalSelectionCheckbox from './NaturalSelectionCheckbox.js';

class WolvesCheckbox extends NaturalSelectionCheckbox {

  /**
   * @param {Property.<boolean>} wolvesEnabledProperty
   * @param {Object} [options]
   */
  constructor( wolvesEnabledProperty, options ) {

    assert && NaturalSelectionUtils.assertPropertyTypeof( wolvesEnabledProperty, 'boolean' );

    const text = new Text( naturalSelectionStrings.wolves, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 110 // determined empirically
    } );

    const icon = new Image( wolfImage );
    const scale = 0.064;
    icon.setScaleMagnitude( -scale, scale );

    const content = new HBox( {
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING,
      children: [ text, icon ]
    } );

    super( content, wolvesEnabledProperty, options );
  }
}

naturalSelection.register( 'WolvesCheckbox', WolvesCheckbox );
export default WolvesCheckbox;