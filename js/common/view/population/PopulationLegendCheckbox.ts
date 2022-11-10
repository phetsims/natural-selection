// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * PopulationLegendCheckbox is a checkbox in the control panel for the Population graph.
 * It serves as a legend (shows the color and line style used for a plot) and controls visibility of a plot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import { AlignBox, HBox, Line, Text } from '../../../../../scenery/js/imports.js';
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
   * @param {TReadOnlyProperty.<string>} labelStringProperty - the label on the checkbox
   * @param {AlignGroup} contentAlignGroup - to make all checkbox content have the same effective size
   * @param {Object} [options]
   */
  constructor( plotVisibleProperty, labelStringProperty, contentAlignGroup, options ) {

    assert && AssertUtils.assertPropertyOf( plotVisibleProperty, 'boolean' );
    assert && assert( labelStringProperty instanceof ReadOnlyProperty, 'invalid labelStringProperty' );

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
    const labelText = new Text( labelStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100, // determined empirically
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const hBox = new HBox( {
      spacing: 5,
      children: [ lineNode, labelText ]
    } );

    const content = new AlignBox( hBox, {
      group: contentAlignGroup,
      xAlign: 'left'
    } );

    super( plotVisibleProperty, content, options );
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