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
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const ProportionLegendNode = require( 'NATURAL_SELECTION/common/view/ProportionLegendNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const straightEarsString = require( 'string!NATURAL_SELECTION/straightEars' );
  const floppyEarsString = require( 'string!NATURAL_SELECTION/floppyEars' );
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );
  const valuesString = require( 'string!NATURAL_SELECTION/values' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class ProportionControlPanel extends NaturalSelectionPanel {

    /**
     * @param {Property.<boolean>} valuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( valuesVisibleProperty, options ) {

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
        valuesVisibleProperty,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      // ------
      const separator = new HSeparator( options.fixedWidth - 2 * options.xMargin, {
        stroke: NaturalSelectionColors.SEPARATOR_STROKE
      } );

      // Legend for alleles
      const allelesLegend = [
        new ProportionLegendNode( whiteFurString, NaturalSelectionColors.FUR, false ),
        new ProportionLegendNode( brownFurString, NaturalSelectionColors.FUR, true ),
        new ProportionLegendNode( straightEarsString, NaturalSelectionColors.EARS, false ),
        new ProportionLegendNode( floppyEarsString, NaturalSelectionColors.EARS, true ),
        new ProportionLegendNode( shortTeethString, NaturalSelectionColors.TEETH, false ),
        new ProportionLegendNode( longTeethString, NaturalSelectionColors.TEETH, true )
      ];

      // Arranged vertically
      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ valuesCheckbox, separator, ...allelesLegend ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'ProportionControlPanel', ProportionControlPanel );
} );