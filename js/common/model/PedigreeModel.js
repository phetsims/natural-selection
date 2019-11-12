// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeModel is the model used by the Pedigree view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class PedigreeModel {

    constructor() {

      // @public visibility of each gene in the pedigree's genotype expression
      this.furVisibleProperty = new BooleanProperty( false );
      this.earsVisibleProperty = new BooleanProperty( false );
      this.teethVisibleProperty = new BooleanProperty( false );

      // @public enabled state of the checkbox for each gene in the pedigree's control panel
      // Checkboxes are disabled until an associated mutation is applied.
      this.furEnabledProperty = new BooleanProperty( false );
      this.earsEnabledProperty = new BooleanProperty( false );
      this.teethEnabledProperty = new BooleanProperty( false );
    }

    /**
     * @public
     */
    reset() {
      this.furVisibleProperty.reset();
      this.earsVisibleProperty.reset();
      this.teethVisibleProperty.reset();

      this.furEnabledProperty.reset();
      this.earsEnabledProperty.reset();
      this.teethEnabledProperty.reset();
    }
  }

  return naturalSelection.register( 'PedigreeModel', PedigreeModel );
} );