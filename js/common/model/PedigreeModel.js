// Copyright 2020, University of Colorado Boulder

/**
 * PedigreeModel is the sub-model used by the Pedigree view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyIO from './BunnyIO.js';

class PedigreeModel extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'model elements that are specific to the Pedigree feature'
    }, options );

    super( options );

    // @public {Property.<Bunny|null>}
    this.selectedBunnyProperty = new Property( null, {
      tandem: options.tandem.createTandem( 'selectedBunnyProperty' ),
      phetioType: PropertyIO( NullableIO( ReferenceIO( BunnyIO ) ) ),
      phetioDocumentation: 'the bunny whose pedigree is displayed, null if no bunny is selected'
    } );
    phet.log && this.selectedBunnyProperty.link( selectedBunny => {
      phet.log && phet.log( `selectedBunny=${selectedBunny}` );
    } );

    // @public visibility of the alleles for each gene type in the Pedigree tree
    this.furAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'furAllelesVisibleProperty' )
    } );
    this.earsAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'earsAllelesVisibleProperty' )
    } );
    this.teethAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'teethAllelesVisibleProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.selectedBunnyProperty.reset();
    this.furAllelesVisibleProperty.reset();
    this.earsAllelesVisibleProperty.reset();
    this.teethAllelesVisibleProperty.reset();
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