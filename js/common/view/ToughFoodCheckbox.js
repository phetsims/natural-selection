// Copyright 2019-2020, University of Colorado Boulder

/**
 * ToughFoodCheckbox is a checkbox for enabling the 'Tough Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import shrubToughCImage from '../../../images/shrub-tough-C_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import NaturalSelectionCheckbox from './NaturalSelectionCheckbox.js';

class ToughFoodCheckbox extends NaturalSelectionCheckbox {

  /**
   * @param {Property.<boolean>} isToughProperty
   * @param {Object} [options]
   */
  constructor( isToughProperty, options ) {
    
    assert && NaturalSelectionUtils.assertPropertyTypeof( isToughProperty, 'boolean' );

    const text = new Text( naturalSelectionStrings.toughFood, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 110 // determined empirically
    } );

    const icon = new Image( shrubToughCImage, { scale: 0.2 } );

    const content = new HBox( {
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING,
      children: [ text, icon ]
    } );

    super( content, isToughProperty, options );
  }
}

naturalSelection.register( 'ToughFoodCheckbox', ToughFoodCheckbox );
export default ToughFoodCheckbox;