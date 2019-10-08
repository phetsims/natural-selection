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
  const Image = require( 'SCENERY/nodes/Image' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const mutationIcon = require( 'image!NATURAL_SELECTION/mutationIcon.png' );

  // strings
  const addMutationString = require( 'string!NATURAL_SELECTION/addMutation' );

  class AddMutationPanel extends NaturalSelectionPanel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );
      
      // title is text + icon
      const titleNode = new HBox( {
        spacing: 4,
        align: 'center',
        children: [
          new Text( addMutationString, { font: NaturalSelectionConstants.TITLE_FONT } ),
          new Image( mutationIcon, { scale: 0.75 } )
        ]
      } );

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, 175, 100 );

      const content = new VBox( _.extend( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ titleNode, rectangle ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'AddMutationPanel', AddMutationPanel );
} );