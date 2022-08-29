// Copyright 2019-2022, University of Colorado Boulder

/**
 * PopulationPanel is the panel that contains controls for the 'Population' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import { AlignBox, AlignGroup, Text, VBox } from '../../../../../scenery/js/imports.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import HSeparator from '../../../../../sun/js/HSeparator.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import Gene from '../../model/Gene.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionPanel from '../NaturalSelectionPanel.js';
import PopulationAlleleCheckbox from './PopulationAlleleCheckbox.js';
import PopulationLegendCheckbox from './PopulationLegendCheckbox.js';

class PopulationPanel extends NaturalSelectionPanel {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {

    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const furGene = populationModel.genePool.furGene;
    const earsGene = populationModel.genePool.earsGene;
    const teethGene = populationModel.genePool.teethGene;

    // To make the content for all checkboxes have the same dimensions.
    const alignGroup = new AlignGroup();

    // Total checkbox
    const totalCheckbox =
      new PopulationLegendCheckbox( populationModel.totalVisibleProperty, naturalSelectionStrings.totalStringProperty, alignGroup, {
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
    const yDilation = NaturalSelectionConstants.VBOX_OPTIONS.spacing / 2;
    checkboxes.forEach( checkbox => {
      checkbox.touchArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
      checkbox.mouseArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
    } );

    const checkboxesVBox = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: checkboxes
    } ) );

    const separator = new HSeparator( options.fixedWidth - 2 * options.xMargin, {
      stroke: NaturalSelectionColors.SEPARATOR_STROKE,
      tandem: options.tandem.createTandem( 'separator' )
    } );

    // Data Probe checkbox
    const dataProbeCheckboxLabel = new Text( naturalSelectionStrings.dataProbeStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 135 // determined empirically
    } );
    const dataProbeCheckboxContent = new AlignBox( dataProbeCheckboxLabel, {
      group: alignGroup,
      xAlign: 'left'
    } );
    const dataProbeCheckbox = new Checkbox( populationModel.dataProbe.visibleProperty, dataProbeCheckboxContent, merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
      tandem: options.tandem.createTandem( 'dataProbeCheckbox' )
    } ) );
    dataProbeCheckbox.touchArea = dataProbeCheckbox.localBounds.dilatedXY( xDilation, yDilation );
    dataProbeCheckbox.mouseArea = dataProbeCheckbox.localBounds.dilatedXY( xDilation, yDilation );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [
        checkboxesVBox,
        separator,
        dataProbeCheckbox
      ]
    } ) );

    super( content, options );

    // @private {PopulationAlleleCheckbox[]}
    this.alleleCheckboxes = alleleCheckboxes;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   * @param {Gene} gene
   * @param {boolean} visible
   * @public
   */
  setGeneVisible( gene, visible ) {
    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && assert( typeof visible === 'boolean', 'invalid visible' );

    // Checkbox for the normal allele
    const normalCheckbox = _.find( this.alleleCheckboxes, checkbox => ( checkbox.allele === gene.normalAllele ) );
    assert && assert( normalCheckbox, `normalCheckbox not found for ${gene.normalAllele.nameProperty.value} allele` );
    normalCheckbox.visible = visible;

    // Checkbox for the mutant allele
    const mutantCheckbox = _.find( this.alleleCheckboxes, checkbox => ( checkbox.allele === gene.mutantAllele ) );
    assert && assert( normalCheckbox, `mutantCheckbox not found for ${gene.mutantAllele.nameProperty.value} allele` );
    mutantCheckbox.visible = visible;
  }
}

naturalSelection.register( 'PopulationPanel', PopulationPanel );
export default PopulationPanel;