// Copyright 2019-2023, University of Colorado Boulder

/**
 * ProportionsPanel is the panel that contains controls for the 'Proportions' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import { combineOptions, EmptySelfOptions, optionize4 } from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import { HSeparator, Text, VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../../sun/js/Checkbox.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import GenePool from '../../model/GenePool.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionPanel, { NaturalSelectionPanelOptions } from '../NaturalSelectionPanel.js';
import ProportionsLegendNode from './ProportionsLegendNode.js';
import Gene from '../../model/Gene.js';

type SelfOptions = EmptySelfOptions;

type ProportionsPanelOptions = SelfOptions & NaturalSelectionPanelOptions;

export default class ProportionsPanel extends NaturalSelectionPanel {

  private readonly legendNode: ProportionsLegendNode;

  public constructor( genePool: GenePool, valuesVisibleProperty: Property<boolean>, providedOptions: ProportionsPanelOptions ) {

    const options = optionize4<ProportionsPanelOptions, SelfOptions, StrictOmit<NaturalSelectionPanelOptions, 'tandem'>>()(
      {}, NaturalSelectionConstants.PANEL_OPTIONS, {

        // NaturalSelectionPanelOptions
        fixedWidth: 100
      }, providedOptions );

    const legendNode = new ProportionsLegendNode( genePool, {
      tandem: options.tandem.createTandem( 'legendNode' )
    } );

    const separator = new HSeparator( {
      stroke: NaturalSelectionColors.SEPARATOR_STROKE
    } );

    // Values checkbox, shows/hides values on the bars
    const valuesCheckboxTandem = options.tandem.createTandem( 'valuesCheckbox' );
    const valuesCheckboxLabelText = new Text( NaturalSelectionStrings.valuesStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100, // determined empirically
      tandem: valuesCheckboxTandem.createTandem( 'labelText' )
    } );
    const valuesCheckbox = new Checkbox( valuesVisibleProperty, valuesCheckboxLabelText,
      combineOptions<CheckboxOptions>( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
        tandem: valuesCheckboxTandem
      } ) );
    const xDilation = 8;
    const yDilation = 6;
    valuesCheckbox.touchArea = valuesCheckbox.localBounds.dilatedXY( xDilation, yDilation );
    valuesCheckbox.mouseArea = valuesCheckbox.localBounds.dilatedXY( xDilation, yDilation );

    const content = new VBox( combineOptions<VBoxOptions>( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      preferredWidth: options.fixedWidth! - ( 2 * options.xMargin ),
      widthSizable: false,
      children: [
        legendNode,
        separator,
        valuesCheckbox
      ]
    } ) );

    super( content, options );

    this.legendNode = legendNode;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {
    this.legendNode.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'ProportionsPanel', ProportionsPanel );