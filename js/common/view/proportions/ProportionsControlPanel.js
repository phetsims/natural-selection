// Copyright 2019, University of Colorado Boulder

/**
 * ProportionsControlPanel is the panel that contains controls for the Proportions graph.
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
  const ProportionsLegendNode = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsLegendNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const straightEarsString = require( 'string!NATURAL_SELECTION/straightEars' );
  const floppyEarsString = require( 'string!NATURAL_SELECTION/floppyEars' );
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );
  const valuesString = require( 'string!NATURAL_SELECTION/values' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class ProportionsControlPanel extends NaturalSelectionPanel {

    /**
     * @param {ProportionsModel} proportionsModel
     * @param {Object} [options]
     */
    constructor( proportionsModel, options ) {

      options = merge( {
        fixedWidth: 100,
        xMargin: 0
      }, NaturalSelectionConstants.PANEL_OPTIONS, options );

      // Values
      const valuesCheckbox = new Checkbox(
        new Text( valuesString, {
          font: NaturalSelectionConstants.CHECKBOX_FONT,
          maxWidth: 100 // determined empirically
        } ),
        proportionsModel.valuesVisibleProperty,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      // ------
      const separator = new HSeparator( options.fixedWidth - 2 * options.xMargin, {
        stroke: NaturalSelectionColors.SEPARATOR_STROKE
      } );

      // Legend for alleles
      const legendNodes = [
        new ProportionsLegendNode( whiteFurString, NaturalSelectionColors.FUR, false ),
        new ProportionsLegendNode( brownFurString, NaturalSelectionColors.FUR, true ),
        new VStrut( 1 ),
        new ProportionsLegendNode( straightEarsString, NaturalSelectionColors.EARS, false ),
        new ProportionsLegendNode( floppyEarsString, NaturalSelectionColors.EARS, true ),
        new VStrut( 1 ),
        new ProportionsLegendNode( shortTeethString, NaturalSelectionColors.TEETH, false ),
        new ProportionsLegendNode( longTeethString, NaturalSelectionColors.TEETH, true )
      ];

      // Arranged vertically
      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ valuesCheckbox, separator, ...legendNodes ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'ProportionsControlPanel', ProportionsControlPanel );
} );