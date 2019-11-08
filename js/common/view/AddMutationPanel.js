// Copyright 2019, University of Colorado Boulder

//TODO when a button is pressed, replace both buttons with the appropriate icons
//TODO when a button is pressed, emit 'mutation coming' with row.centerY (in global frame) and cancelCallback
//TODO reset
//TODO ensure that reset doesn't change visibility of rows for PhET-iO
/**
 * AddMutationPanel is the panel that contains controls used to add mutations.
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
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const mutationBrownFurImage = require( 'image!NATURAL_SELECTION/mutation-brownFur.png' );
  const mutationFlatEarsImage = require( 'image!NATURAL_SELECTION/mutation-flatEars.png' );
  const mutationIconImage = require( 'image!NATURAL_SELECTION/mutationIcon.png' );
  const mutationLongTeethImage = require( 'image!NATURAL_SELECTION/mutation-longTeeth.png' );

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
  const ICON_SCALE = 0.5;
  const BUTTON_BASE_COLOR = 'rgb( 203, 203, 203 )';

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

      // All elements in the button columns have the same effective width.
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

      // Column headings
      const geneNameColumnLabel = new Text( '' ); // to facilitate alignment
      const dominantColumnLabel = new Text( dominantString, { font: COLUMN_HEADING_FONT } );
      const recessiveColumnLabel = new Text( recessiveString, { font: COLUMN_HEADING_FONT } );

      const columnHeadingsNode = new HBox( {
        spacing: COLUMN_SPACING,
        children: [
          new AlignBox( geneNameColumnLabel, { group: labelColumnAlignGroup } ),
          new AlignBox( dominantColumnLabel, { group: buttonColumnsAlignGroup } ),
          new AlignBox( recessiveColumnLabel, { group: buttonColumnsAlignGroup } )
        ]
      } );

      const furRow = createRow( furString, mutationBrownFurImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup );
      const earsRow = createRow( earsString, mutationFlatEarsImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup );
      const teethRow = createRow( teethString, mutationLongTeethImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup );

      const content = new VBox( {
        align: 'left',
        spacing: ROW_SPACING,
        children: [ titleNode, columnHeadingsNode, furRow, earsRow, teethRow ]
      } );

      super( content, options );
    }
  }

  /**
   * Creates a row in this control panel.
   * @param {string} labelString
   * @param {HTMLImageElement} icon
   * @param {AlignGroup} iconAlignGroup
   * @param {AlignGroup} labelColumnAlignGroup
   * @param {AlignGroup} buttonColumnsAlignGroup
   */
  function createRow( labelString, icon, iconAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup ) {

    // label to the left of buttons
    const labelNode = new Text( labelString, { font: LABEL_FONT } );

    // icon, the same on both buttons
    const iconNode = new Image( icon, { scale: ICON_SCALE } );

    // buttons
    const buttonOptions = {
      content: new AlignBox( iconNode, { group: iconAlignGroup } ),
      baseColor: BUTTON_BASE_COLOR
    };
    const dominantButton = new RectangularPushButton( buttonOptions );
    const recessiveButton = new RectangularPushButton( buttonOptions );

    return new HBox( {
      spacing: COLUMN_SPACING,
      children: [
        new AlignBox( labelNode, { group: labelColumnAlignGroup, xAlign: 'left' } ),
        new AlignBox( dominantButton, { group: buttonColumnsAlignGroup } ),
        new AlignBox( recessiveButton, { group: buttonColumnsAlignGroup } )
      ]
    } );
  }

  return naturalSelection.register( 'AddMutationPanel', AddMutationPanel );
} );