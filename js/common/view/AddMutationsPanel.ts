// Copyright 2019-2023, University of Colorado Boulder

/**
 * AddMutationsPanel is the panel that contains controls used to add mutations. For each gene, press a push button
 * to selected whether its mutant allele will be dominant or recessive. The push button then disappears, and is
 * replaced with and icon that show which allele is dominant, and which allele is recessive.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions, optionize3 } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { AlignBox, AlignBoxOptions, AlignGroup, HBox, HBoxOptions, Image, Node, NodeOptions, Rectangle, TColor, Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import Gene from '../model/Gene.js';
import GenePool from '../model/GenePool.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import MutationIconNode from './MutationIconNode.js';
import NaturalSelectionPanel, { NaturalSelectionPanelOptions } from './NaturalSelectionPanel.js';

// constants
const COLUMN_SPACING = 8;
const BUTTON_ICON_SCALE = 0.5;
const LABEL_COLUMN_X_ALIGN = 'left';
const BUTTON_COLUMNS_X_ALIGN = 'center';
const BUTTON_CORNER_RADIUS = 4;
const NORMAL_ALLELE_LINE_DASH: number[] = [];
const MUTANT_ALLELE_LINE_DASH = [ 3, 3 ];

type SelfOptions = EmptySelfOptions;

type AddMutationsPanelOptions = SelfOptions & NaturalSelectionPanelOptions;

export default class AddMutationsPanel extends NaturalSelectionPanel {

  private readonly rows: Row[];

  public constructor( genePool: GenePool, providedOptions: AddMutationsPanelOptions ) {

    const options = optionize3<AddMutationsPanelOptions, SelfOptions, StrictOmit<NaturalSelectionPanelOptions, 'tandem'>>()(
      {}, NaturalSelectionConstants.PANEL_OPTIONS, providedOptions );

    // All allele icons have the same effective width and height.
    const iconsAlignGroup = new AlignGroup();

    // All elements in the label column (including the column heading) have the same effective width.
    const labelColumnAlignGroup = new AlignGroup( { matchVertical: false } );

    // All elements in the button columns (including column headings) have the same effective width.
    const buttonColumnsAlignGroup = new AlignGroup();

    // Individual column headings
    const mutationIconNode = new MutationIconNode();
    const dominantColumnText = new Text( NaturalSelectionStrings.dominantStringProperty, {
      font: NaturalSelectionConstants.ADD_MUTATION_COLUMN_HEADING_FONT,
      maxWidth: 60, // determined empirically
      tandem: options.tandem.createTandem( 'dominantColumnText' )
    } );
    const recessiveColumnText = new Text( NaturalSelectionStrings.recessiveStringProperty, {
      font: NaturalSelectionConstants.ADD_MUTATION_COLUMN_HEADING_FONT,
      maxWidth: 60, // determined empirically
      tandem: options.tandem.createTandem( 'recessiveColumnText' )
    } );

    // Layout of column headings
    const columnHeadingsNode = new HBox( {
      spacing: COLUMN_SPACING,
      children: [
        new AlignBox( mutationIconNode, { group: labelColumnAlignGroup, xAlign: LABEL_COLUMN_X_ALIGN } ),
        new AlignBox( dominantColumnText, { group: buttonColumnsAlignGroup, xAlign: BUTTON_COLUMNS_X_ALIGN } ),
        new AlignBox( recessiveColumnText, { group: buttonColumnsAlignGroup, xAlign: BUTTON_COLUMNS_X_ALIGN } )
      ]
    } );

    // A row for each gene
    const rows = _.map( genePool.genes, gene =>
      new Row( gene, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup, {
        tandem: options.tandem.createTandem( `${gene.tandemPrefix}Row` )
      } )
    );

    const vBox = new VBox( combineOptions<VBoxOptions>( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: rows
    } ) );

    const numberOfRowsVisibleProperty = DerivedProperty.deriveAny( rows.map( row => row.visibleProperty ),
      () => _.filter( rows, row => row.visible ).length, {
        tandem: options.tandem.createTandem( 'numberOfRowsVisibleProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'the number of rows that are visible affects whether the panel title is singular or plural'
      } );

    // title
    const titleText = new TitleNode( numberOfRowsVisibleProperty, {
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      spacing: 2,
      children: [ titleText, columnHeadingsNode, vBox ]
    } ) );

    super( content, options );

    this.rows = rows;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Gets the row that corresponds to a gene.
   */
  public getRow( gene: Gene ): Node {
    const row = _.find( this.rows, row => ( row.gene === gene ) )!;
    assert && assert( row, `row not found for ${gene.nameProperty.value} gene` );
    return row;
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {
    this.getRow( gene ).visible = visible;
  }
}

