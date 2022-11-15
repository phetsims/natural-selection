// Copyright 2020-2022, University of Colorado Boulder

/**
 * createBunnyArray creates an observable Array that has counts for each phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import createObservableArray, { ObservableArray, ObservableArrayOptions } from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import BunnyCounts from './BunnyCounts.js';

// Additional properties that will be added to ObservableArray<Bunny>
type AdditionalProperties = {
  countsProperty: Property<BunnyCounts>;
};

export type BunnyArray = ObservableArray<Bunny> & AdditionalProperties;

type SelfOptions = EmptySelfOptions;

type BunnyArrayOptions = SelfOptions & ObservableArrayOptions<Bunny> &
  PickRequired<ObservableArrayOptions<Bunny>, 'tandem'>;

export default function createBunnyArray( providedOptions: BunnyArrayOptions ): BunnyArray {

  const options = optionize<BunnyArrayOptions, SelfOptions, ObservableArrayOptions<Bunny>>()( {

    // ObservableArrayOptions
    phetioType: createObservableArray.ObservableArrayIO( ReferenceIO( Bunny.BunnyIO ) ),
    phetioState: false
  }, providedOptions );

  // We want to add countsProperty later, so do a little TypeScript hackery here to make that possible.
  const bunnyArray: ObservableArray<Bunny> & Partial<AdditionalProperties> = createObservableArray( options );

  const countsProperty = new Property( BunnyCounts.withZero(), {
    tandem: options.tandem.createTandem( 'countsProperty' ),
    phetioValueType: BunnyCounts.BunnyCountsIO,
    phetioState: false // because counts will be restored as Bunny instances are restored to BunnyGroup
  } );

  bunnyArray.countsProperty = countsProperty;

  // Update counts when a bunny is added. removeItemAddedListener is not necessary.
  bunnyArray.addItemAddedListener( bunny => {
    countsProperty.value = countsProperty.value.plus( bunny );
    assert && assert( countsProperty.value.totalCount === bunnyArray.length, 'counts out of sync' );
  } );

  // Update counts when a bunny is removed. removeItemAddedListener is not necessary.
  bunnyArray.addItemRemovedListener( bunny => {
    countsProperty.value = countsProperty.value.minus( bunny );
    assert && assert( countsProperty.value.totalCount === bunnyArray.length, 'counts out of sync' );
  } );

  bunnyArray.dispose = () => {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  };

  return bunnyArray as BunnyArray;
}

naturalSelection.register( 'createBunnyArray', createBunnyArray );