// Copyright 2020, University of Colorado Boulder

/**
 * SelectedBunnyProperty is the Property used for the selected bunny in the Pedigree model.
 * A null value indicates that there is no selection.
 *
 * This class exists mainly to hide some PhET-iO details, and to simplify type checking when it's passed around
 * as an argument to other methods.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';

class SelectedBunnyProperty extends Property {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {Bunny|null} null means no selection
      selectedBunny: null,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Property.PropertyIO( NullableIO( ReferenceIO( Bunny.BunnyIO ) ) ),
      phetioDocumentation: 'the selected bunny, null if no bunny is selected'
    }, options );

    super( options.selectedBunny, options );
  }
}

naturalSelection.register( 'SelectedBunnyProperty', SelectedBunnyProperty );
export default SelectedBunnyProperty;