// Copyright 2020, University of Colorado Boulder

/**
 * BunnyArray is an ObservableArray of Bunny instances, with counts for each phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import BunnyCounts from './BunnyCounts.js';

class BunnyArray extends ObservableArray {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: ObservableArray.ObservableArrayIO( ReferenceIO( Bunny.BunnyIO ) ),
      phetioState: false
    }, options );

    super( options );

    // @public (read-only) {Property.<BunnyCounts>}
    this.countsProperty = new Property( BunnyCounts.withZero(), {
      tandem: options.tandem.createTandem( 'countsProperty' ),
      phetioType: Property.PropertyIO( BunnyCounts.BunnyCountsIO ),
      phetioState: false // because counts will be restored as Bunny instances are restored to BunnyGroup
    } );

    // Update counts when a bunny is added. removeItemAddedListener is not necessary.
    this.addItemAddedListener( bunny => {
      this.countsProperty.value = this.countsProperty.value.plus( bunny );
      assert && assert( this.countsProperty.value.totalCount === this.length, 'counts out of sync' );
    } );

    // Update counts when a bunny is removed. removeItemAddedListener is not necessary.
    this.addItemRemovedListener( bunny => {
      this.countsProperty.value = this.countsProperty.value.minus( bunny );
      assert && assert( this.countsProperty.value.totalCount === this.length, 'counts out of sync' );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'BunnyArray', BunnyArray );
export default BunnyArray;