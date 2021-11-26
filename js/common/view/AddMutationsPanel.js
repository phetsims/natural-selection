// Copyright 2019-2020, University of Colorado Boulder

/**
 * AddMutationsPanel is the panel that contains controls used to add mutations. For each gene, press a push button
 * to selected whether its mutant allele will be dominant or recessive. The push button then disappears, and is
 * replaced with and icon that show which allele is dominant, and which allele is recessive.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignBox } from '../../../../scenery/js/imports.js';
import { AlignGroup } from '../../../../scenery/js/imports.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Image } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import Gene from '../model/Gene.js';
import GenePool from '../model/GenePool.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import MutationIconNode from './MutationIconNode.js';
import NaturalSelectionPanel from './NaturalSelectionPanel.js';

// constants
const COLUMN_SPACING = 8;
const BUTTON_ICON_SCALE = 0.5;
const LABEL_COLUMN_X_ALIGN = 'left';
const BUTTON_COLUMNS_X_ALIGN = 'center';
const BUTTON_CORNER_RADIUS = 4;
const NORMAL_ALLELE_LINE_DASH = [];
const MUTATANT_ALLELE_LINE_DASH = [ 3, 3 ];

class AddMutationsPanel extends NaturalSelectionPanel {

  /**
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( genePool, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    // All allele icons have the same effective width and height.
    const iconsAlignGroup = new AlignGroup();

    // All elements in the label column (including the column heading) have the same effective width.
    const labelColumnAlignGroup = new AlignGroup( { matchVertical: false } );

    // All elements in the button columns (including column headings) have the same effective width.
    const buttonColumnsAlignGroup = new AlignGroup();

    // title
    const titleNode = new Text( naturalSelectionStrings.addMutations, {
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'titleNode' )
    } );

    // Individual column headings
    const mutationIconNode = new MutationIconNode();
    const dominantColumnLabel = new Text( naturalSelectionStrings.dominant, {
      font: NaturalSelectionConstants.ADD_MUTATION_COLUMN_HEADING_FONT,
      maxWidth: 60 // determined empirically
    } );
    const recessiveColumnLabel = new Text( naturalSelectionStrings.recessive, {
      font: NaturalSelectionConstants.ADD_MUTATION_COLUMN_HEADING_FONT,
      maxWidth: 60 // determined empirically
    } );

    // Layout of column headings
    const columnHeadingsNode = new HBox( {
      spacing: COLUMN_SPACING,
      children: [
        new AlignBox( mutationIconNode, { group: labelColumnAlignGroup, xAlign: LABEL_COLUMN_X_ALIGN } ),
        new AlignBox( dominantColumnLabel, { group: buttonColumnsAlignGroup, xAlign: BUTTON_COLUMNS_X_ALIGN } ),
        new AlignBox( recessiveColumnLabel, { group: buttonColumnsAlignGroup, xAlign: BUTTON_COLUMNS_X_ALIGN } )
      ]
    } );

    // A row for each gene
    const rows = _.map( genePool.genes, gene =>
      new Row( gene, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup, {
        tandem: options.tandem.createTandem( `${gene.tandemPrefix}Row` )
      } )
    );

    const vBox = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: rows
    } ) );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      spacing: 2,
      children: [ titleNode, columnHeadingsNode, vBox ]
    } ) );

    super( content, options );

    // Set the panel's title to singular or plural, depending on how many rows are visible.
    // unmultilink is not necessary.
    Property.multilink( _.map( rows, row => row.visibleProperty ), () => {

      // If the title hasn't been changed to something entirely different via PhET-iO...
      if ( [ naturalSelectionStrings.addMutation, naturalSelectionStrings.addMutations ].includes( titleNode.text ) ) {
        const numberOfVisibleRows = _.filter( rows, row => row.visible ).length;
        titleNode.text = ( numberOfVisibleRows === 1 ) ?
                         naturalSelectionStrings.addMutation :
                         naturalSelectionStrings.addMutations;
      }
    } );

    // @private {Row[]}
    this.rows = rows;
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
   * Gets the row that corresponds to a gene.
   * @param {Gene} gene
   * @returns {Node}
   * @public
   */
  getRow( gene ) {
    assert && assert( gene instanceof Gene, 'invalid gene' );

    const row = _.find( this.rows, row => ( row.gene === gene ) );
    assert && assert( row, `row not found for ${gene.name} gene` );
    return row;
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

    this.getRow( gene ).visible = visible;
  }
}

/**
 * Row is a row in the 'Add Mutations' panel.  It has a dominant and recessive button pair, used to select whether
 * the mutant allele is dominant or recessive.  Pressing one of these buttons schedules the mutation and hides the
 * buttons.  When the buttons are hidden, a pair of icons is exposed that shows which allele is dominant, and
 * which allele is recessive.
 */
class Row extends HBox {

