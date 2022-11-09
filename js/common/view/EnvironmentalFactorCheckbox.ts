// Copyright 2020-2022, University of Colorado Boulder

/**
 * EnvironmentalFactorCheckbox is the base class for all checkboxes in the 'Environmental Factors' panel.
 * It makes all checkbox labels have the same effective size. And it adds a generation-clock icon to the right of
 * the checkbox's label, to signify which clock slice corresponds to the time during which the environmental factor
 * will be applied.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { AlignBox, AlignGroup, HBox, Node, TColor } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import GenerationClockNode from './GenerationClockNode.js';

// constants
const DEFAULT_CLOCK_SLICE_RANGE = new Range( 0, 1 );

type SelfOptions = {
  clockSliceRange?: Range;
  clockSliceColor?: TColor;
};

export type EnvironmentalFactorCheckboxOptions = SelfOptions &
  PickOptional<CheckboxOptions, 'visible'> &
  PickRequired<CheckboxOptions, 'tandem'>;

export default class EnvironmentalFactorCheckbox extends Checkbox {

  /**
   * @param enabledProperty - whether the environmental factor is enabled
   * @param labelNode - the label that appears to the right of the box
   * @param alignGroup - sets the effective size of labelNode
   * @param [providedOptions]
   */
  public constructor( enabledProperty: Property<boolean>, labelNode: Node, alignGroup: AlignGroup,
                      providedOptions: EnvironmentalFactorCheckboxOptions ) {

    const options = optionize4<EnvironmentalFactorCheckboxOptions, SelfOptions, CheckboxOptions>()(
      {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {

        // SelfOptions
        clockSliceRange: DEFAULT_CLOCK_SLICE_RANGE,
        clockSliceColor: 'black'
      }, providedOptions );

    const alignBox = new AlignBox( labelNode, {
      group: alignGroup,
      xAlign: 'left'
    } );

    const clockSliceNode = GenerationClockNode.createSliceIcon( options.clockSliceRange, options.clockSliceColor );

    const content = new HBox( {
      spacing: 2 * NaturalSelectionConstants.CHECKBOX_X_SPACING,
      children: [ alignBox, clockSliceNode ]
    } );

    super( enabledProperty, content, options );
  }
}

naturalSelection.register( 'EnvironmentalFactorCheckbox', EnvironmentalFactorCheckbox );