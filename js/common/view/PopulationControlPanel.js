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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const PopulationCheckbox = require( 'NATURAL_SELECTION/common/view/PopulationCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const totalString = require( 'string!NATURAL_SELECTION/total' );
  const valuesMarkerString = require( 'string!NATURAL_SELECTION/valuesMarker' );

  class PopulationControlPanel extends NaturalSelectionPanel {

    /**
     * @param {Property.<boolean>} totalVisibleProperty
     * @param {Property.<boolean>} valuesMarkerVisibleProperty
     * @param {{label: string, property: Property.<Boolean>}[]} traits
     * @param {Object} [options]
     */
    constructor( totalVisibleProperty, valuesMarkerVisibleProperty, traits, options ) {

      options = _.extend( {
        fixedWidth: 100
      }, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const textOptions = {
        font: NaturalSelectionConstants.CHECKBOX_FONT
      };

      const totalCheckbox = new PopulationCheckbox( totalVisibleProperty, totalString );

      const traitCheckboxes = [];
      traits.forEach( trait => {
        traitCheckboxes.push( new PopulationCheckbox( trait.property, trait.label ) );
      } );

      const valuesMarkerCheckbox = new Checkbox(
        new Text( valuesMarkerString, textOptions ),
        valuesMarkerVisibleProperty,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      const separator = new HSeparator( options.fixedWidth );

      const content = new VBox( _.extend( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ totalCheckbox, ...traitCheckboxes, separator, valuesMarkerCheckbox ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PopulationControlPanel', PopulationControlPanel );
} );