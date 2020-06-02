// Copyright 2019-2020, University of Colorado Boulder

/**
 * LimitedFoodCheckbox is a checkbox for enabling the 'Limited Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import AssertUtils from '../AssertUtils.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import EnvironmentalFactorCheckbox from './EnvironmentalFactorCheckbox.js';

class LimitedFoodCheckbox extends EnvironmentalFactorCheckbox {

  /**
   * @param {Property.<boolean>} limitedFoodProperty
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( limitedFoodProperty, alignGroup, options ) {

    assert && AssertUtils.assertPropertyTypeof( limitedFoodProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    const labelNode = new Text( naturalSelectionStrings.limitedFood, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 150 // determined empirically
    } );

    super( labelNode, limitedFoodProperty, alignGroup, NaturalSelectionConstants.CLOCK_FOOD_RANGE,
      NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR, options );
  }
}

naturalSelection.register( 'LimitedFoodCheckbox', LimitedFoodCheckbox );
export default LimitedFoodCheckbox;