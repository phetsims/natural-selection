// Copyright 2019, University of Colorado Boulder

/**
 * PopulationControlPanel is the panel that contains controls for the 'Population' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
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
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const flatEarsString = require( 'string!NATURAL_SELECTION/flatEars' );
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );
  const tallEarsString = require( 'string!NATURAL_SELECTION/tallEars' );
  const totalString = require( 'string!NATURAL_SELECTION/total' );
  const valuesMarkerString = require( 'string!NATURAL_SELECTION/valuesMarker' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class PopulationControlPanel extends NaturalSelectionPanel {

    /**
     * @param {Property.<boolean>} totalVisibleProperty
     * @param {Property.<boolean>} valuesMarkerVisibleProperty
     * @param {Object} [options]
     */
    constructor( totalVisibleProperty, valuesMarkerVisibleProperty, options ) {

      options = merge( {
        fixedWidth: 100,
        xMargin: 0
      }, NaturalSelectionConstants.PANEL_OPTIONS, options );

      // Values Marker
      const valuesMarkerCheckbox = new Checkbox(
        new Text( valuesMarkerString, { font: NaturalSelectionConstants.CHECKBOX_FONT } ),
        valuesMarkerVisibleProperty,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      // ------
      const separator = new HSeparator( options.fixedWidth - 2 * options.xMargin, {
        stroke: NaturalSelectionColors.SEPARATOR_STROKE
      } );

      // Total
      const totalCheckbox = new PopulationCheckbox( totalVisibleProperty, totalString, NaturalSelectionColors.TOTAL_POPULATION, false );

      //TODO temporary BooleanProperty for each checkbox
      // Checkbox for each allele
      const alleleCheckboxes = [
        new PopulationCheckbox( new BooleanProperty( false ), whiteFurString, NaturalSelectionColors.FUR, false ),
        new PopulationCheckbox( new BooleanProperty( false ), brownFurString, NaturalSelectionColors.FUR, true ),
        new PopulationCheckbox( new BooleanProperty( false ), tallEarsString, NaturalSelectionColors.EARS, false ),
        new PopulationCheckbox( new BooleanProperty( false ), flatEarsString, NaturalSelectionColors.EARS, true ),
        new PopulationCheckbox( new BooleanProperty( false ), shortTeethString, NaturalSelectionColors.TEETH, false ),
        new PopulationCheckbox( new BooleanProperty( false ), longTeethString, NaturalSelectionColors.TEETH, true )
      ];

      // Arranged vertically
      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ valuesMarkerCheckbox, separator, totalCheckbox, ...alleleCheckboxes ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PopulationControlPanel', PopulationControlPanel );
} );