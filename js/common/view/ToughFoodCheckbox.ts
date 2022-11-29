// Copyright 2019-2022, University of Colorado Boulder

/**
 * ToughFoodCheckbox is a checkbox for enabling the 'Tough Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { AlignGroup, HBox, Image, Text } from '../../../../scenery/js/imports.js';
import toughShrub3_png from '../../../images/toughShrub3_png.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import EnvironmentalFactorCheckbox, { EnvironmentalFactorCheckboxOptions } from './EnvironmentalFactorCheckbox.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type ToughFoodCheckboxOptions = SelfOptions & EnvironmentalFactorCheckboxOptions;

export default class ToughFoodCheckbox extends EnvironmentalFactorCheckbox {

  public constructor( isToughProperty: Property<boolean>, alignGroup: AlignGroup, providedOptions: ToughFoodCheckboxOptions ) {

    const options = optionize<ToughFoodCheckboxOptions, SelfOptions, EnvironmentalFactorCheckboxOptions>()( {

      // EnvironmentalFactorCheckboxOptions
      clockSliceRange: NaturalSelectionConstants.CLOCK_FOOD_RANGE,
      clockSliceColor: NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR
    }, providedOptions );

    const labelText = new Text( NaturalSelectionStrings.toughFoodStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 90, // determined empirically
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const icon = new Image( toughShrub3_png, {
      scale: 0.2 // determined empirically
    } );

    const labelNode = new HBox( {
      children: [ labelText, icon ],
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING
    } );

    super( isToughProperty, labelNode, alignGroup, options );
  }
}

naturalSelection.register( 'ToughFoodCheckbox', ToughFoodCheckbox );