// Copyright 2019-2020, University of Colorado Boulder

/**
 * AddMutationsPanel is the panel that contains controls used to add mutations.
 * For each trait, you can select whether its mutation will be dominant or recessive.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import brownFurImage from '../../../images/brownFur_png.js';
import floppyEarsImage from '../../../images/floppyEars_png.js';
import longTeethImage from '../../../images/longTeeth_png.js';
import shortTeethImage from '../../../images/shortTeeth_png.js';
import straightEarsImage from '../../../images/straightEars_png.js';
import whiteFurImage from '../../../images/whiteFur_png.js';
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

    // All button icons have the same effective width and height.
    const iconsAlignGroup = new AlignGroup();

    // All elements in the label column have the same effective width.
    const labelColumnAlignGroup = new AlignGroup( { matchVertical: false } );

    // All elements in the button columns (including column headings) have the same effective width.
    const buttonColumnsAlignGroup = new AlignGroup();

    //TODO title should be singular 'Add Mutation' when there is only 1 mutation in the panel
    // title is text + icon
    const titleNode = new Text( naturalSelectionStrings.addMutations, {
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 180 // determined empirically
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

    // A row for each trait
    const furRow = new Row( genePool.furGene, naturalSelectionStrings.fur, NaturalSelectionColors.FUR,
      brownFurImage, whiteFurImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup, {
        tandem: options.tandem.createTandem( 'furRow' )
      } );
    const earsRow = new Row( genePool.earsGene, naturalSelectionStrings.ears, NaturalSelectionColors.EARS,
      floppyEarsImage, straightEarsImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup, {
        tandem: options.tandem.createTandem( 'earsRow' )
      } );
    const teethRow = new Row( genePool.teethGene, naturalSelectionStrings.teeth, NaturalSelectionColors.TEETH,
      longTeethImage, shortTeethImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup, {
        tandem: options.tandem.createTandem( 'teethRow' )
      } );

    const rows = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [ furRow, earsRow, teethRow ]
    } ) );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      spacing: 2,
      children: [ titleNode, columnHeadingsNode, rows ]
    } ) );

    super( content, options );

    // @private
    this.furRow = furRow;
    this.earsRow = earsRow;
    this.teethRow = teethRow;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'AddMutationsPanel does not support dispose' );
  }

  /**
   * Gets the left center of the 'Fur' row in the global coordinate frame.
   * Used to position the MutationAlertsNode that corresponds to fur.
   * @returns {Vector2}
   * @public
   */
  getFurLeftCenter() {
    return this.getRowGlobalLeftCenter( this.furRow );
  }

  /**
   * Gets the left center of the 'Ears' row in the global coordinate frame.
   * Used to position the MutationAlertsNode that corresponds to ears.
   * @returns {Vector2}
   * @public
   */
  getEarsLeftCenter() {
    return this.getRowGlobalLeftCenter( this.earsRow );
  }

  /**
   * Gets the left center of the 'Teeth' row in the global coordinate frame.
   * Used to position the MutationAlertsNode that corresponds to teeth.
   * @returns {Vector2}
   * @public
   */
  getTeethLeftCenter() {
    return this.getRowGlobalLeftCenter( this.teethRow );
  }

  /**
   * Gets the left center of a row in the global coordinate frame.
   * Used to position a MutationAlertsNode.
   * @param {Node} row
   * @returns {Vector2}
   * @private
   */
  getRowGlobalLeftCenter( row ) {
    assert && assert( row instanceof Node, 'invalid row' );
    return row.parentToGlobalPoint( new Vector2( row.left, row.centerY ) );
  }
}

/**
 * Row is a row in the 'Add Mutations' panel.  It has a dominant and recessive button pair, used to select whether
 * the mutant allele is dominant or recessive.  Pressing one of these buttons schedules the mutation and hides the
 * buttons.  When the buttons are hidden, a pair of icons is exposed that shows which allele is dominant, and
 * which allele is recessive.
 */
class Row extends HBox {

