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
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
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
     * @param {{label: string, property: Property.<Boolean>, color:Color|string, lineStyle:string}[]} traits
     * @param {Object} [options]
     */
    constructor( totalVisibleProperty, valuesMarkerVisibleProperty, traits, options ) {

      options = merge( {
        fixedWidth: 100,
        xMargin: 0
      }, NaturalSelectionConstants.PANEL_OPTIONS, options );
                    
      // Total
      const totalCheckbox = new PopulationCheckbox( totalVisibleProperty, totalString, {
        lineOptions: {
          stroke: NaturalSelectionColors.TOTAL_GRAPH_COLOR
        }
      } );

      // Checkbox for each trait
      const traitCheckboxes = [];
      traits.forEach( trait => {
        traitCheckboxes.push( new PopulationCheckbox( trait.property, trait.label, {
          lineOptions: {
            stroke: trait.color,
            lineDash: ( trait.lineStyle === 'solid' ) ? [] : [ 3, 3 ]
          }
        } ) );
      } );

      // ------
      const separator = new HSeparator( options.fixedWidth - 2 * options.xMargin, {
        stroke: NaturalSelectionColors.SEPARATOR_STROKE
      } );

      // Values Marker
      const valuesMarkerCheckbox = new Checkbox(
        new Text( valuesMarkerString, { font: NaturalSelectionConstants.CHECKBOX_FONT } ),
        valuesMarkerVisibleProperty,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      // Arranged vertically
      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ totalCheckbox, ...traitCheckboxes, separator, valuesMarkerCheckbox ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PopulationControlPanel', PopulationControlPanel );
} );