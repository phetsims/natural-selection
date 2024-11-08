// Copyright 2020-2024, University of Colorado Boulder

/**
 * createBunnyArray creates an observable Array that has counts for each phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import createObservableArray, { ObservableArray, ObservableArrayOptions } from '../../../../axon/js/createObservableArray.js';
import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import BunnyCounts from './BunnyCounts.js';

// Additional properties that will be added to ObservableArray<Bunny>
type AdditionalProperties = {
  countsProperty: Property<BunnyCounts>;
};

export type BunnyArray = ObservableArray<Bunny> & AdditionalProperties;

type SelfOptions = {
  countsPropertyFeatured?: boolean; // phetioFeatured value for countsProperty
};

type BunnyArrayOptions = SelfOptions & ObservableArrayOptions<Bunny> &
  PickRequired<ObservableArrayOptions<Bunny>, 'tandem'>;

export default function createBunnyArray( providedOptions: BunnyArrayOptions ): BunnyArray {

  const options = optionize<BunnyArrayOptions, SelfOptions, ObservableArrayOptions<Bunny>>()( {

    // SelfOptions
    countsPropertyFeatured: false,

    // ObservableArrayOptions
    phetioType: createObservableArray.ObservableArrayIO( ReferenceIO( Bunny.BunnyIO ) )
  }, providedOptions );

  // We want to add countsProperty later, so do a little TypeScript hackery here to make that possible.
  const bunnyArray: ObservableArray<Bunny> & Partial<AdditionalProperties> = createObservableArray( options );

  const countsProperty = new Property( BunnyCounts.withZero(), {
    tandem: options.tandem.createTandem( 'countsProperty' ),
    phetioValueType: BunnyCounts.BunnyCountsIO,
    phetioFeatured: options.countsPropertyFeatured,
    phetioReadOnly: true
  } );

  bunnyArray.countsProperty = countsProperty;

  // Update counts when a bunny is added. removeItemAddedListener is not necessary.
  bunnyArray.addItemAddedListener( bunny => {

    // The bunnyArray and the countsProperty are PhET-iO Stateful, so this shouldn't occur during state setting.
    // Also, the bunnyArray's listeners are deferred until all values are set, so bunnyArray.length is the final length
    // for each call to this listener.
    if ( !isSettingPhetioStateProperty.value ) {
      countsProperty.value = countsProperty.value.plus( bunny );
      assert && assert( countsProperty.value.totalCount === bunnyArray.length, 'counts out of sync' );
    }
  } );

  // Update counts when a bunny is removed. removeItemAddedListener is not necessary.
  bunnyArray.addItemRemovedListener( bunny => {

    // The bunnyArray and the countsProperty are PhET-iO Stateful, so this shouldn't occur during state setting.
    // Also, the bunnyArray's listeners are deferred until all values are set, so bunnyArray.length is the final length
    // for each call to this listener.
    if ( !isSettingPhetioStateProperty.value ) {
      countsProperty.value = countsProperty.value.minus( bunny );
      assert && assert( countsProperty.value.totalCount === bunnyArray.length, 'counts out of sync' );
    }
  } );

  // State may set in an unexpected order, but by the end, we must have the right counts.
  if ( assert && Tandem.PHET_IO_ENABLED ) {
    phetioStateSetEmitter.addListener( () => {
      assert && assert( countsProperty.value.totalCount === bunnyArray.length, 'counts out of sync' );
    } );
  }

  bunnyArray.dispose = () => {
    Disposable.assertNotDisposable();
  };

  return bunnyArray as BunnyArray;
}

naturalSelection.register( 'createBunnyArray', createBunnyArray );