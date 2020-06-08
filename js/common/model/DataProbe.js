// Copyright 2019-2020, University of Colorado Boulder

//TODO should probably have a positionProperty that changes as graph scrolls and user drags
/**
 * DataProbe is the model for the data probe on the Population graph. It shows population (y) values at a specific
 * generation (x) value on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';

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
      //TODO range needed?
    } );

    const countPropertyOptions = {
      isValidValues: value => ( value === null ) || ( typeof value === 'number' && Utils.isInteger( value ) ),
      phetioType: PropertyIO( NullableIO( NumberIO ) ),
      phetioReadOnly: true
    };


    //TODO replace *CountProperty with {Property.<BunnyCounts>} bunnyCountsProperty ?

    // @public counts displayed by the probe
    this.totalCountProperty = new Property( null, merge( {
      tandem: options.tandem.createTandem( 'totalCountProperty' )
    }, countPropertyOptions ) );
    this.whiteFurCountProperty = new Property( null, merge( {
      tandem: options.tandem.createTandem( 'whiteFurCountProperty' )
    }, countPropertyOptions ) );
    this.brownFurCountProperty = new Property( null, merge( {
      tandem: options.tandem.createTandem( 'brownFurCountProperty' )
    }, countPropertyOptions ) );
    this.straightEarsCountProperty = new Property( null, merge( {
      tandem: options.tandem.createTandem( 'straightEarsCountProperty' )
    }, countPropertyOptions ) );
    this.floppyEarsCountProperty = new Property( null, merge( {
      tandem: options.tandem.createTandem( 'floppyEarsCountProperty' )
    }, countPropertyOptions ) );
    this.shortTeethCountProperty = new Property( null, merge( {
      tandem: options.tandem.createTandem( 'shortTeethCountProperty' )
    }, countPropertyOptions ) );
    this.longTeethCountProperty = new Property( null, merge( {
      tandem: options.tandem.createTandem( 'longTeethCountProperty' )
    }, countPropertyOptions ) );
  }

  /**
   * @public
   */
  reset() {
    this.visibleProperty.reset();
    this.generationProperty.reset();
    this.totalCountProperty.reset();
    this.whiteFurCountProperty.reset();
    this.brownFurCountProperty.reset();
    this.straightEarsCountProperty.reset();
    this.floppyEarsCountProperty.reset();
    this.shortTeethCountProperty.reset();
    this.longTeethCountProperty.reset();
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