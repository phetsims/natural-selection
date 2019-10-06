// Copyright 2019, University of Colorado Boulder

/**
 * LabViewProperties contains view-specific Properties for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionViewProperties = require( 'NATURAL_SELECTION/common/view/NaturalSelectionViewProperties' );

  class LabViewProperties extends NaturalSelectionViewProperties {

    constructor() {
      super();

      // @public visibility of traits on the Population graph
      this.populationWhiteFurVisibleProperty = new BooleanProperty( false );
      this.populationBrownFurVisibleProperty = new BooleanProperty( false );
      this.populationTallEarsVisibleProperty = new BooleanProperty( false );
      this.populationFlatEarsVisibleProperty = new BooleanProperty( false );
      this.populationShortTeethVisibleProperty = new BooleanProperty( false );
      this.populationLongTeethVisibleProperty = new BooleanProperty( false );

      // @public visibility of alleles on the Pedigree graph
      this.furAllelesVisibleProperty = new BooleanProperty( false );
      this.earAllelesVisibleProperty = new BooleanProperty( false );
      this.teethAllelesVisibleProperty = new BooleanProperty( false );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.populationWhiteFurVisibleProperty.reset();
      this.populationBrownFurVisibleProperty.reset();
      this.populationTallEarsVisibleProperty.reset();
      this.populationFlatEarsVisibleProperty.reset();
      this.populationShortTeethVisibleProperty.reset();
      this.populationLongTeethVisibleProperty.reset();
      this.furAllelesVisibleProperty.reset();
      this.earAllelesVisibleProperty.reset();
      this.teethAllelesVisibleProperty.reset();
    }
  }

  return naturalSelection.register( 'LabViewProperties', LabViewProperties );
} );