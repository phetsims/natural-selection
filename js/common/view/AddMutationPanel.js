// Copyright 2019, University of Colorado Boulder

/**
 * AddMutationPanel is the panel that contains controls used to add mutations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const mutationIconImage = require( 'image!NATURAL_SELECTION/mutationIcon.png' );

  // strings
  const addMutationString = require( 'string!NATURAL_SELECTION/addMutation' );
  const dominantString = require( 'string!NATURAL_SELECTION/dominant' );
  const recessiveString = require( 'string!NATURAL_SELECTION/recessive' );

  // constants
  const COLUMN_HEADING_FONT = new PhetFont( 12 );

  class AddMutationPanel extends NaturalSelectionPanel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );
      
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
      const columnHeadingsNode = new HBox( {
        spacing: 6,
        children: [
          new HStrut( 50 ),
          new Text( dominantString, { font: COLUMN_HEADING_FONT } ),
          new Text( recessiveString, { font: COLUMN_HEADING_FONT } )
        ]
      } );

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, 175, 75 );

      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ titleNode, columnHeadingsNode, rectangle ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'AddMutationPanel', AddMutationPanel );
} );