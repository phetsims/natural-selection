// Copyright 2019-2022, University of Colorado Boulder

/**
 * LimitedFoodCheckbox is a checkbox for enabling the 'Limited Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { AlignGroup, Text } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
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

    assert && AssertUtils.assertPropertyOf( limitedFoodProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    options = merge( {

      // EnvironmentalFactorCheckbox options
      clockSliceRange: NaturalSelectionConstants.CLOCK_FOOD_RANGE,
      clockSliceColor: NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const labelText = new Text( NaturalSelectionStrings.limitedFoodStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 150, // determined empirically
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    super( limitedFoodProperty, labelText, alignGroup, options );
  }
}

naturalSelection.register( 'LimitedFoodCheckbox', LimitedFoodCheckbox );
export default LimitedFoodCheckbox;