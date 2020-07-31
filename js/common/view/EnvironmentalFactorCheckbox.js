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
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import GenerationClockNode from './GenerationClockNode.js';

// constants
const DEFAULT_CLOCK_SLICE_RANGE = new Range( 0, 1 );

class EnvironmentalFactorCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} enabledProperty - whether the environmental factor is enabled
   * @param {Node} labelNode - the label that appears to the right of the box
   * @param {AlignGroup} alignGroup - sets the effective size of labelNode
   * @param {Object} [options]
   */
  constructor( enabledProperty, labelNode, alignGroup, options ) {

    assert && AssertUtils.assertPropertyOf( enabledProperty, 'boolean' );
    assert && assert( labelNode instanceof Node, 'invalid labelNode' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    options = merge( {
      clockSliceRange: DEFAULT_CLOCK_SLICE_RANGE, // {Range}
      clockSliceColor: 'black'
    }, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

    const alignBox = new AlignBox( labelNode, {
      group: alignGroup,
      xAlign: 'left'
    } );

    const clockSliceNode = GenerationClockNode.createSliceIcon( options.clockSliceRange, options.clockSliceColor );

    const content = new HBox( {
      spacing: 2 * NaturalSelectionConstants.CHECKBOX_X_SPACING,
      children: [ alignBox, clockSliceNode ]
    } );

    super( content, enabledProperty, options );

    // So that pointer areas will be shown with ?showPointerAreas
    this.touchArea = this.localBounds.dilated( 0 );
    this.mouseArea = this.localBounds.dilated( 0 );
  }
}

naturalSelection.register( 'EnvironmentalFactorCheckbox', EnvironmentalFactorCheckbox );
export default EnvironmentalFactorCheckbox;