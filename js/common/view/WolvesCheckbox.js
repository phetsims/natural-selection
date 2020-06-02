// Copyright 2019-2020, University of Colorado Boulder

/**
 * WolvesCheckbox is a checkbox for enabling the 'Wolves' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import wolfImage from '../../../images/wolf_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import GenerationClockNode from './GenerationClockNode.js';
import NaturalSelectionCheckbox from './NaturalSelectionCheckbox.js';

class WolvesCheckbox extends NaturalSelectionCheckbox {

  /**
   * @param {Property.<boolean>} wolvesEnabledProperty
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( wolvesEnabledProperty, alignGroup, options ) {

    assert && NaturalSelectionUtils.assertPropertyTypeof( wolvesEnabledProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    const text = new Text( naturalSelectionStrings.wolves, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 110 // determined empirically
    } );

    const icon = new Image( wolfImage );
    const scale = 0.064;
    icon.setScaleMagnitude( -scale, scale );

    const labelNode = new AlignBox( new HBox( {
      children: [ text, icon ],
      spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING
    } ), {
      group: alignGroup,
        xAlign: 'left'
    } );

    const clockSliceNode = GenerationClockNode.createSliceIcon( NaturalSelectionConstants.CLOCK_WOLVES_SLICE_RANGE, {
      sliceFill: NaturalSelectionColors.CLOCK_WOLVES_SLICE_COLOR
    } );

    const content = new HBox( {
      spacing: 2 * NaturalSelectionConstants.CHECKBOX_X_SPACING,
      children: [ labelNode, clockSliceNode ]
    } );

    super( content, wolvesEnabledProperty, options );
  }
}

naturalSelection.register( 'WolvesCheckbox', WolvesCheckbox );
export default WolvesCheckbox;