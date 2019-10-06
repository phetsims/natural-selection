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
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const valuesString = require( 'string!NATURAL_SELECTION/values' );

  class ProportionControlPanel extends Panel {

    /**
     * @param {Property.<boolean>} valuesVisibleProperty
     * @param {{label: string, property: Property.<Boolean>}[]} traits
     * @param {Object} [options]
     */
    constructor( valuesVisibleProperty, traits, options ) {

      options = _.extend( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const textOptions = {
        font: NaturalSelectionConstants.CHECKBOX_FONT
      };

      const valuesCheckbox = new Checkbox(
        new Text( valuesString, textOptions ),
        valuesVisibleProperty ,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      const traitLegends = [];
      traits.forEach( trait => {
        traitLegends.push( new Text( trait.label, textOptions ) );
      } );

      const separatorWidth = _.maxBy( [ valuesCheckbox, ...traitLegends ],
        node => node.width ).width;
      const separator = new HSeparator( separatorWidth );

      const content = new VBox( _.extend( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ valuesCheckbox, separator, ...traitLegends ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'ProportionControlPanel', ProportionControlPanel );
} );