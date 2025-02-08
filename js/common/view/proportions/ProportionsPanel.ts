// Copyright 2019-2025, University of Colorado Boulder

/**
 * ProportionsPanel is the panel that contains controls for the 'Proportions' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import { combineOptions, optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import HSeparator from '../../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../../sun/js/Panel.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import Gene from '../../model/Gene.js';
import GenePool from '../../model/GenePool.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import ProportionsLegendNode from './ProportionsLegendNode.js';

type SelfOptions = {
  fixedWidth: number; // fixed width of the panel
};

type ProportionsPanelOptions = SelfOptions & PickRequired<PanelOptions, 'maxHeight' | 'tandem'>;

export default class ProportionsPanel extends Panel {

  private readonly legendNode: ProportionsLegendNode;

  public constructor( genePool: GenePool, valuesVisibleProperty: Property<boolean>, providedOptions: ProportionsPanelOptions ) {

    const options = optionize4<ProportionsPanelOptions, SelfOptions, PanelOptions>()(
      {}, NaturalSelectionConstants.PANEL_OPTIONS, {

        // NaturalSelectionPanelOptions
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      }, providedOptions );

    const legendNode = new ProportionsLegendNode( genePool, {
      tandem: options.tandem.createTandem( 'legendNode' )
    } );

    const separator = new HSeparator( {
      stroke: NaturalSelectionColors.SEPARATOR_STROKE
    } );

    // Values checkbox, shows/hides values on the bars
    const valuesCheckboxLabelText = new Text( NaturalSelectionStrings.valuesStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100 // determined empirically
    } );
    const valuesCheckbox = new Checkbox( valuesVisibleProperty, valuesCheckboxLabelText,
      combineOptions<CheckboxOptions>( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'valuesCheckbox' )
      } ) );
    const xDilation = 8;
    const yDilation = 6;
    valuesCheckbox.localBoundsProperty.link( localBounds => {
      valuesCheckbox.touchArea = valuesCheckbox.localBounds.dilatedXY( xDilation, yDilation );
      valuesCheckbox.mouseArea = valuesCheckbox.localBounds.dilatedXY( xDilation, yDilation );
    } );

    const contentWidth = options.fixedWidth - 2 * options.xMargin;
    const content = new VBox( combineOptions<VBoxOptions>( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [
        legendNode,
        separator,
        valuesCheckbox
      ],

      // Content has a fixed width.
      stretch: true,
      minContentWidth: contentWidth,
      maxWidth: contentWidth
    } ) );

    super( content, options );

    this.legendNode = legendNode;
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {
    this.legendNode.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'ProportionsPanel', ProportionsPanel );