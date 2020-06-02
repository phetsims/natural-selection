// Copyright 2019-2020, University of Colorado Boulder

/**
 * LimitedFoodCheckbox is a checkbox for enabling the 'Limited Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Text from '../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import NaturalSelectionCheckbox from './NaturalSelectionCheckbox.js';

class LimitedFoodCheckbox extends NaturalSelectionCheckbox {

  /**
   * @param {Property.<boolean>} limitedFoodProperty
   * @param {Object} [options]
   */
  constructor( limitedFoodProperty, options ) {

    assert && NaturalSelectionUtils.assertPropertyTypeof( limitedFoodProperty, 'boolean' );

    const content = new Text( naturalSelectionStrings.limitedFood, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 150 // determined empirically
    } );

    super( content, limitedFoodProperty, options );
  }
}

naturalSelection.register( 'LimitedFoodCheckbox', LimitedFoodCheckbox );
export default LimitedFoodCheckbox;