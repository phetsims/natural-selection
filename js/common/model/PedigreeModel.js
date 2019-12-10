// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeModel is the sub-model used by the Pedigree view.
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

      // @public whether a mutation exists for each trait
      // Checkboxes in the Alleles panel are disabled until a mutation exists.
      this.furMutationExistsProperty = new BooleanProperty( CHECKBOXES_ENABLED, {
        tandem: tandem.createTandem( 'furMutationExistsProperty' )
      } );
      this.earsMutationExistsProperty = new BooleanProperty( CHECKBOXES_ENABLED, {
        tandem: tandem.createTandem( 'earsMutationExistsProperty' )
      } );
      this.teethMutationExistsProperty = new BooleanProperty( CHECKBOXES_ENABLED, {
        tandem: tandem.createTandem( 'teethMutationExistsProperty' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.furAllelesVisibleProperty.reset();
      this.earsAllelesVisibleProperty.reset();
      this.teethAllelesVisibleProperty.reset();

      this.furMutationExistsProperty.reset();
      this.earsMutationExistsProperty.reset();
      this.teethMutationExistsProperty.reset();
    }
  }

  return naturalSelection.register( 'PedigreeModel', PedigreeModel );
} );