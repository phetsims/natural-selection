// Copyright 2019, University of Colorado Boulder

/**
 * AddMutationsPanel is the panel that contains controls used to add mutations.
 * TODO describe behavior
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const Emitter = require( 'AXON/Emitter' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const brownFurImage = require( 'image!NATURAL_SELECTION/brownFur.png' );
  const straightEarsImage = require( 'image!NATURAL_SELECTION/straightEars.png' );
  const floppyEarsImage = require( 'image!NATURAL_SELECTION/floppyEars.png' );
  const mutationIconImage = require( 'image!NATURAL_SELECTION/mutationIcon.png' );
  const longTeethImage = require( 'image!NATURAL_SELECTION/longTeeth.png' );
  const shortTeethImage = require( 'image!NATURAL_SELECTION/shortTeeth.png' );
  const whiteFurImage = require( 'image!NATURAL_SELECTION/whiteFur.png' );

  // strings
  const addMutationsString = require( 'string!NATURAL_SELECTION/addMutations' );
  const dominantString = require( 'string!NATURAL_SELECTION/dominant' );
  const earsString = require( 'string!NATURAL_SELECTION/ears' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );
  const recessiveString = require( 'string!NATURAL_SELECTION/recessive' );

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

      options = merge( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      //TODO args
      const furMutationEmitter = new Emitter();
      const earsMutationEmitter = new Emitter();
      const teethMutationEmitter = new Emitter();

      // All button icons have the same effective width and height.
      const iconsAlignGroup = new AlignGroup();

      // All elements in the label column have the same effective width.
      const labelColumnAlignGroup = new AlignGroup( { matchVertical: false } );

      // All elements in the button columns (including column headings) have the same effective width.
      const buttonColumnsAlignGroup = new AlignGroup();

      // title is text + icon
      const titleNode = new Text( addMutationsString, {
        font: NaturalSelectionConstants.TITLE_FONT,
        maxWidth: 180 // determined empirically
      } );

      // Individual column headings
      const mutationIconNode = new Image( mutationIconImage, { scale: 0.25 } );
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

      // Rows below the column headings
      const furRow = new AddMutationRow( furString, NaturalSelectionColors.FUR,
        brownFurImage, whiteFurImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
        () => furMutationEmitter.emit(),
        () => furMutationEmitter.emit()
      );
      const earsRow = new AddMutationRow( earsString, NaturalSelectionColors.EARS,
        floppyEarsImage, straightEarsImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
        () => earsMutationEmitter.emit(),
        () => earsMutationEmitter.emit()
      );
      const teethRow = new AddMutationRow( teethString, NaturalSelectionColors.TEETH,
        longTeethImage, shortTeethImage, iconsAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
        () => teethMutationEmitter.emit(),
        () => teethMutationEmitter.emit()
      );

      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ titleNode, columnHeadingsNode, furRow, earsRow, teethRow ]
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
   * AddMutationRow is a row in the 'Add Mutations' panel.
   * TODO describe behavior
   */
  class AddMutationRow extends HBox {

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
     */
    constructor( traitName, traitColor, mutationIcon, nonMutationIcon,
                 iconAlignGroup, labelColumnAlignGroup, buttonColumnsAlignGroup,
                 dominantListener, recessiveListener ) {

      // label that indicates the trait name, to the left of buttons
      const labelNode = new Text( traitName, {
        font: NaturalSelectionConstants.ADD_MUTATION_TRAIT_FONT,
        maxWidth: 50 // determined empirically
      } );
      const labelNodeWrapper = new AlignBox( labelNode, {
        group: labelColumnAlignGroup,
        xAlign: LABEL_COLUMN_X_ALIGN
      } );

      // buttons, both with the same (mutation) icon
      const dominantButton = new RectangularPushButton( {
        baseColor: NaturalSelectionColors.ADD_MUTATION_BUTTONS,
        cornerRadius: BUTTON_CORNER_RADIUS,
        content: new AlignBox( new Image( mutationIcon, {
          scale: BUTTON_ICON_SCALE
        } ), { group: iconAlignGroup } )
      } );
      const dominantButtonWrapper = new AlignBox( dominantButton, {
        group: buttonColumnsAlignGroup,
        xAlign: BUTTON_COLUMNS_X_ALIGN
      } );
      const recessiveButton = new RectangularPushButton( {
        baseColor: NaturalSelectionColors.ADD_MUTATION_BUTTONS,
        cornerRadius: BUTTON_CORNER_RADIUS,
        content: new AlignBox( new Image( mutationIcon, {
          scale: BUTTON_ICON_SCALE
        } ), { group: iconAlignGroup } )
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

      super( {
        spacing: COLUMN_SPACING,
        children: [ labelNodeWrapper, dominantButtonWrapper, recessiveButtonWrapper ]
      } );

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
      this.resetAddMutationRow = () => {
        dominantButton.visible = recessiveButton.visible = true;
        this.children = [ labelNodeWrapper, dominantButtonWrapper, recessiveButtonWrapper ];
      };
    }

    /**
     * @public
     */
    reset() {
      this.resetAddMutationRow();
    }
  }

  return naturalSelection.register( 'AddMutationsPanel', AddMutationsPanel );
} );