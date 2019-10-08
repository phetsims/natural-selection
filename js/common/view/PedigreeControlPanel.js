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
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const allelesString = require( 'string!NATURAL_SELECTION/alleles' );

  class PedigreeControlPanel extends NaturalSelectionPanel {

    /**
     * @param {{label: string, property: Property.<Boolean>}[]} alleles
     * @param {Object} [options]
     */
    constructor( alleles, options ) {

      options = _.extend( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      // Alleles title
      const titleNode = new Text( allelesString, {
        font: NaturalSelectionConstants.TITLE_FONT
      } );

      // Checkbox for each pair of alleles
      const checkboxes = [];
      alleles.forEach( allele => {
        checkboxes.push( new Checkbox(
          new Text( allele.label, { font: NaturalSelectionConstants.CHECKBOX_FONT } ),
          allele.property,
          NaturalSelectionConstants.CHECKBOX_OPTIONS ) );
      } );

      // Arranged vertically
      const content = new VBox( _.extend( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ titleNode, ...checkboxes ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PedigreeControlPanel', PedigreeControlPanel );
} );