// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeControlPanel is the panel that contains controls for the 'Pedigree' graph.
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

  class PedigreeControlPanel extends Panel {

    /**
     * @param {{label: string, property: Property.<Boolean>}[]} alleles
     * @param {Object} [options]
     */
    constructor( alleles, options ) {

      options = _.extend( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const textOptions = {
        font: NaturalSelectionConstants.CHECKBOX_FONT
      };

      const checkboxes = [];
      alleles.forEach( allele => {
        checkboxes.push( new Checkbox(
          new Text( allele.label, textOptions ),
          allele.property,
          NaturalSelectionConstants.CHECKBOX_OPTIONS ) );
      } );

      const content = new VBox( _.extend( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: checkboxes
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PedigreeControlPanel', PedigreeControlPanel );
} );