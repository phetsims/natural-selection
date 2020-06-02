// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionCheckbox is the checkbox subclass used throughout this sim.
 * In addition to styling the checkbox for this sim (via options), it provides an optional AlignGroup for its label,
 * which can be used to make a set of checkboxes all have the same effective size.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class NaturalSelectionCheckbox extends Checkbox {

  /**
   * @param {Node} labelNode
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   */
  constructor( labelNode, property, options ) {

    options = merge( {
      labelAlignGroup: null // {AlignGroup|null},
    }, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

    const content = options.labelAlignGroup ?
                    new AlignBox( labelNode, {
                      group: options.labelAlignGroup,
                      xAlign: 'left'
                    } ) :
                    labelNode;

    super( content, property, options );
  }
}

naturalSelection.register( 'NaturalSelectionCheckbox', NaturalSelectionCheckbox );
export default NaturalSelectionCheckbox;