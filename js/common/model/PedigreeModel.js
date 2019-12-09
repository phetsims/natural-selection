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

  // constants
  const CHECKBOXES_ENABLED = true; //TODO for debugging, delete this, should be false

  class PedigreeModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public visibility of the alleles for each gene in the Pedigree tree
      this.furAllelesVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'furAllelesVisibleProperty' )
      } );
      this.earsAllelesVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'earsAllelesVisibleProperty' )
      } );
      this.teethAllelesVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'teethAllelesVisibleProperty' )
      } );

      // @public enabled state of each row in the Alleles panel
      // Checkboxes are disabled until an associated mutation is applied.
      this.furEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED, {
        tandem: tandem.createTandem( 'furEnabledProperty' )
      } );
      this.earsEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED, {
        tandem: tandem.createTandem( 'earsEnabledProperty' )
      } );
      this.teethEnabledProperty = new BooleanProperty( CHECKBOXES_ENABLED, {
        tandem: tandem.createTandem( 'teethEnabledProperty' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.furAllelesVisibleProperty.reset();
      this.earsAllelesVisibleProperty.reset();
      this.teethAllelesVisibleProperty.reset();

      this.furEnabledProperty.reset();
      this.earsEnabledProperty.reset();
      this.teethEnabledProperty.reset();
    }
  }

  return naturalSelection.register( 'PedigreeModel', PedigreeModel );
} );