  //TODO use config parameter here?
  /**
   * @param {Gene} gene
   * @param {string} traitName
   * @param {Color|string} traitColor
   * @param {HTMLImageElement} mutationIcon
   * @param {HTMLImageElement} nonMutationIcon
   * @param {AlignGroup} iconAlignGroup
   * @param {AlignGroup} labelColumnAlignGroup
   * @param {AlignGroup} buttonColumnsAlignGroup
   * @param {Object} [options]
   */
  constructor( gene, traitName, traitColor, mutationIcon, nonMutationIcon,
               iconAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
               options ) {

    assert && assert( gene instanceof Gene, 'invalid Gene' );
    assert && assert( typeof traitName === 'string', 'invalid traitName' );
    assert && assert( traitColor instanceof Color || typeof traitColor === 'string', 'invalid traitColor' );
    assert && assert( mutationIcon instanceof HTMLImageElement, 'invalid mutationIcon' );
    assert && assert( nonMutationIcon instanceof HTMLImageElement, 'invalid nonMutationIcon' );
    assert && assert( iconAlignGroup instanceof AlignGroup, 'invalid iconAlignGroup' );
    assert && assert( labelColumnAlignGroup instanceof AlignGroup, 'invalid labelColumnAlignGroup' );
    assert && assert( buttonColumnsAlignGroup instanceof AlignGroup, 'invalid buttonColumnsAlignGroup' );

    options = merge( {

      // HBox options
      spacing: COLUMN_SPACING,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // label that indicates the trait name, to the left of buttons
    const labelNode = new Text( traitName, {
      font: NaturalSelectionConstants.ADD_MUTATION_TRAIT_FONT,
      maxWidth: 50 // determined empirically
    } );
    const labelNodeWrapper = new AlignBox( labelNode, {
      group: labelColumnAlignGroup,
      xAlign: LABEL_COLUMN_X_ALIGN
    } );

    // dominant push button
    const dominantButton = new RectangularPushButton( {
      baseColor: NaturalSelectionColors.ADD_MUTATION_BUTTONS,
      cornerRadius: BUTTON_CORNER_RADIUS,
      content: new AlignBox( new Image( mutationIcon, {
        scale: BUTTON_ICON_SCALE
      } ), { group: iconAlignGroup } ),
      tandem: options.tandem.createTandem( 'dominantButton' ),
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    } );
    const dominantButtonWrapper = new AlignBox( dominantButton, {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    } );

    // recessive push button
    const recessiveButton = new RectangularPushButton( {
      baseColor: NaturalSelectionColors.ADD_MUTATION_BUTTONS,
      cornerRadius: BUTTON_CORNER_RADIUS,
      content: new AlignBox( new Image( mutationIcon, {
        scale: BUTTON_ICON_SCALE
      } ), { group: iconAlignGroup } ),
      tandem: options.tandem.createTandem( 'recessiveButton' ),
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    } );
    const recessiveButtonWrapper = new AlignBox( recessiveButton, {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    } );

    // icon for the standard allele
    const standardAlleleNode = new Node( {
      children: [
        new Rectangle( 0, 0, dominantButton.width, dominantButton.height, {
          cornerRadius: BUTTON_CORNER_RADIUS,
          stroke: traitColor,
          lineWidth: 2
        } ),
        new AlignBox( new Image( nonMutationIcon, {
          scale: BUTTON_ICON_SCALE
        } ), {
          group: iconAlignGroup,
          centerX: dominantButton.width / 2,
          centerY: dominantButton.height / 2
        } )
      ]
    } );
    const standardAlleleWrapper = new AlignBox( standardAlleleNode, {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    } );
    
    // icon for the mutant allele
    const mutantAlleleNode = new Node( {
      children: [
        new Rectangle( 0, 0, dominantButton.width, dominantButton.height, {
          cornerRadius: BUTTON_CORNER_RADIUS,
          stroke: traitColor,
          lineWidth: 2,
          lineDash: [ 3, 3 ]
        } ),
        new AlignBox( new Image( mutationIcon, {
          scale: BUTTON_ICON_SCALE
        } ), {
          group: iconAlignGroup,
          centerX: dominantButton.width / 2,
          centerY: dominantButton.height / 2
        } )
      ]
    } );
    const mutantAlleleWrapper = new AlignBox( mutantAlleleNode, {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    } );

    assert && assert( !options.children, 'Row sets children' );
    options.children = [ labelNodeWrapper, dominantButtonWrapper, recessiveButtonWrapper ];

    super( options );

    gene.dominantAlleleProperty.link( dominantAllele => {
      dominantButton.visible = recessiveButton.visible = ( dominantAllele === null );
      this.children = [ labelNodeWrapper, dominantButtonWrapper, recessiveButtonWrapper ];
    } );

    // When the dominant button is pressed...
    dominantButton.addListener( () => {

      // make the mutation dominant and the non-mutation recessive
      gene.dominantAlleleProperty.value = gene.mutantAllele;
      this.children = [ labelNodeWrapper, mutantAlleleWrapper, standardAlleleWrapper ];

      // signal that a mutation is coming in the next generation
      gene.mutationComingProperty.value = true;
    } );

    // When the recessive button is pressed...
    recessiveButton.addListener( () => {

      // make the mutation dominant and the non-mutation recessive
      gene.dominantAlleleProperty.value = gene.normalAllele;
      this.children = [ labelNodeWrapper, standardAlleleWrapper, mutantAlleleWrapper ];

      // signal that a mutation is coming in the next generation
      gene.mutationComingProperty.value = true;
    } );
  }
}

naturalSelection.register( 'AddMutationsPanel', AddMutationsPanel );
export default AddMutationsPanel;