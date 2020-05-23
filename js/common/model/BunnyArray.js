// Copyright 2020, University of Colorado Boulder

/**
 * BunnyArray is an ObservableArray of Bunny instances, with counts for each phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';
import BunnyCountsIO from './BunnyCountsIO.js';

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
    this.countsProperty = new Property( BunnyCounts.ZERO.copy(), {
      tandem: options.tandem.createTandem( 'counts' ),
      phetioType: PropertyIO( BunnyCountsIO ),
      phetioState: false // because counts will be restored as Bunny instances are restored to BunnyGroup
    } );

    // Update counts when a bunny is added.
    this.addItemAddedListener( bunny => {
      this.countsProperty.value = this.countsProperty.value.plus( bunny );
      assert && assert( this.countsProperty.value.totalCount === this.length, 'counts out of sync' );
    } );

    // Update counts when a bunny is removed.
    this.addItemRemovedListener( bunny => {
      this.countsProperty.value = this.countsProperty.value.minus( bunny );
      assert && assert( this.countsProperty.value.totalCount === this.length, 'counts out of sync' );
    } );
  }
}

naturalSelection.register( 'BunnyArray', BunnyArray );
export default BunnyArray;