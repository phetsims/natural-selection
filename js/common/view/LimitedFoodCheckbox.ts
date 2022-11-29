// Copyright 2019-2022, University of Colorado Boulder

/**
 * LimitedFoodCheckbox is a checkbox for enabling the 'Limited Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { AlignGroup, Text } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import EnvironmentalFactorCheckbox, { EnvironmentalFactorCheckboxOptions } from './EnvironmentalFactorCheckbox.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type LimitedFoodCheckboxOptions = SelfOptions & PickRequired<EnvironmentalFactorCheckboxOptions, 'tandem'>;

export default class LimitedFoodCheckbox extends EnvironmentalFactorCheckbox {

  public constructor( limitedFoodProperty: Property<boolean>, alignGroup: AlignGroup, providedOptions: LimitedFoodCheckboxOptions ) {

    const options = optionize<LimitedFoodCheckboxOptions, SelfOptions, EnvironmentalFactorCheckboxOptions>()( {

      // EnvironmentalFactorCheckboxOptions
      clockSliceRange: NaturalSelectionConstants.CLOCK_FOOD_RANGE,
      clockSliceColor: NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR
    }, providedOptions );

    const labelText = new Text( NaturalSelectionStrings.limitedFoodStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 90, // determined empirically
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    super( limitedFoodProperty, labelText, alignGroup, options );
  }
}

naturalSelection.register( 'LimitedFoodCheckbox', LimitedFoodCheckbox );