type RowSelfOptions = EmptySelfOptions;
type RowOptions = RowSelfOptions & PickRequired<HBoxOptions, 'tandem'>;

/**
 * Row is a row in the 'Add Mutations' panel.  It has a dominant and recessive button pair, used to select whether
 * the mutant allele is dominant or recessive.  Pressing one of these buttons schedules the mutation and hides the
 * buttons.  When the buttons are hidden, a pair of icons is exposed that shows which allele is dominant, and
 * which allele is recessive.
 */
class Row extends HBox {

  public readonly gene: Gene;

  /**
   * @param gene
   * @param iconsAlignGroup - sets uniform width and height for icons
   * @param labelColumnAlignGroup - sets uniform width for column that contains labels
   * @param buttonColumnsAlignGroup - sets uniform width for columns that contain buttons
   * @param [providedOptions]
   */
  public constructor( gene: Gene, iconsAlignGroup: AlignGroup, labelColumnAlignGroup: AlignGroup,
                      buttonColumnsAlignGroup: AlignGroup, providedOptions: RowOptions ) {

    const options = optionize<RowOptions, RowSelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: COLUMN_SPACING
    }, providedOptions );

    // label that indicates the gene, to the left of the push buttons
    const geneNameText = new Text( gene.nameProperty, {
      font: NaturalSelectionConstants.ADD_MUTATION_GENE_FONT,
      maxWidth: 50, // determined empirically
      tandem: options.tandem.createTandem( 'geneNameText' )
    } );
    const geneNameTextWrapper = new AlignBox( geneNameText, {
      group: labelColumnAlignGroup,
      xAlign: LABEL_COLUMN_X_ALIGN
    } );

    // dominant push button, makes the mutant allele dominant
    const dominantButton = new MutationButton( gene.mutantAllele.image, iconsAlignGroup, {
      listener: () => {
        assert && assert( !gene.dominantAlleleProperty.value, 'unexpected dominantAlleleProperty value' );
        gene.dominantAlleleProperty.value = gene.mutantAllele;
        gene.mutationComingProperty.value = true;
      },
      tandem: options.tandem.createTandem( 'dominantButton' )
    } );

    // recessive push button, makes the mutant allele recessive
    const recessiveButton = new MutationButton( gene.mutantAllele.image, iconsAlignGroup, {
      listener: () => {
        assert && assert( !gene.dominantAlleleProperty.value, 'unexpected dominantAlleleProperty value' );
        gene.dominantAlleleProperty.value = gene.normalAllele;
        gene.mutationComingProperty.value = true;
      },
      tandem: options.tandem.createTandem( 'recessiveButton' )
    } );

    const alleleIconOptions = {
      stroke: gene.color,
      width: dominantButton.width,
      height: dominantButton.height
    };

    // icon for the dominant allele
    const dominantAlleleIcon = new AlleleIcon( gene.normalAllele.image, iconsAlignGroup, alleleIconOptions );

    // icon for the recessive allele
    const recessiveAlleleIcon = new AlleleIcon( gene.normalAllele.image, iconsAlignGroup, alleleIconOptions );

    const alignBoxOptions: AlignBoxOptions = {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    };

    options.children = [
      geneNameTextWrapper,
      new Node( {
        children: [
          new AlignBox( dominantAlleleIcon, alignBoxOptions ),
          new AlignBox( dominantButton, alignBoxOptions ) ]
      } ),
      new Node( {
        children: [
          new AlignBox( recessiveAlleleIcon, alignBoxOptions ),
          new AlignBox( recessiveButton, alignBoxOptions )
        ]
      } )
    ];

    super( options );

    // unlink is not necessary.
    gene.dominantAlleleProperty.link( dominantAllele => {

      const hasDominantAllele = !!dominantAllele;

      // Show buttons or icons, depending on whether a selection has been made.
      dominantButton.visible = recessiveButton.visible = !hasDominantAllele;
      dominantAlleleIcon.visible = recessiveAlleleIcon.visible = hasDominantAllele;

      // If a selection has been made...
      if ( hasDominantAllele ) {

        const mutationIsDominant = ( dominantAllele === gene.mutantAllele );

        // Adjust the dominant icon
        dominantAlleleIcon.image = mutationIsDominant ? gene.mutantAllele.image : gene.normalAllele.image;
        dominantAlleleIcon.lineDash = mutationIsDominant ? MUTANT_ALLELE_LINE_DASH : NORMAL_ALLELE_LINE_DASH;

        // Adjust the recessive icon
        recessiveAlleleIcon.image = mutationIsDominant ? gene.normalAllele.image : gene.mutantAllele.image;
        recessiveAlleleIcon.lineDash = mutationIsDominant ? NORMAL_ALLELE_LINE_DASH : MUTANT_ALLELE_LINE_DASH;
      }
    } );

    // If a Row is made invisible via PhET-iO while a mutation is scheduled, cancel the mutation.
    // unlink is not necessary.
    this.visibleProperty.link( visible => {
      if ( !visible && gene.mutationComingProperty.value ) {
        gene.dominantAlleleProperty.value = null;
      }
    } );

    this.gene = gene;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

