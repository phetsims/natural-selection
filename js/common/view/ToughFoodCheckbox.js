// Copyright 2019-2020, University of Colorado Boulder

/**
 * ToughFoodCheckbox is a checkbox for enabling the 'tough food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import toughFoodCImage from '../../../images/toughFoodC_png.js';
import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

const toughFoodString = naturalSelectionStrings.toughFood;


class ToughFoodCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} wolvesEnabledProperty
   * @param {Object} [options]
   */
  constructor( wolvesEnabledProperty, options ) {

    options = merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

    const text = new Text( toughFoodString, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 110 // determined empirically
    } );

    const icon = new Image( toughFoodCImage, { scale: 0.2 } );

    const content = new HBox( {
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING,
      children: [ text, icon ]
    } );

    super( content, wolvesEnabledProperty, options );
  }
}

naturalSelection.register( 'ToughFoodCheckbox', ToughFoodCheckbox );
export default ToughFoodCheckbox;