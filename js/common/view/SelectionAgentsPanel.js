// Copyright 2019, University of Colorado Boulder

/**
 * SelectionAgentsPanel is the panel that contains controls for selection agents.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ToughFoodCheckbox = require( 'NATURAL_SELECTION/common/view/ToughFoodCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const WolvesCheckbox = require( 'NATURAL_SELECTION/common/view/WolvesCheckbox' );

  // strings
  const selectionAgentsString = require( 'string!NATURAL_SELECTION/selectionAgents' );

  class SelectionAgentsPanel extends NaturalSelectionPanel {

    /**
     * @param {Property.<boolean>} wolvesEnabledProperty
     * @param {Property.<boolean>} toughFoodEnabledProperty
     * @param {Object} [options]
     */
    constructor( wolvesEnabledProperty, toughFoodEnabledProperty, options ) {

      options = merge( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [

          // Selection Agents
          new Text( selectionAgentsString, {
                 font: NaturalSelectionConstants.TITLE_FONT
                } ),

          // Wolves
          new WolvesCheckbox( wolvesEnabledProperty ),

          // Tough Food
          new ToughFoodCheckbox( toughFoodEnabledProperty )
        ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'SelectionAgentsPanel', SelectionAgentsPanel );
} );