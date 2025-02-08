// Copyright 2019-2025, University of Colorado Boulder

/**
 * AllelesPanel is the panel that contains controls for showing alleles in the 'Pedigree' graph.
 * Each row in the panel corresponds to one gene.  Until a gene has mutated, its row is disabled,
 * because a gene pair cannot be abbreviated until a dominance relationship exists, and a dominance
 * relationship does not exist until both the normal and mutant alleles exist in the population.
 * When a row is enabled, it shows the icon and abbreviation for the normal allele and the mutant allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import optionize, { combineOptions, EmptySelfOptions, optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox, { AlignBoxOptions } from '../../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../../scenery/js/nodes/HStrut.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../../sun/js/Panel.js';
import isSettingPhetioStateProperty from '../../../../../tandem/js/isSettingPhetioStateProperty.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import Gene from '../../model/Gene.js';
import GenePool from '../../model/GenePool.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import AlleleNode from './AlleleNode.js';

type SelfOptions = {
  fixedWidth: number; // fixed width of the panel
};

type AllelesPanelOptions = SelfOptions & PickRequired<PanelOptions, 'maxHeight' | 'tandem'>;

export default class AllelesPanel extends Panel {

  private readonly rows: Row[];

  public constructor( genePool: GenePool,
                      furAllelesVisibleProperty: Property<boolean>,
                      earsAllelesVisibleProperty: Property<boolean>,
                      teethAllelesVisibleProperty: Property<boolean>,
                      providedOptions: AllelesPanelOptions ) {

    const options = optionize4<AllelesPanelOptions, SelfOptions, PanelOptions>()(
      {}, NaturalSelectionConstants.PANEL_OPTIONS, {

        // NaturalSelectionPanelOptions
        visiblePropertyOptions: {
          phetioFeatured: true
        },
        phetioDocumentation: 'Note that if query parameter allelesVisible=false is specified, this panel will be ' +
                             'created but will not be added to the UI. It will appear in the API and Studio tree, ' +
                             'but changes to its elements and metadata will have no affect.'
      }, providedOptions );

    // To make the abbreviation + icon for all alleles the same effective size
    const alleleAlignGroup = new AlignGroup();

    // Alleles - title is plural, since we're always showing at least 2 alleles
    const titleText = new Text( NaturalSelectionStrings.allelesStringProperty, {
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 125 // determined empirically
    } );

    // A row for each gene
    const furRow = new Row( genePool.furGene, furAllelesVisibleProperty, alleleAlignGroup, {
      tandem: options.tandem.createTandem( 'furRow' )
    } );
    const earsRow = new Row( genePool.earsGene, earsAllelesVisibleProperty, alleleAlignGroup, {
      tandem: options.tandem.createTandem( 'earsRow' )
    } );
    const teethRow = new Row( genePool.teethGene, teethAllelesVisibleProperty, alleleAlignGroup, {
      tandem: options.tandem.createTandem( 'teethRow' )
    } );
    const rows = [ furRow, earsRow, teethRow ];

    const contentWidth = options.fixedWidth - 2 * options.xMargin;
    const content = new VBox( combineOptions<VBoxOptions>( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      spacing: 28,
      children: [ titleText, ...rows ],
      stretch: true,
      minContentWidth: contentWidth,
      preferredWidth: contentWidth // use preferred with because maxWidth fails with listenerOrder=random, see https://github.com/phetsims/natural-selection/issues/363
    } ) );

    super( content, options );

    this.rows = rows;
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {
    const row = _.find( this.rows, row => ( row.gene === gene ) )!;
    assert && assert( row, `row not found for ${gene.nameProperty.value} gene` );
    row.visible = visible;
  }
}

/**
 * Row is a row in AllelesPanel.
 *
 * Each row has a checkbox for showing allele abbreviations in the Pedigree graph, and icons that indicate the
 * phenotype for each abbreviation (e.g. 'F' <white fur icon>  'f' <brown fur icon>).  A row is hidden until
 * its corresponding mutation has been applied.
 */

type RowSelfOptions = EmptySelfOptions;

type RowOptions = RowSelfOptions & PickRequired<VBoxOptions, 'tandem'>;

class Row extends VBox {

  public readonly gene: Gene;

  public constructor( gene: Gene, visibleProperty: Property<boolean>, alignGroup: AlignGroup, providedOptions: RowOptions ) {

    const options = optionize<RowOptions, RowSelfOptions, VBoxOptions>()( {

      // VBoxOptions
      align: 'left',
      spacing: 8,
      excludeInvisibleChildrenFromBounds: false,
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      isDisposable: false
    }, providedOptions );

    const text = new Text( gene.nameProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100 // determined empirically
    } );

    const checkbox = new Checkbox( visibleProperty, text,
      combineOptions<CheckboxOptions>( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'checkbox' ),
        phetioVisiblePropertyInstrumented: false // see https://github.com/phetsims/natural-selection/issues/344
      } ) );
    const xDilation = 8;
    const yDilation = 8;
    checkbox.localBoundsProperty.link( localBounds => {
      checkbox.touchArea = localBounds.dilatedXY( xDilation, yDilation );
      checkbox.mouseArea = localBounds.dilatedXY( xDilation, yDilation );
    } );

    // Dominant allele
    const dominantAlleleNode = new AlleleNode( gene.dominantAbbreviationTranslatedProperty, gene.normalAllele.image, {
      tandem: options.tandem.createTandem( 'dominantAlleleNode' )
    } );

    // Recessive allele
    const recessiveAlleleNode = new AlleleNode( gene.recessiveAbbreviationTranslatedProperty, gene.mutantAllele.image, {
      tandem: options.tandem.createTandem( 'recessiveAlleleNode' )
    } );

    const alignBoxOptions: AlignBoxOptions = {
      group: alignGroup,
      xAlign: 'left'
    };

    // Dominant allele on the left, recessive on the right, to match 'Add Mutations' panel
    const hBox = new HBox( {
      spacing: 0,
      children: [
        new HStrut( 8 ), // indent
        new HBox( {
          spacing: 12,
          children: [
            new AlignBox( dominantAlleleNode, alignBoxOptions ),
            new AlignBox( recessiveAlleleNode, alignBoxOptions )
          ]
        } )
      ]
    } );

    options.children = [ checkbox, hBox ];

    super( options );

    if ( NaturalSelectionQueryParameters.allelesVisible ) {

      // unlink is not necessary.
      gene.dominantAlleleProperty.link( dominantAllele => {

        const hasMutation = !!dominantAllele;

        // Disable the checkbox when there is no mutation
        checkbox.enabled = hasMutation;

        // Don't show allele abbreviation and icon when there is no mutation
        hBox.visible = hasMutation;

        // Automatically make the alleles visible.
        // Corresponding alleles should not be visible when the row is disabled.
        // Do not do this when restoring PhET-iO state, see https://github.com/phetsims/natural-selection/issues/314.
        if ( !isSettingPhetioStateProperty.value ) {
          visibleProperty.value = hasMutation;
        }

        if ( dominantAllele ) {

          // Show the correct allele icons for dominant vs recessive
          const mutantIsDominant = ( dominantAllele === gene.mutantAllele );
          dominantAlleleNode.image = mutantIsDominant ? gene.mutantAllele.image : gene.normalAllele.image;
          recessiveAlleleNode.image = mutantIsDominant ? gene.normalAllele.image : gene.mutantAllele.image;
        }
      } );
    }

    this.gene = gene;
  }
}

naturalSelection.register( 'AllelesPanel', AllelesPanel );