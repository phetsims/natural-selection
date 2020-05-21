// Copyright 2019-2020, University of Colorado Boulder

/**
 * LimitedFoodCheckbox is a checkbox for enabling the 'Limited Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';

class LimitedFoodCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} limitedFoodProperty
   * @param {Object} [options]
   */
  constructor( limitedFoodProperty, options ) {

    assert && NaturalSelectionUtils.assertPropertyTypeof( limitedFoodProperty, 'boolean' );

    options = merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

    const content = new Text( naturalSelectionStrings.limitedFood, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 150 // determined empirically
    } );

    super( content, limitedFoodProperty, options );
  }
}

naturalSelection.register( 'LimitedFoodCheckbox', LimitedFoodCheckbox );
export default LimitedFoodCheckbox;