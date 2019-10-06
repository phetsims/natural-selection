// Copyright 2019, University of Colorado Boulder

/**
 * AddMutationPanel is the panel that contains controls used to add mutations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Panel = require( 'SUN/Panel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const addMutationString = require( 'string!NATURAL_SELECTION/addMutation' );

  class AddMutationPanel extends Panel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const titleNode = new Text( addMutationString, {
        font: NaturalSelectionConstants.TITLE_FONT
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