  /**
   * @param {Gene} gene
   * @param {AlignGroup} iconsAlignGroup - sets uniform width and height for icons
   * @param {AlignGroup} labelColumnAlignGroup - sets uniform width for column that contains labels
   * @param {AlignGroup} buttonColumnsAlignGroup - sets uniform width for columns that contain buttons
   * @param {Object} [options]
   */
  constructor( gene, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup, options ) {

    assert && assert( gene instanceof Gene, 'invalid Gene' );
    assert && assert( iconsAlignGroup instanceof AlignGroup, 'invalid iconsAlignGroup' );
    assert && assert( labelColumnAlignGroup instanceof AlignGroup, 'invalid labelColumnAlignGroup' );
    assert && assert( buttonColumnsAlignGroup instanceof AlignGroup, 'invalid buttonColumnsAlignGroup' );

    options = merge( {

      // HBox options
      spacing: COLUMN_SPACING,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // label that indicates the gene, to the left of the push buttons
    const labelNode = new Text( gene.name, {
      font: NaturalSelectionConstants.ADD_MUTATION_GENE_FONT,
      maxWidth: 50 // determined empirically
    } );
    const labelNodeWrapper = new AlignBox( labelNode, {
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

    const alignBoxOptions = {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    };

    assert && assert( !options.children, 'Row sets children' );
    options.children = [
      labelNodeWrapper,
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
        dominantAlleleIcon.lineDash = mutationIsDominant ? MUTATANT_ALLELE_LINE_DASH : NORMAL_ALLELE_LINE_DASH;

        // Adjust the recessive icon
        recessiveAlleleIcon.image = mutationIsDominant ? gene.normalAllele.image : gene.mutantAllele.image;
        recessiveAlleleIcon.lineDash = mutationIsDominant ? NORMAL_ALLELE_LINE_DASH : MUTATANT_ALLELE_LINE_DASH;
      }
    } );

    // If a Row is made invisible via PhET-iO while a mutation is scheduled, cancel the mutation.
    // unlink is not necessary.
    this.visibleProperty.link( visible => {
      if ( !visible && gene.mutationComingProperty.value ) {
        gene.dominantAlleleProperty.value = null;
      }
    } );

    // @public (read-only)
    this.gene = gene;
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

/**
 * MutationButton is a push button used to apply a mutation.
 */
class MutationButton extends RectangularPushButton {

  /**
   * @param {HTMLImageElement} mutantAlleleImage - the image on the button
   * @param {AlignGroup} iconsAlignGroup - sets uniform width and height for icons
   * @param {Object} [options]
   */
  constructor( mutantAlleleImage, iconsAlignGroup, options ) {

    assert && assert( mutantAlleleImage instanceof HTMLImageElement, 'invalid mutantAlleleImage' );
    assert && assert( iconsAlignGroup instanceof AlignGroup, 'invalid iconsAlignGroup' );

    options = merge( {
      baseColor: NaturalSelectionColors.ADD_MUTATION_BUTTONS,
      cornerRadius: BUTTON_CORNER_RADIUS,
      tandem: Tandem.REQUIRED,
      visiblePropertyOptions: { phetioReadOnly: true }
    }, options );

    const imageNode = new Image( mutantAlleleImage, {
      scale: BUTTON_ICON_SCALE
    } );

    assert && assert( !options.content, 'MutationButton sets content' );
    options.content = new AlignBox( imageNode, { group: iconsAlignGroup } );

    super( options );
  }
}

/**
 * AlleleIcon shows an icon that represents an allele.
 */
class AlleleIcon extends Node {

  /**
   * @param {Image} image - the default image on the icon
   * @param {AlignGroup} iconsAlignGroup - sets uniform width and height for icons
   * @param {Object} [options]
   */
  constructor( image, iconsAlignGroup, options ) {

    assert && assert( image instanceof HTMLImageElement, 'invalid image' );
    assert && assert( iconsAlignGroup instanceof AlignGroup, 'invalid iconsAlignGroup' );

    options = merge( {
      width: 100,
      height: 100,
      stroke: 'black'
    }, options );

    const imageNode = new Image( image, {
      scale: BUTTON_ICON_SCALE
    } );

    const outlineRectangle = new Rectangle( 0, 0, options.width, options.height, {
      cornerRadius: BUTTON_CORNER_RADIUS,
      stroke: options.stroke,
      lineWidth: 2
    } );

    assert && assert( !options.children, 'AlleleIcon sets children' );
    options.children = [
      outlineRectangle,
      new AlignBox( imageNode, {
        group: iconsAlignGroup,
        center: outlineRectangle.center
      } )
    ];

    super( options );

    // @private
    this.imageNode = imageNode; // {Image}
    this.outlineRectangle = outlineRectangle; // {Rectangle}
  }

  /**
   * Sets the image that appears on this icon.
   * @param {HTMLImageElement} value
   * @public
   */
  set image( value ) {
    assert && assert( value instanceof HTMLImageElement, 'invalid value' );
    this.imageNode.image = value;
  }

  /**
   * Sets the lineDash for the icon's outline rectangle.
   * @param {Array} value
   * @public
   */
  set lineDash( value ) {
    assert && assert( Array.isArray( value ), 'invalid value' );
    this.outlineRectangle.lineDash = value;
  }
}

naturalSelection.register( 'AddMutationsPanel', AddMutationsPanel );
export default AddMutationsPanel;