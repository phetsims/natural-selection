// Copyright 2020, University of Colorado Boulder

/**
 * BunnyArray is an ObservableArray of Bunny instances, with counts for each phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArray from '../../../../axon/js/ObservableArray.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';

class BunnyArray extends ObservableArray {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // @public (read-only)
    this.counts = new BunnyCounts( {
      tandem: options.tandem.createTandem( 'counts' )
    } );

    this.addItemAddedListener( bunny => {
      this.counts.add( bunny );
      assert && assert( this.counts.totalCountProperty.value === this.length, 'counts out of sync' );
    } );

    this.addItemRemovedListener( bunny => {
      this.counts.subtract( bunny );
      assert && assert( this.counts.totalCountProperty.value === this.length, 'counts out of sync' );
    } );
  }
}

naturalSelection.register( 'BunnyArray', BunnyArray );
export default BunnyArray;