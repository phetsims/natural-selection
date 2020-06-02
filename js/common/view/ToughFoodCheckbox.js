// Copyright 2019-2020, University of Colorado Boulder

/**
 * ToughFoodCheckbox is a checkbox for enabling the 'Tough Food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import shrubToughCImage from '../../../images/shrub-tough-C_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import GenerationClockNode from './GenerationClockNode.js';
import NaturalSelectionCheckbox from './NaturalSelectionCheckbox.js';

class ToughFoodCheckbox extends NaturalSelectionCheckbox {

  /**
   * @param {Property.<boolean>} isToughProperty
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( isToughProperty, alignGroup, options ) {
    
    assert && NaturalSelectionUtils.assertPropertyTypeof( isToughProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    const text = new Text( naturalSelectionStrings.toughFood, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 110 // determined empirically
    } );

    const icon = new Image( shrubToughCImage, { scale: 0.2 } );

    const labelNode = new AlignBox( new HBox( {
      children: [ text, icon ],
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING
    } ), {
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

    super( content, isToughProperty, options );
  }
}

naturalSelection.register( 'ToughFoodCheckbox', ToughFoodCheckbox );
export default ToughFoodCheckbox;