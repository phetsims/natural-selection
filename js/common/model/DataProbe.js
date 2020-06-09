// Copyright 2019-2020, University of Colorado Boulder

//TODO should probably have a positionProperty that changes as graph scrolls and user drags
/**
 * DataProbe is the model for the data probe on the Population graph. It shows population (y-axis) values at a specific
 * generation (x-axis) value on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCountsIO from './BunnyCountsIO.js';

class DataProbe extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false // to prevent serialization, because we don't have an IO type
    }, options );

    super( options );

    // @public visibility of the probe
    this.visibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );

    // @public the generation (x) value
    this.generationProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'generationProperty' ),
      phetioReadOnly: true // range is dynamic
    } );

    // @public counts displayed by the probe
    this.countsProperty = new DerivedProperty( [ this.generationProperty ],

      //TODO set BunnyCounts based on position of the data probe
      generation => null, {
      tandem: options.tandem.createTandem( 'countsProperty' ),
      phetioType: DerivedPropertyIO( NullableIO( BunnyCountsIO ) )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.visibleProperty.reset();
    this.generationProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'DataProbe does not support dispose' );
  }
}

naturalSelection.register( 'DataProbe', DataProbe );
export default DataProbe;