// Copyright 2019, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const selectionAgentString = require( 'string!NATURAL_SELECTION/selectionAgent' );
  const selectionAgentsString = require( 'string!NATURAL_SELECTION/selectionAgents' );

  class SelectionAgentsPanel extends Panel {

    /**
     * @param {SelectionAgent[]} selectionAgents
     * @param {Object} [options]
     */
    constructor( selectionAgents, options ) {

      assert && assert( selectionAgents.length > 0, 'at least 1 selection agent is required' );

      options = _.extend( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const titleString = ( selectionAgents.length === 1 ) ? selectionAgentString : selectionAgentsString;
      const titleNode = new Text( titleString, {
       font: NaturalSelectionConstants.TITLE_FONT
      } );

      const textOptions = {
        font: NaturalSelectionConstants.CHECKBOX_FONT
      };

      const checkboxes = [];
      selectionAgents.forEach( selectionAgent => {
        checkboxes.push( new Checkbox(
          new Text( selectionAgent.displayName, textOptions ),
          selectionAgent.enabledProperty,
          NaturalSelectionConstants.CHECKBOX_OPTIONS ) );
      } );

      const content = new VBox( _.extend( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ titleNode, ...checkboxes ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'SelectionAgentsPanel', SelectionAgentsPanel );
} );