// Copyright 2019, University of Colorado Boulder

/**
 * PopulationLegendCheckbox is a checkbox in the control panel for the Population graph.
 * It serves as a legend (showing the color and line style) and a means of controlling visibility (checkbox).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

class PopulationLegendCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} property
   * @param {string} labelString
   * @param {Object} [options]
   */
  constructor( property, labelString, options ) {

    options = merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
      color: 'white',
      isMutation: false
    }, options );

    const lineNode = new Line( 0, 0, 28, 0, {
      stroke: options.color,
      lineWidth: 3,
      lineDash: options.isMutation ? [ 3, 3 ] : []  // mutations use a dashed line
    } );

    const textNode = new Text( labelString, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 105 // determined empirically
    } );

    const content = new HBox( {
      spacing: 5,
      children: [ lineNode, textNode ]
    } );

    super( content, property, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'PopulationLegendCheckbox does not support dispose' );
  }
}

naturalSelection.register( 'PopulationLegendCheckbox', PopulationLegendCheckbox );
export default PopulationLegendCheckbox;