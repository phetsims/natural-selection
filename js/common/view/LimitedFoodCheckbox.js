// Copyright 2019-2020, University of Colorado Boulder

/**
 * LimitedFoodCheckbox is a checkbox for enabling the 'Limited Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import GenerationClockNode from './GenerationClockNode.js';
import NaturalSelectionCheckbox from './NaturalSelectionCheckbox.js';

class LimitedFoodCheckbox extends NaturalSelectionCheckbox {

  /**
   * @param {Property.<boolean>} limitedFoodProperty
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( limitedFoodProperty, alignGroup, options ) {

    assert && NaturalSelectionUtils.assertPropertyTypeof( limitedFoodProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    const text = new Text( naturalSelectionStrings.limitedFood, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 150 // determined empirically
    } );

    const labelNode = new AlignBox( text, {
      group: alignGroup,
      xAlign: 'left'
    } );

    const clockSliceNode = GenerationClockNode.createSliceIcon( NaturalSelectionConstants.CLOCK_FOOD_SLICE_RANGE, {
      sliceFill: NaturalSelectionColors.CLOCK_FOOD_SLICE_COLOR
    } );

    const content = new HBox( {
      spacing: 2 * NaturalSelectionConstants.CHECKBOX_X_SPACING,
      children: [ labelNode, clockSliceNode ]
    } );

    super( content, limitedFoodProperty, options );
  }
}

naturalSelection.register( 'LimitedFoodCheckbox', LimitedFoodCheckbox );
export default LimitedFoodCheckbox;