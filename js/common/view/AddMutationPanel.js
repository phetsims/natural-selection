// Copyright 2019, University of Colorado Boulder

//TODO when a button is pressed, replace both buttons with the appropriate icons
//TODO when a button is pressed, emit 'mutation coming' with row.centerY (in global frame) and cancelCallback
//TODO reset
//TODO ensure that reset doesn't change visibility of rows for PhET-iO
/**
 * AddMutationPanel is the panel that contains controls used to add mutations.
 * TODO describe behavior
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const brownFurIcon = require( 'image!NATURAL_SELECTION/brownFur.png' );
  const flatEarsImage = require( 'image!NATURAL_SELECTION/flatEars.png' );
  const mutationIconImage = require( 'image!NATURAL_SELECTION/mutationIcon.png' );
  const longTeethImage = require( 'image!NATURAL_SELECTION/longTeeth.png' );

  // strings
  const addMutationString = require( 'string!NATURAL_SELECTION/addMutation' );
  const dominantString = require( 'string!NATURAL_SELECTION/dominant' );
  const earsString = require( 'string!NATURAL_SELECTION/ears' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );
  const recessiveString = require( 'string!NATURAL_SELECTION/recessive' );

  // constants
  const COLUMN_HEADING_FONT = new PhetFont( 14 );
  const COLUMN_SPACING = 8;
  const ROW_SPACING = 8;
  const LABEL_FONT = new PhetFont( 16 );
  const BUTTON_ICON_SCALE = 0.5;
  const LABEL_COLUMN_X_ALIGN = 'left';
  const BUTTON_COLUMNS_X_ALIGN = 'center';

  class AddMutationPanel extends NaturalSelectionPanel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      // All button icons have the same effective width and height.
      const iconsAlignGroup = new AlignGroup();

      // All elements in the label column have the same effective width.
      const labelColumnAlignGroup = new AlignGroup( { matchVertical: false } );

      // All elements in the button columns (including column headings) have the same effective width.
      const buttonColumnsAlignGroup = new AlignGroup( { matchVertical: false } );

      // title is text + icon
      const titleNode = new HBox( {
        spacing: 4,
        align: 'center',
        children: [
          new Text( addMutationString, { font: NaturalSelectionConstants.TITLE_FONT } ),
          new Image( mutationIconImage, { scale: 0.15 } )
        ]
      } );

      // Individual column headings
      const geneNameColumnLabel = new Text( '' ); // to facilitate alignment
      const dominantColumnLabel = new Text( dominantString, {
        font: COLUMN_HEADING_FONT
      } );
      const recessiveColumnLabel = new Text( recessiveString, {
        font: COLUMN_HEADING_FONT
      } );

      // Layout of column headings 
      const columnHeadingsNode = new HBox( {
        spacing: COLUMN_SPACING,
        children: [
          new AlignBox( geneNameColumnLabel, { group: labelColumnAlignGroup, xAlign: LABEL_COLUMN_X_ALIGN } ),
          new AlignBox( dominantColumnLabel, { group: buttonColumnsAlignGroup, xAlign: BUTTON_COLUMNS_X_ALIGN } ),
          new AlignBox( recessiveColumnLabel, { group: buttonColumnsAlignGroup, xAlign: BUTTON_COLUMNS_X_ALIGN } )
        ]
      } );

      // Rows below the column headings
      const furRow = new AddMutationRow( furString, brownFurIcon, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup );
      const earsRow = new AddMutationRow( earsString, flatEarsImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup );
      const teethRow = new AddMutationRow( teethString, longTeethImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup );

      const content = new VBox( {
        align: 'left',
        spacing: ROW_SPACING,
        children: [ titleNode, columnHeadingsNode, furRow, earsRow, teethRow ]
      } );

      super( content, options );
    }
  }

  /**
   * AddMutationRow is a row in the 'Add Mutations' panel.
   * TODO describe behavior
   */
  class AddMutationRow extends HBox {

    /**
     * @param {string} traitName
     * @param {HTMLImageElement} icon
     * @param {AlignGroup} iconAlignGroup
     * @param {AlignGroup} labelColumnAlignGroup
     * @param {AlignGroup} buttonColumnsAlignGroup
     */
    constructor( traitName, icon, iconAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup ) {

      // label that indicates the trait name, to the left of buttons
      const labelNode = new Text( traitName, {
        font: LABEL_FONT
      } );

      // icon, the same on both buttons
      const iconNode = new Image( icon, {
        scale: BUTTON_ICON_SCALE
      } );

      // buttons
      const buttonOptions = {
        content: new AlignBox( iconNode, { group: iconAlignGroup } ),
        baseColor: NaturalSelectionColors.MUTATION_BUTTONS
      };
      const dominantButton = new RectangularPushButton( buttonOptions );
      const recessiveButton = new RectangularPushButton( buttonOptions );

      super( {
        spacing: COLUMN_SPACING,
        children: [
          new AlignBox( labelNode, { group: labelColumnAlignGroup, xAlign: LABEL_COLUMN_X_ALIGN } ),
          new AlignBox( dominantButton, { group: buttonColumnsAlignGroup, xAlign: BUTTON_COLUMNS_X_ALIGN } ),
          new AlignBox( recessiveButton, { group: buttonColumnsAlignGroup, xAlign: BUTTON_COLUMNS_X_ALIGN } )
        ]
      } );
    }
  }

  return naturalSelection.register( 'AddMutationPanel', AddMutationPanel );
} );