type MutationButtonSelfOptions = EmptySelfOptions;
type MutationButtonOptions = MutationButtonSelfOptions & PickRequired<RectangularPushButtonOptions, 'listener' | 'tandem'>;

/**
 * MutationButton is a push button used to apply a mutation.
 */
class MutationButton extends RectangularPushButton {

  /**
   * @param mutantAlleleImage - the image on the button
   * @param iconsAlignGroup - sets uniform width and height for icons
   * @param [providedOptions]
   */
  public constructor( mutantAlleleImage: HTMLImageElement, iconsAlignGroup: AlignGroup, providedOptions: MutationButtonOptions ) {

    const options = optionize<MutationButtonOptions, MutationButtonSelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      baseColor: NaturalSelectionColors.ADD_MUTATION_BUTTONS,
      cornerRadius: BUTTON_CORNER_RADIUS,
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    const imageNode = new Image( mutantAlleleImage, {
      scale: BUTTON_ICON_SCALE
    } );

    options.content = new AlignBox( imageNode, { group: iconsAlignGroup } );

    super( options );
  }
}

type AlleleIconSelfOptions = {
  width?: number;
  height?: number;
  stroke?: TColor;
};
type AlleleIconOptions = AlleleIconSelfOptions;

/**
 * AlleleIcon shows an icon that represents an allele.
 */
class AlleleIcon extends Node {

  private readonly imageNode: Image;
  private readonly outlineRectangle: Rectangle;

  /**
   * @param image - the default image on the icon
   * @param iconsAlignGroup - sets uniform width and height for icons
   * @param [providedOptions]
   */
  public constructor( image: HTMLImageElement, iconsAlignGroup: AlignGroup, providedOptions: AlleleIconOptions ) {

    const options = optionize<AlleleIconOptions, AlleleIconSelfOptions, NodeOptions>()( {

      // AlleleIconSelfOptions
      width: 100,
      height: 100,
      stroke: 'black'
    }, providedOptions );

    const imageNode = new Image( image, {
      scale: BUTTON_ICON_SCALE
    } );

    const outlineRectangle = new Rectangle( 0, 0, options.width, options.height, {
      cornerRadius: BUTTON_CORNER_RADIUS,
      stroke: options.stroke,
      lineWidth: 2
    } );

    options.children = [
      outlineRectangle,
      new AlignBox( imageNode, {
        group: iconsAlignGroup,
        center: outlineRectangle.center
      } )
    ];

    super( options );

    this.imageNode = imageNode;
    this.outlineRectangle = outlineRectangle;
  }

  /**
   * Sets the image that appears on this icon.
   */
  public set image( value: HTMLImageElement ) {
    this.imageNode.image = value;
  }

  /**
   * Sets the lineDash for the icon's outline rectangle.
   */
  public set lineDash( value: number[] ) {
    this.outlineRectangle.lineDash = value;
  }
}

type TitleNodeSelfOptions = EmptySelfOptions;
type TitleNodeOptions = TitleNodeSelfOptions & PickRequired<Text, 'tandem'>;

/**
 * TitleNode supports dynamic locale, and changes between singular/plural based on how many Rows are visible.
 */
class TitleNode extends Text {

  public constructor( numberOfRowsVisibleProperty: TReadOnlyProperty<number>, providedOptions: TitleNodeOptions ) {

    const options = optionize<TitleNodeOptions, TitleNodeSelfOptions, TextOptions>()( {

      // TextOptions
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 180 // determined empirically
    }, providedOptions );

    const stringProperty = new DerivedProperty( [
        numberOfRowsVisibleProperty,
        NaturalSelectionStrings.addMutationStringProperty,
        NaturalSelectionStrings.addMutationsStringProperty
      ],
      ( numberOfRowsVisible, addMutationString, addMutationsString ) =>
        ( numberOfRowsVisible === 1 ) ? addMutationString : addMutationsString, {
        tandem: options.tandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      } );

    super( stringProperty, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'AddMutationsPanel', AddMutationsPanel );