// Copyright 2019-2025, University of Colorado Boulder

/**
 * WolvesCheckbox is a checkbox for enabling the 'Wolves' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import wolf_png from '../../../images/wolf_png.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import EnvironmentalFactorCheckbox, { EnvironmentalFactorCheckboxOptions } from './EnvironmentalFactorCheckbox.js';

type SelfOptions = EmptySelfOptions;

type WolvesCheckboxOptions = SelfOptions & PickRequired<EnvironmentalFactorCheckboxOptions, 'tandem'>;

export default class WolvesCheckbox extends EnvironmentalFactorCheckbox {

  public constructor( wolvesEnabledProperty: Property<boolean>, alignGroup: AlignGroup, providedOptions: WolvesCheckboxOptions ) {

    const options = optionize<WolvesCheckboxOptions, SelfOptions, EnvironmentalFactorCheckboxOptions>()( {

      // EnvironmentalFactorCheckboxOptions
      clockSliceRange: NaturalSelectionConstants.CLOCK_WOLVES_RANGE,
      clockSliceColor: NaturalSelectionColors.CLOCK_WOLVES_SLICE_COLOR
    }, providedOptions );

    const labelText = new Text( NaturalSelectionStrings.wolvesStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 90 // determined empirically
    } );

    const icon = new Image( wolf_png );
    const scale = 0.13; // determined empirically
    icon.setScaleMagnitude( -scale, scale ); // reflect so the wolf is facing left

    const labelNode = new HBox( {
      children: [ labelText, icon ],
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING
    } );

    super( wolvesEnabledProperty, labelNode, alignGroup, options );
  }
}

naturalSelection.register( 'WolvesCheckbox', WolvesCheckbox );