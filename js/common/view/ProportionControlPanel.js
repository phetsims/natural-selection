// Copyright 2019, University of Colorado Boulder

/**
 * ProportionControlPanel is the panel that contains controls for the 'Proportion' graph.
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
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const ProportionLegendNode = require( 'NATURAL_SELECTION/common/view/ProportionLegendNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const valuesString = require( 'string!NATURAL_SELECTION/values' );

  class ProportionControlPanel extends NaturalSelectionPanel {

    /**
     * @param {Property.<boolean>} valuesVisibleProperty
     * @param {{label: string, property: Property.<Boolean>}[]} traits
     * @param {Object} [options]
     */
    constructor( valuesVisibleProperty, traits, options ) {

      options = merge( {
        fixedWidth: 100,
        xMargin: 0
      }, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const textOptions = {
        font: NaturalSelectionConstants.CHECKBOX_FONT
      };

      // Values
      const valuesCheckbox = new Checkbox(
        new Text( valuesString, textOptions ),
        valuesVisibleProperty ,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      // ------
      const separator = new HSeparator( options.fixedWidth - 2 * options.xMargin );

      // Legend for each trait
      const traitLegends = [];
      traits.forEach( trait => {
        traitLegends.push( new ProportionLegendNode( trait.label, {
          rectangleOptions: {
            fill: ( trait.lineStyle === 'solid' ) ? trait.color : null,
            stroke: ( trait.lineStyle === 'solid' ) ? null : trait.color
          }
        } ) );
      } );

      // Arranged vertically
      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ valuesCheckbox, separator, ...traitLegends ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'ProportionControlPanel', ProportionControlPanel );
} );