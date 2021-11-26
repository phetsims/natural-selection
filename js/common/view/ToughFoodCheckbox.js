// Copyright 2019-2021, University of Colorado Boulder

/**
 * ToughFoodCheckbox is a checkbox for enabling the 'Tough Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { AlignGroup } from '../../../../scenery/js/imports.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Image } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import toughShrub3_png from '../../../images/toughShrub3_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import EnvironmentalFactorCheckbox from './EnvironmentalFactorCheckbox.js';

class ToughFoodCheckbox extends EnvironmentalFactorCheckbox {

  /**
   * @param {Property.<boolean>} isToughProperty
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( isToughProperty, alignGroup, options ) {

    assert && AssertUtils.assertPropertyOf( isToughProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    options = merge( {

      // EnvironmentalFactorCheckbox options
      clockSliceRange: NaturalSelectionConstants.CLOCK_FOOD_RANGE,
      clockSliceColor: NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR
    }, options );

    const text = new Text( naturalSelectionStrings.toughFood, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 110 // determined empirically
    } );

    const icon = new Image( toughShrub3_png, {
      scale: 0.2 // determined empirically
    } );

    const labelNode = new HBox( {
      children: [ text, icon ],
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING
    } );

    super( isToughProperty, labelNode, alignGroup, options );
  }
}

naturalSelection.register( 'ToughFoodCheckbox', ToughFoodCheckbox );
export default ToughFoodCheckbox;