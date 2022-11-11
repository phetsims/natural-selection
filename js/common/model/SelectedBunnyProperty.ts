// Copyright 2020-2022, University of Colorado Boulder

/**
 * SelectedBunnyProperty is the Property used for the selected bunny in the Pedigree model.
 * A null value indicates that there is no selection.
 *
 * This class exists mainly to hide some PhET-iO details, and to simplify type checking when it's passed around
 * as an argument to other methods.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property, { PropertyOptions } from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';

type SelectBunnyValue = Bunny | null; // null means no selection

type SelfOptions = {
  selectedBunny?: SelectBunnyValue;
};

type SelectedBunnyPropertyOptions = SelfOptions & PickRequired<PropertyOptions<SelectBunnyValue>, 'tandem'>;

export default class SelectedBunnyProperty extends Property<SelectBunnyValue> {

  public constructor( providedOptions: SelectedBunnyPropertyOptions ) {

    const options = optionize<SelectedBunnyPropertyOptions, SelfOptions, PropertyOptions<SelectBunnyValue>>()( {

      // SelfOptions
      selectedBunny: null,

      // PropertyOptions
      phetioValueType: NullableIO( ReferenceIO( Bunny.BunnyIO ) ),
      phetioDocumentation: 'the selected bunny, null if no bunny is selected'
    }, providedOptions );

    super( options.selectedBunny, options );
  }
}

naturalSelection.register( 'SelectedBunnyProperty', SelectedBunnyProperty );