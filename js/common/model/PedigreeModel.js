// Copyright 2019-2020, University of Colorado Boulder

/**
 * PedigreeModel is the sub-model used by the Pedigree view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

class PedigreeModel extends PhetioObject {

  /**
   * @param {Property.<Bunny|null>} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( selectedBunnyProperty, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'portion of the model that deals with the Pedigree graph'
    }, options );

    super( options );

    // @public
    this.selectedBunnyProperty = selectedBunnyProperty;

    // @public visibility of the alleles for each gene in the Pedigree tree
    this.furAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'furAllelesVisibleProperty' )
    } );
    this.earsAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'earsAllelesVisibleProperty' )
    } );
    this.teethAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'teethAllelesVisibleProperty' )
    } );

    // @public whether a mutation exists for each trait
    // Checkboxes in the Alleles panel are disabled until a mutation exists.
    this.furMutationExistsProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'furMutationExistsProperty' ),
      phetioReadOnly: true
    } );
    this.earsMutationExistsProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'earsMutationExistsProperty' ),
      phetioReadOnly: true
    } );
    this.teethMutationExistsProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'teethMutationExistsProperty' ),
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