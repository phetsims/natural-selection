// Copyright 2019-2020, University of Colorado Boulder

/**
 * AddMutationsPanel is the panel that contains controls used to add mutations.
 * TODO describe behavior
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
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
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import brownFurImage from '../../../images/brownFur_png.js';
import floppyEarsImage from '../../../images/floppyEars_png.js';
import longTeethImage from '../../../images/longTeeth_png.js';
import shortTeethImage from '../../../images/shortTeeth_png.js';
import straightEarsImage from '../../../images/straightEars_png.js';
import whiteFurImage from '../../../images/whiteFur_png.js';
import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import MutationIconNode from './MutationIconNode.js';
import NaturalSelectionPanel from './NaturalSelectionPanel.js';

const addMutationsString = naturalSelectionStrings.addMutations;
const dominantString = naturalSelectionStrings.dominant;
const earsString = naturalSelectionStrings.ears;
const furString = naturalSelectionStrings.fur;
const teethString = naturalSelectionStrings.teeth;
const recessiveString = naturalSelectionStrings.recessive;

// constants
const COLUMN_SPACING = 8;
const BUTTON_ICON_SCALE = 0.5;
const LABEL_COLUMN_X_ALIGN = 'left';
const BUTTON_COLUMNS_X_ALIGN = 'center';
const BUTTON_CORNER_RADIUS = 4;

class AddMutationsPanel extends NaturalSelectionPanel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    //TODO options.parameters
    const furMutationEmitter = new Emitter();
    const earsMutationEmitter = new Emitter();
    const teethMutationEmitter = new Emitter();

    // All button icons have the same effective width and height.
    const iconsAlignGroup = new AlignGroup();

    // All elements in the label column have the same effective width.
    const labelColumnAlignGroup = new AlignGroup( { matchVertical: false } );

    // All elements in the button columns (including column headings) have the same effective width.
    const buttonColumnsAlignGroup = new AlignGroup();

    //TODO title should be singular 'Add Mutation' when there is only 1 mutation in the panel
    // title is text + icon
    const titleNode = new Text( addMutationsString, {
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 180 // determined empirically
    } );

    // Individual column headings
    const mutationIconNode = new MutationIconNode();
    const dominantColumnLabel = new Text( dominantString, {
      font: NaturalSelectionConstants.ADD_MUTATION_COLUMN_HEADING_FONT,
      maxWidth: 60 // determined empirically
    } );
    const recessiveColumnLabel = new Text( recessiveString, {
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
    const furRow = new Row( furString, NaturalSelectionColors.FUR,
      brownFurImage, whiteFurImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
      () => furMutationEmitter.emit(), //TODO args
      () => furMutationEmitter.emit(), //TODO args
      {
        tandem: options.tandem.createTandem( 'furRow' )
      }
    );
    const earsRow = new Row( earsString, NaturalSelectionColors.EARS,
      floppyEarsImage, straightEarsImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
      () => earsMutationEmitter.emit(), //TODO args
      () => earsMutationEmitter.emit(), //TODO args
      {
        tandem: options.tandem.createTandem( 'earsRow' )
      }
    );
    const teethRow = new Row( teethString, NaturalSelectionColors.TEETH,
      longTeethImage, shortTeethImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
      () => teethMutationEmitter.emit(), //TODO args
      () => teethMutationEmitter.emit(), //TODO args
      {
        tandem: options.tandem.createTandem( 'teethRow' )
      }
    );
    const rows = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [ furRow, earsRow, teethRow ]
    } ) );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      spacing: 2,
      children: [ titleNode, columnHeadingsNode, rows ]
    } ) );

    super( content, options );

    // @public
    this.furMutationEmitter = furMutationEmitter;
    this.earsMutationEmitter = earsMutationEmitter;
    this.teethMutationEmitter = teethMutationEmitter;

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
   * @returns {Vector2}
   * @public
   */
  getFurLeftCenter() {
    return this.getRowGlobalLeftCenter( this.furRow );
  }

  /**
   * Gets the left center of the 'Ears' row in the global coordinate frame.
   * @returns {Vector2}
   * @public
   */
  getEarsLeftCenter() {
    return this.getRowGlobalLeftCenter( this.earsRow );
  }

  /**
   * Gets the left center of the 'Teeth' row in the global coordinate frame.
   * @returns {Vector2}
   * @public
   */
  getTeethLeftCenter() {
    return this.getRowGlobalLeftCenter( this.teethRow );
  }

  /**
   * Gets the left center of a row in the global coordinate frame.
   * @param {Node} row
   * @returns {Vector2}
   * @private
   */
  getRowGlobalLeftCenter( row ) {
    return row.parentToGlobalPoint( new Vector2( row.left, row.centerY ) );
  }

  /**
   * Resets the 'Fur' row.
   * @public
   */
  resetFur() {
    this.furRow.reset();
  }

  /**
   * Resets the 'Ears' row.
   * @public
   */
  resetEars() {
    this.earsRow.reset();
  }

  /**
   * Resets the 'Teeth' row.
   * @public
   */
  resetTeeth() {
    this.teethRow.reset();
  }

  /**
   * @public
   */
  reset() {
    this.resetFur();
    this.resetEars();
    this.resetTeeth();
  }
}

