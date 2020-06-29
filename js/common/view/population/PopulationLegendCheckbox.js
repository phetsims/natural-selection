// Copyright 2019-2020, University of Colorado Boulder

/**
 * PopulationLegendCheckbox is a checkbox in the control panel for the Population graph.
 * It serves as a legend (showing the color and line style) and a means of controlling visibility (checkbox).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionCheckbox from '../NaturalSelectionCheckbox.js';

// constants
const LINE_DASH = NaturalSelectionConstants.POPULATION_MUTANT_LINE_DASH;

// Compute line length so that we have uniform dash length
assert && assert( LINE_DASH.length === 2, 'unsupported LINE_DASH' );
const NUMBER_OF_DASHES = 5;
const LINE_LENGTH = NUMBER_OF_DASHES * LINE_DASH[ 0 ] + ( NUMBER_OF_DASHES - 1 ) * LINE_DASH[ 1 ];

class PopulationLegendCheckbox extends NaturalSelectionCheckbox {

  /**
   * @param {Property.<boolean>} plotVisibleProperty - Property to show/hide the associated plot on the Population graph
   * @param {string} name - the allele name
   * @param {Object} [options]
   */
  constructor( plotVisibleProperty, name, options ) {

    assert && AssertUtils.assertPropertyOf( plotVisibleProperty, 'boolean' );
    assert && assert( typeof name === 'string', 'invalid name' );

    options = merge( {
      color: 'white',
      isMutant: false // true = mutant allele, false = normal allele
    }, options );

    // solid or dashed line
    const lineNode = new Line( 0, 0, LINE_LENGTH, 0, {
      stroke: options.color,
      lineWidth: 3,
      lineDash: options.isMutant ? LINE_DASH : []  // mutations use a dashed line
    } );

    // allele name
    const nameNode = new Text( name, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100 // determined empirically
    } );

    const content = new HBox( {
      spacing: 5,
      children: [ lineNode, nameNode ]
    } );

    super( content, plotVisibleProperty, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'PopulationLegendCheckbox', PopulationLegendCheckbox );
export default PopulationLegendCheckbox;