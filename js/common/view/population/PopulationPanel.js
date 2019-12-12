// Copyright 2019, University of Colorado Boulder

/**
 * PopulationPanel is the panel that contains controls for the 'Population' graph.
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
  const PopulationLegendCheckbox = require( 'NATURAL_SELECTION/common/view/population/PopulationLegendCheckbox' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const straightEarsString = require( 'string!NATURAL_SELECTION/straightEars' );
  const floppyEarsString = require( 'string!NATURAL_SELECTION/floppyEars' );
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );
  const totalString = require( 'string!NATURAL_SELECTION/total' );
  const dataProbeString = require( 'string!NATURAL_SELECTION/dataProbe' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class PopulationPanel extends NaturalSelectionPanel {

    /**
     * @param {PopulationModel} populationModel
     * @param {Object} [options]
     */
    constructor( populationModel, options ) {

      options = merge( {
        fixedWidth: 100,
        xMargin: 0,

        // phet-io
        tandem: Tandem.REQUIRED
      }, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [

          // Values Marker
          new Checkbox(
            new Text( dataProbeString, {
              font: NaturalSelectionConstants.CHECKBOX_FONT,
              maxWidth: 135 // determined empirically
            } ),
            populationModel.dataProbe.visibleProperty,
            merge( {
              tandem: options.tandem.createTandem( 'dataProbeCheckbox' )
            }, NaturalSelectionConstants.CHECKBOX_OPTIONS )
          ),

          // ------
          new HSeparator( options.fixedWidth - 2 * options.xMargin, {
            stroke: NaturalSelectionColors.SEPARATOR_STROKE,
            tandem: options.tandem.createTandem( 'separator' )
          } ),

          // Total
          new PopulationLegendCheckbox( populationModel.totalVisibleProperty, totalString, {
            color: NaturalSelectionColors.TOTAL_POPULATION,
            tandem: options.tandem.createTandem( 'totalCheckbox' )
          } ),

          // White Fur
          new PopulationLegendCheckbox( populationModel.whiteFurVisibleProperty, whiteFurString, {
            color: NaturalSelectionColors.FUR,
            tandem: options.tandem.createTandem( 'whiteFurCheckbox' )
          } ),

          // Brown Fur
          new PopulationLegendCheckbox( populationModel.brownFurVisibleProperty, brownFurString, {
            color: NaturalSelectionColors.FUR,
            isMutation: true,
            tandem: options.tandem.createTandem( 'brownFurCheckbox' )
          } ),

          // Straight Ears
          new PopulationLegendCheckbox( populationModel.straightEarsVisibleProperty, straightEarsString, {
            color: NaturalSelectionColors.EARS,
            tandem: options.tandem.createTandem( 'straightEarsCheckbox' )
          } ),

          // Floppy Ears
          new PopulationLegendCheckbox( populationModel.floppyEarsVisibleProperty, floppyEarsString, {
            color: NaturalSelectionColors.EARS,
            isMutation: true,
            tandem: options.tandem.createTandem( 'floppyEarsCheckbox' )
          } ),

          // Short Teeth
          new PopulationLegendCheckbox( populationModel.shortTeethVisibleProperty, shortTeethString, {
            color: NaturalSelectionColors.TEETH,
            tandem: options.tandem.createTandem( 'shortTeethCheckbox' )
          } ),

          // Long Teeth
          new PopulationLegendCheckbox( populationModel.longTeethVisibleProperty, longTeethString, {
            color: NaturalSelectionColors.TEETH,
            isMutation: true,
            tandem: options.tandem.createTandem( 'longTeethCheckbox' )
          } )
        ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PopulationPanel', PopulationPanel );
} );