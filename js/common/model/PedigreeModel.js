// Copyright 2019-2020, University of Colorado Boulder

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
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const Tandem = require( 'TANDEM/Tandem' );

  class PedigreeModel extends PhetioObject {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      super( {
        tandem: tandem,
        phetioState: false // to prevent serialization, because we don't have an IO type
      } );

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
      this.furMutationExistsProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'furMutationExistsProperty' ),
        phetioReadOnly: true
      } );
      this.earsMutationExistsProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'earsMutationExistsProperty' ),
        phetioReadOnly: true
      } );
      this.teethMutationExistsProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'teethMutationExistsProperty' ),
        phetioReadOnly: true
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

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'PedigreeModel does not support dispose' );
    }
  }

  return naturalSelection.register( 'PedigreeModel', PedigreeModel );
} );