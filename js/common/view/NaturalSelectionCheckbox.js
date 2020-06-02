// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionCheckbox is the checkbox subclass used throughout this sim.
 * It styles the checkbox for this sim (via options).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class NaturalSelectionCheckbox extends Checkbox {

  /**
   * @param {Node} content
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   */
  constructor( content, property, options ) {

    options = merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

    super( content, property, options );
  }
}

naturalSelection.register( 'NaturalSelectionCheckbox', NaturalSelectionCheckbox );
export default NaturalSelectionCheckbox;