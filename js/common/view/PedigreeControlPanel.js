// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeControlPanel is the panel that contains controls for the 'Pedigree' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const allelesString = require( 'string!NATURAL_SELECTION/alleles' );
  const earsString = require( 'string!NATURAL_SELECTION/ears' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );

  class PedigreeControlPanel extends NaturalSelectionPanel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      // Alleles title
      const titleNode = new Text( allelesString, {
        font: NaturalSelectionConstants.TITLE_FONT
      } );

      //TODO temporary BooleanProperty for each checkbox
      // Checkbox for each gene
      const textOptions = { font: NaturalSelectionConstants.CHECKBOX_FONT };
      const checkboxes = [
        new Checkbox( new Text( furString, textOptions ), new BooleanProperty( false ), NaturalSelectionConstants.CHECKBOX_OPTIONS ),
        new Checkbox( new Text( earsString, textOptions ), new BooleanProperty( false ), NaturalSelectionConstants.CHECKBOX_OPTIONS ),
        new Checkbox( new Text( teethString, textOptions ), new BooleanProperty( false ), NaturalSelectionConstants.CHECKBOX_OPTIONS )
      ];

      // Arranged vertically
      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ titleNode, ...checkboxes ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PedigreeControlPanel', PedigreeControlPanel );
} );