/**
 * Row is a row in the 'Add Mutations' panel.
 * TODO describe behavior
 */
class Row extends HBox {

  /**
   * @param {string} traitName
   * @param {Color|string} traitColor
   * @param {HTMLImageElement} mutationIcon
   * @param {HTMLImageElement} nonMutationIcon
   * @param {AlignGroup} iconAlignGroup
   * @param {AlignGroup} labelColumnAlignGroup
   * @param {AlignGroup} buttonColumnsAlignGroup
   * @param {function} dominantListener
   * @param {function} recessiveListener
   * @param {Object} [options]
   */
  constructor( traitName, traitColor, mutationIcon, nonMutationIcon,
               iconAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
               dominantListener, recessiveListener, options ) {

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
      tandem: options.tandem.createTandem( 'dominantButton' )
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
      tandem: options.tandem.createTandem( 'recessiveButton' )
    } );
    const recessiveButtonWrapper = new AlignBox( recessiveButton, {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    } );

    // these Nodes show the dominant vs recessive selection
    const mutationNode = new Node( {
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
    const mutationNodeWrapper = new AlignBox( mutationNode, {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    } );
    const nonMutationNode = new Node( {
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
    const nonMutationNodeWrapper = new AlignBox( nonMutationNode, {
      group: buttonColumnsAlignGroup,
      xAlign: BUTTON_COLUMNS_X_ALIGN
    } );

    assert && assert( !options.children, 'Row sets children' );
    options.children = [ labelNodeWrapper, dominantButtonWrapper, recessiveButtonWrapper ];

    super( options );

    dominantButton.addListener( () => {

      // hide both buttons
      dominantButton.visible = recessiveButton.visible = false;

      // make the mutation dominant and the non-mutation recessive
      this.children = [ labelNodeWrapper, mutationNodeWrapper, nonMutationNodeWrapper ];

      dominantListener();
    } );

    recessiveButton.addListener( () => {

      // hide both buttons
      dominantButton.visible = recessiveButton.visible = false;

      // make the mutation dominant and the non-mutation recessive
      this.children = [ labelNodeWrapper, nonMutationNodeWrapper, mutationNodeWrapper ];

      recessiveListener();
    } );

    // @private
    this.resetRow = () => {
      dominantButton.visible = recessiveButton.visible = true;
      this.children = [ labelNodeWrapper, dominantButtonWrapper, recessiveButtonWrapper ];
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetRow();
  }
}

naturalSelection.register( 'AddMutationsPanel', AddMutationsPanel );
export default AddMutationsPanel;