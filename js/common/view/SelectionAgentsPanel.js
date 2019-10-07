// Copyright 2019, University of Colorado Boulder

/**
 * SelectionAgentsPanel is the panel that contains controls for selection agents.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const selectionAgentString = require( 'string!NATURAL_SELECTION/selectionAgent' );
  const selectionAgentsString = require( 'string!NATURAL_SELECTION/selectionAgents' );

  class SelectionAgentsPanel extends NaturalSelectionPanel {

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

        const label = new HBox( {
          spacing: 6,
          children: [
            new Text( selectionAgent.displayName, textOptions ),
            new Image( selectionAgent.icon, { scale: 0.4 } )
          ]
        });

        const checkbox = new Checkbox( label, selectionAgent.enabledProperty, NaturalSelectionConstants.CHECKBOX_OPTIONS );

        checkboxes.push( checkbox );
      } );

      const content = new VBox( _.extend( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ titleNode, ...checkboxes ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'SelectionAgentsPanel', SelectionAgentsPanel );
} );