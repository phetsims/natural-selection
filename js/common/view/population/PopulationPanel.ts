// Copyright 2019-2025, University of Colorado Boulder

/**
 * PopulationPanel is the panel that contains controls for the 'Population' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions, optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../../scenery/js/layout/nodes/AlignBox.js';
import HSeparator from '../../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../../sun/js/Panel.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import Gene from '../../model/Gene.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import PopulationAlleleCheckbox from './PopulationAlleleCheckbox.js';
import PopulationLegendCheckbox from './PopulationLegendCheckbox.js';

type SelfOptions = {
  fixedWidth: number; // fixed width of the panel
};

type PopulationPanelOptions = SelfOptions & PickRequired<PanelOptions, 'maxHeight' | 'tandem'>;

export default class PopulationPanel extends Panel {

  private readonly alleleCheckboxes: PopulationAlleleCheckbox[];

  public constructor( populationModel: PopulationModel, providedOptions?: PopulationPanelOptions ) {

    const options = optionize4<PopulationPanelOptions, SelfOptions, PanelOptions>()(
      {}, NaturalSelectionConstants.PANEL_OPTIONS, {

        // NaturalSelectionPanelOptions
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      }, providedOptions );

    const furGene = populationModel.genePool.furGene;
    const earsGene = populationModel.genePool.earsGene;
    const teethGene = populationModel.genePool.teethGene;

    // To make the content for all checkboxes have the same dimensions.
    const alignGroup = new AlignGroup();

    // Total checkbox
    const totalCheckbox =
      new PopulationLegendCheckbox( populationModel.totalVisibleProperty, NaturalSelectionStrings.totalStringProperty, alignGroup, {
        lineColor: NaturalSelectionColors.POPULATION_TOTAL_COUNT,
        tandem: options.tandem.createTandem( 'totalCheckbox' )
      } );

    // A checkbox for each allele, with dashed lines for mutant alleles.
    const whiteFurCheckbox =
      new PopulationAlleleCheckbox( populationModel.whiteFurVisibleProperty, furGene.normalAllele, alignGroup, {
        lineColor: furGene.color,
        tandem: options.tandem.createTandem( 'whiteFurCheckbox' )
      } );

    const brownFurCheckbox =
      new PopulationAlleleCheckbox( populationModel.brownFurVisibleProperty, furGene.mutantAllele, alignGroup, {
        lineColor: furGene.color,
        isLineDashed: true,
        tandem: options.tandem.createTandem( 'brownFurCheckbox' )
      } );

    const straightEarsCheckbox =
      new PopulationAlleleCheckbox( populationModel.straightEarsVisibleProperty, earsGene.normalAllele, alignGroup, {
        lineColor: earsGene.color,
        tandem: options.tandem.createTandem( 'straightEarsCheckbox' )
      } );

    const floppyEarsCheckbox =
      new PopulationAlleleCheckbox( populationModel.floppyEarsVisibleProperty, earsGene.mutantAllele, alignGroup, {
        lineColor: earsGene.color,
        isLineDashed: true,
        tandem: options.tandem.createTandem( 'floppyEarsCheckbox' )
      } );

    const shortTeethCheckbox =
      new PopulationAlleleCheckbox( populationModel.shortTeethVisibleProperty, teethGene.normalAllele, alignGroup, {
        lineColor: teethGene.color,
        tandem: options.tandem.createTandem( 'shortTeethCheckbox' )
      } );

    const longTeethCheckbox =
      new PopulationAlleleCheckbox( populationModel.longTeethVisibleProperty, teethGene.mutantAllele, alignGroup, {
        lineColor: teethGene.color,
        isLineDashed: true,
        tandem: options.tandem.createTandem( 'longTeethCheckbox' )
      } );

    // {PopulationAlleleCheckbox[]}
    const alleleCheckboxes = [
      whiteFurCheckbox,
      brownFurCheckbox,
      straightEarsCheckbox,
      floppyEarsCheckbox,
      shortTeethCheckbox,
      longTeethCheckbox
    ];

    // {Checkbox[]}
    const checkboxes = [ totalCheckbox, ...alleleCheckboxes ];

    // Dilate the pointer areas to fill vertical space between the checkboxes.
    // See https://github.com/phetsims/natural-selection/issues/173
    const xDilation = 8;
    const yDilation = NaturalSelectionConstants.VBOX_OPTIONS.spacing! / 2;
    checkboxes.forEach( checkbox => {
      checkbox.localBoundsProperty.link( localBounds => {
        checkbox.touchArea = localBounds.dilatedXY( xDilation, yDilation );
        checkbox.mouseArea = localBounds.dilatedXY( xDilation, yDilation );
      } );
    } );

    const checkboxesVBox = new VBox( combineOptions<VBoxOptions>( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: checkboxes
    } ) );

    const separator = new HSeparator( {
      stroke: NaturalSelectionColors.SEPARATOR_STROKE
    } );

    // Data Probe checkbox
    const labelText = new Text( NaturalSelectionStrings.dataProbeStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 135 // determined empirically
    } );
    const dataProbeCheckboxContent = new AlignBox( labelText, {
      group: alignGroup,
      xAlign: 'left'
    } );
    const dataProbeCheckbox = new Checkbox( populationModel.dataProbe.visibleProperty, dataProbeCheckboxContent,
      combineOptions<CheckboxOptions>( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'dataProbeCheckbox' )
      } ) );
    dataProbeCheckbox.localBoundsProperty.link( localBounds => {
      dataProbeCheckbox.touchArea = localBounds.dilatedXY( xDilation, yDilation );
      dataProbeCheckbox.mouseArea = localBounds.dilatedXY( xDilation, yDilation );
    } );

    const contentWidth = options.fixedWidth - 2 * options.xMargin;
    const content = new VBox( combineOptions<VBoxOptions>( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      stretch: true,
      minContentWidth: contentWidth,
      maxWidth: contentWidth,
      children: [
        checkboxesVBox,
        separator,
        dataProbeCheckbox
      ]
    } ) );

    super( content, options );

    this.alleleCheckboxes = alleleCheckboxes;
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {

    // Checkbox for the normal allele
    const normalCheckbox = _.find( this.alleleCheckboxes, checkbox => ( checkbox.allele === gene.normalAllele ) )!;
    assert && assert( normalCheckbox, `normalCheckbox not found for ${gene.normalAllele.nameProperty.value} allele` );
    normalCheckbox.visible = visible;

    // Checkbox for the mutant allele
    const mutantCheckbox = _.find( this.alleleCheckboxes, checkbox => ( checkbox.allele === gene.mutantAllele ) )!;
    assert && assert( normalCheckbox, `mutantCheckbox not found for ${gene.mutantAllele.nameProperty.value} allele` );
    mutantCheckbox.visible = visible;
  }
}

naturalSelection.register( 'PopulationPanel', PopulationPanel );