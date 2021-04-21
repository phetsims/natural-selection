// Copyright 2021, University of Colorado Boulder

/**
 * PopulationLegendCheckbox is a checkbox in the control panel for the Population graph.
 * It serves as a legend (shows the color and line style used for a plot) and controls visibility of a plot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import AlignBox from '../../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

// constants
const LINE_DASH = NaturalSelectionConstants.POPULATION_MUTANT_LINE_DASH;

// Compute line length so that we have uniform dash length
assert && assert( LINE_DASH.length === 2, 'unsupported LINE_DASH' );
const NUMBER_OF_DASHES = 5;
const LINE_LENGTH = NUMBER_OF_DASHES * LINE_DASH[ 0 ] + ( NUMBER_OF_DASHES - 1 ) * LINE_DASH[ 1 ];

class PopulationLegendCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} plotVisibleProperty - visibility of the associated plot on the Population graph
   * @param {string} labelString - the label on the checkbox
   * @param {AlignGroup} contentAlignGroup - to make all checkbox content have the same effective size
   * @param {Object} [options]
   */
  constructor( plotVisibleProperty, labelString, contentAlignGroup, options ) {

    assert && AssertUtils.assertPropertyOf( plotVisibleProperty, 'boolean' );
    assert && assert( typeof labelString === 'string', 'invalid labelString' );

    options = merge( {
      lineColor: 'black',
      isLineDashed: false
    }, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

    // solid or dashed line
    const lineNode = new Line( 0, 0, LINE_LENGTH, 0, {
      lineWidth: 3,
      stroke: options.lineColor,
      lineDash: ( options.isLineDashed ? LINE_DASH : [] )
    } );

    // text label
    const labelNode = new Text( labelString, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100 // determined empirically
    } );

    const hBox = new HBox( {
      spacing: 5,
      children: [ lineNode, labelNode ]
    } );

    const content = new AlignBox( hBox, {
      group: contentAlignGroup,
      xAlign: 'left'
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