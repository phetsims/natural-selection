// Copyright 2019-2021, University of Colorado Boulder

/**
 * WolvesCheckbox is a checkbox for enabling the 'Wolves' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import wolf_png from '../../../images/wolf_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
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

    assert && AssertUtils.assertPropertyOf( wolvesEnabledProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    options = merge( {

      // EnvironmentalFactorCheckbox options
      clockSliceRange: NaturalSelectionConstants.CLOCK_WOLVES_RANGE,
      clockSliceColor: NaturalSelectionColors.CLOCK_WOLVES_SLICE_COLOR
    }, options );

    const text = new Text( naturalSelectionStrings.wolves, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 110 // determined empirically
    } );

    const icon = new Image( wolf_png );
    const scale = 0.13; // determined empirically
    icon.setScaleMagnitude( -scale, scale ); // reflect so the wolf is facing left

    const labelNode = new HBox( {
      children: [ text, icon ],
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING
    } );

    super( wolvesEnabledProperty, labelNode, alignGroup, options );
  }
}

naturalSelection.register( 'WolvesCheckbox', WolvesCheckbox );
export default WolvesCheckbox;