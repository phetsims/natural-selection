// Copyright 2019-2020, University of Colorado Boulder

/**
 * WolvesCheckbox is a checkbox for enabling the 'Wolves' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import wolfImage from '../../../images/wolf_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import AssertUtils from '../AssertUtils.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import EnvironmentalFactorCheckbox from './EnvironmentalFactorCheckbox.js';

class WolvesCheckbox extends EnvironmentalFactorCheckbox {

  /**
   * @param {Property.<boolean>} wolvesEnabledProperty
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( wolvesEnabledProperty, alignGroup, options ) {

    assert && AssertUtils.assertPropertyTypeof( wolvesEnabledProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    const text = new Text( naturalSelectionStrings.wolves, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 110 // determined empirically
    } );

    const icon = new Image( wolfImage );
    const scale = 0.064; // determined empirically
    icon.setScaleMagnitude( -scale, scale );

    const labelNode = new HBox( {
      children: [ text, icon ],
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING
    } );

    super( labelNode, wolvesEnabledProperty, alignGroup, NaturalSelectionConstants.CLOCK_WOLVES_SLICE_RANGE,
      NaturalSelectionColors.CLOCK_WOLVES_SLICE_COLOR, options );
  }
}

naturalSelection.register( 'WolvesCheckbox', WolvesCheckbox );
export default WolvesCheckbox;