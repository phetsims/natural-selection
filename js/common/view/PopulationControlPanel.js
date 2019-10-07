// Copyright 2019, University of Colorado Boulder

/**
 * PopulationControlPanel is the panel that contains controls for the 'Population' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const HSeparator = require( 'SUN/HSeparator' );
  const LegendCheckbox = require( 'NATURAL_SELECTION/common/view/LegendCheckbox' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const totalString = require( 'string!NATURAL_SELECTION/total' );
  const valuesMarkerString = require( 'string!NATURAL_SELECTION/valuesMarker' );

  class PopulationControlPanel extends Panel {

    /**
     * @param {Property.<boolean>} totalVisibleProperty
     * @param {Property.<boolean>} valuesMarkerVisibleProperty
     * @param {{label: string, property: Property.<Boolean>}[]} traits
     * @param {Object} [options]
     */
    constructor( totalVisibleProperty, valuesMarkerVisibleProperty, traits, options ) {

      options = _.extend( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const textOptions = {
        font: NaturalSelectionConstants.CHECKBOX_FONT
      };

      const totalCheckbox = new LegendCheckbox( totalVisibleProperty, totalString );

      const traitCheckboxes = [];
      traits.forEach( trait => {
        traitCheckboxes.push( new LegendCheckbox( trait.property, trait.label ) );
      } );

      const valuesMarkerCheckbox = new Checkbox(
        new Text( valuesMarkerString, textOptions ),
        valuesMarkerVisibleProperty,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      const separatorWidth = _.maxBy( [ totalCheckbox, ...traitCheckboxes, valuesMarkerCheckbox ],
        node => node.width ).width;
      const separator = new HSeparator( separatorWidth );

      const content = new VBox( _.extend( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ totalCheckbox, ...traitCheckboxes, separator, valuesMarkerCheckbox ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PopulationControlPanel', PopulationControlPanel );
} );