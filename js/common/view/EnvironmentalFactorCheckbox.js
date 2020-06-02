// Copyright 2020, University of Colorado Boulder

/**
 * EnvironmentalFactorCheckbox is the base class for all checkboxes in the 'Environmental Factors' panel.
 * It makes all checkbox labels have the same effective size. And it adds a generation-clock icon to the right of
 * the checkbox's label, to signify which slice of the generation clock corresponds to the time during which the
 * environmental factor will be applied.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ColorDef from '../../../../scenery/js/util/ColorDef.js';
import naturalSelection from '../../naturalSelection.js';
import AssertUtils from '../AssertUtils.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import GenerationClockNode from './GenerationClockNode.js';
import NaturalSelectionCheckbox from './NaturalSelectionCheckbox.js';

class EnvironmentalFactorCheckbox extends NaturalSelectionCheckbox {

  /**
   * @param {Node} labelNode - the label that appears to the right of the box
   * @param {Property.<boolean>} enabledProperty - whether the environmental factor is enabled
   * @param {AlignGroup} alignGroup - set the effective size of labelNode
   * @param {Range} clockSliceRange - slice of the generation clock during which this environmental factor is applied
   * @param {ColorDef} clockSliceColor - generation clock color coding for this environmental factor
   * @param {Object} [options]
   */
  constructor( labelNode, enabledProperty, alignGroup, clockSliceRange, clockSliceColor, options ) {

    assert && assert( labelNode instanceof Node, 'invalid labelNode' );
    assert && AssertUtils.assertPropertyTypeof( enabledProperty, 'boolean' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );
    assert && assert( clockSliceRange instanceof Range, 'invalid clockSliceRange' );
    assert && assert( ColorDef.isColorDef( clockSliceColor ), 'invalid clockSliceColor' );
    assert && AssertUtils.assertPropertyTypeof( enabledProperty, 'boolean' );

    const alignBox = new AlignBox( labelNode, {
      group: alignGroup,
      xAlign: 'left'
    } );

    const clockSliceNode = GenerationClockNode.createSliceIcon( clockSliceRange, {
      sliceFill: clockSliceColor
    } );

    const content = new HBox( {
      spacing: 2 * NaturalSelectionConstants.CHECKBOX_X_SPACING,
      children: [ alignBox, clockSliceNode ]
    } );

    super( content, enabledProperty, options );
  }
}

naturalSelection.register( 'EnvironmentalFactorCheckbox', EnvironmentalFactorCheckbox );
export default EnvironmentalFactorCheckbox;