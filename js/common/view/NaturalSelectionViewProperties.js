// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionViewProperties contains view-specific Properties that are common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Graphs from './Graphs.js';

class NaturalSelectionViewProperties {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public
    this.graphProperty = new EnumerationProperty( Graphs, Graphs.POPULATION, {
      tandem: tandem.createTandem( 'graphProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.graphProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'NaturalSelectionViewProperties does not support dispose' );
  }
}

naturalSelection.register( 'NaturalSelectionViewProperties', NaturalSelectionViewProperties );
export default NaturalSelectionViewProperties;