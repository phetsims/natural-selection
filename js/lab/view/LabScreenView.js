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
  const NaturalSelectionScreenView = require( 'NATURAL_SELECTION/common/view/NaturalSelectionScreenView' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const earsAllelesString = require( 'string!NATURAL_SELECTION/earsAlleles' );
  const flatEarsString = require( 'string!NATURAL_SELECTION/flatEars' );
  const furAllelesString = require( 'string!NATURAL_SELECTION/furAlleles' );
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );
  const tallEarsString = require( 'string!NATURAL_SELECTION/tallEars' );
  const teethAllelesString = require( 'string!NATURAL_SELECTION/teethAlleles' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class LabScreenView extends NaturalSelectionScreenView {

    /**
     * @param {LabModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      const viewProperties = new LabViewProperties();

      const traits = [
        { label: whiteFurString, property: viewProperties.populationWhiteFurVisibleProperty },
        { label: brownFurString, property: viewProperties.populationBrownFurVisibleProperty },
        { label: tallEarsString, property: viewProperties.populationTallEarsVisibleProperty },
        { label: flatEarsString, property: viewProperties.populationFlatEarsVisibleProperty },
        { label: shortTeethString, property: viewProperties.populationShortTeethVisibleProperty },
        { label: longTeethString, property: viewProperties.populationLongTeethVisibleProperty }
      ];

      const alleles = [
        { label: furAllelesString, property: viewProperties.furAllelesVisibleProperty },
        { label: earsAllelesString, property: viewProperties.earAllelesVisibleProperty },
        { label: teethAllelesString, property: viewProperties.teethAllelesVisibleProperty }
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