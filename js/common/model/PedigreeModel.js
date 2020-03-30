// Copyright 2019-2020, University of Colorado Boulder

/**
 * PedigreeModel is the sub-model used by the Pedigree view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

class PedigreeModel extends PhetioObject {

  /**
   * @param {Property.<Bunny|null>} selectedBunnyProperty
   * @param {Tandem} tandem
   */
  constructor( selectedBunnyProperty, tandem ) {

    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {

      // phet-io
      tandem: tandem,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'portion of the model that deals with the Pedigree graph'
    } );

    // @public
    this.selectedBunnyProperty = selectedBunnyProperty;

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
   * @override
   */
  dispose() {
    assert && assert( false, 'PedigreeModel does not support dispose' );
  }
}

naturalSelection.register( 'PedigreeModel', PedigreeModel );
export default PedigreeModel;