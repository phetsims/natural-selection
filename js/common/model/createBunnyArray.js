// Copyright 2020-2022, University of Colorado Boulder

/**
 * createBunnyArray creates an observable Array that has counts for each phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import BunnyCounts from './BunnyCounts.js';

/**
 * @typedef {ObservableArrayDef} BunnyArrayDef
 * @property {Property.<BunnyCounts>} countsProperty
 */

/**
 * @param {Object} [options]
 * @returns {BunnyArrayDef}
 */
function createBunnyArray( options ) {

  options = merge( {

    // phet-io
    phetioType: createObservableArray.ObservableArrayIO( ReferenceIO( Bunny.BunnyIO ) ),
    tandem: Tandem.REQUIRED,
    phetioState: false
  }, options );

  const bunnyArray = createObservableArray( options );

  // @public (read-only) {Property.<BunnyCounts>}
  bunnyArray.countsProperty = new Property( BunnyCounts.withZero(), {
    tandem: options.tandem.createTandem( 'countsProperty' ),
    phetioValueType: BunnyCounts.BunnyCountsIO,
    phetioState: false // because counts will be restored as Bunny instances are restored to BunnyGroup
  } );

  // Update counts when a bunny is added. removeItemAddedListener is not necessary.
  bunnyArray.addItemAddedListener( bunny => {
    bunnyArray.countsProperty.value = bunnyArray.countsProperty.value.plus( bunny );
    assert && assert( bunnyArray.countsProperty.value.totalCount === bunnyArray.length, 'counts out of sync' );
  } );

  // Update counts when a bunny is removed. removeItemAddedListener is not necessary.
  bunnyArray.addItemRemovedListener( bunny => {
    bunnyArray.countsProperty.value = bunnyArray.countsProperty.value.minus( bunny );
    assert && assert( bunnyArray.countsProperty.value.totalCount === bunnyArray.length, 'counts out of sync' );
  } );

  /**
   * @public
   * @override
   */
  bunnyArray.dispose = () => {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  };

  return bunnyArray;
}

naturalSelection.register( 'createBunnyArray', createBunnyArray );
export default createBunnyArray;