// Copyright 2019-2022, University of Colorado Boulder

/**
 * PopulationLegendCheckbox is a checkbox in the control panel for the Population graph.
 * It serves as a legend (shows the color and line style used for a plot) and controls visibility of a plot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import { optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { AlignBox, AlignGroup, HBox, Line, TColor, Text } from '../../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../../sun/js/Checkbox.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

// constants
const LINE_DASH = NaturalSelectionConstants.POPULATION_MUTANT_LINE_DASH;

// Compute line length so that we have uniform dash length
assert && assert( LINE_DASH.length === 2, 'unsupported LINE_DASH' );
const NUMBER_OF_DASHES = 5;
const LINE_LENGTH = NUMBER_OF_DASHES * LINE_DASH[ 0 ] + ( NUMBER_OF_DASHES - 1 ) * LINE_DASH[ 1 ];

type SelfOptions = {
  lineColor?: TColor;
  isLineDashed?: boolean;
};

export type PopulationLegendCheckboxOptions = SelfOptions & PickRequired<CheckboxOptions, 'tandem'>;

export default class PopulationLegendCheckbox extends Checkbox {

  /**
   * @param plotVisibleProperty - visibility of the associated plot on the Population graph
   * @param labelStringProperty - the label on the checkbox
   * @param contentAlignGroup - to make all checkbox content have the same effective size
   * @param [providedOptions]
   */
  public constructor( plotVisibleProperty: Property<boolean>,
                      labelStringProperty: TReadOnlyProperty<string>,
                      contentAlignGroup: AlignGroup,
                      providedOptions: PopulationLegendCheckboxOptions ) {

    const options = optionize4<PopulationLegendCheckboxOptions, SelfOptions, CheckboxOptions>()(
      {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
        lineColor: 'black',
        isLineDashed: false
      }, providedOptions );

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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'PopulationLegendCheckbox', PopulationLegendCheckbox );