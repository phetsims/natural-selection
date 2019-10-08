// Copyright 2019, University of Colorado Boulder

/**
 * LabView is the view for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const LabViewProperties = require( 'NATURAL_SELECTION/lab/view/LabViewProperties' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionScreenView = require( 'NATURAL_SELECTION/common/view/NaturalSelectionScreenView' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const earsString = require( 'string!NATURAL_SELECTION/ears' );
  const flatEarsString = require( 'string!NATURAL_SELECTION/flatEars' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );
  const tallEarsString = require( 'string!NATURAL_SELECTION/tallEars' );
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class LabScreenView extends NaturalSelectionScreenView {

    /**
     * @param {LabModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      const viewProperties = new LabViewProperties();

      const traits = [
        { label: whiteFurString, property: viewProperties.populationWhiteFurVisibleProperty, color: NaturalSelectionColors.FUR_GRAPH_COLOR, lineStyle: 'solid' },
        { label: brownFurString, property: viewProperties.populationBrownFurVisibleProperty, color: NaturalSelectionColors.FUR_GRAPH_COLOR, lineStyle: 'dashed' },
        { label: tallEarsString, property: viewProperties.populationTallEarsVisibleProperty, color: NaturalSelectionColors.EARS_GRAPH_COLOR, lineStyle: 'solid' },
        { label: flatEarsString, property: viewProperties.populationFlatEarsVisibleProperty, color: NaturalSelectionColors.EARS_GRAPH_COLOR, lineStyle: 'dashed' },
        { label: shortTeethString, property: viewProperties.populationShortTeethVisibleProperty, color: NaturalSelectionColors.TEETH_GRAPH_COLOR, lineStyle: 'solid' },
        { label: longTeethString, property: viewProperties.populationLongTeethVisibleProperty, color: NaturalSelectionColors.TEETH_GRAPH_COLOR, lineStyle: 'dashed' }
      ];

      const alleles = [
        { label: furString, property: viewProperties.furAllelesVisibleProperty },
        { label: earsString, property: viewProperties.earAllelesVisibleProperty },
        { label: teethString, property: viewProperties.teethAllelesVisibleProperty }
      ];

      super( model, viewProperties, traits, alleles, tandem );

      //TODO

      // @private
      this.viewProperties = viewProperties;
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.viewProperties.reset();
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {
      super.step( dt );
      //TODO
    }
  }

  return naturalSelection.register( 'LabScreenView', LabScreenView );
} );