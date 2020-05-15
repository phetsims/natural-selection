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

    const populationPropertyOptions = {
      isValidValues: value => ( value === null ) || ( typeof value === 'number' && Utils.isInteger( value ) ),
      phetioType: PropertyIO( NullableIO( NumberIO ) ),
      phetioReadOnly: true
    };

    //TODO bogus values, for demo purposes
    // @public counts displayed by the probe
    this.totalPopulationProperty = new Property( 1000, merge( {
        tandem: options.tandem.createTandem( 'totalPopulationProperty' )
      }, populationPropertyOptions )
    );
    this.whiteFurPopulationProperty = new Property( 600, merge( {
        tandem: options.tandem.createTandem( 'whiteFurPopulationProperty' )
      }, populationPropertyOptions )
    );
    this.brownFurPopulationProperty = new Property( 400, merge( {
        tandem: options.tandem.createTandem( 'brownFurPopulationProperty' )
      }, populationPropertyOptions )
    );
    this.straightEarsPopulationProperty = new Property( 988, merge( {
        tandem: options.tandem.createTandem( 'straightEarsPopulationProperty' )
      }, populationPropertyOptions )
    );
    this.floppyEarsPopulationProperty = new Property( 12, merge( {
        tandem: options.tandem.createTandem( 'floppyEarsPopulationProperty' )
      }, populationPropertyOptions )
    );
    this.shortTeethPopulationProperty = new Property( 1000, merge( {
        tandem: options.tandem.createTandem( 'shortTeethPopulationProperty' )
      }, populationPropertyOptions )
    );
    this.longTeethPopulationProperty = new Property( 0, merge( {
        tandem: options.tandem.createTandem( 'longTeethPopulationProperty' )
      }, populationPropertyOptions )
    );
  }

  /**
   * @public
   */
  reset() {
    this.visibleProperty.reset();
    this.generationProperty.reset();
    this.totalPopulationProperty.reset();
    this.whiteFurPopulationProperty.reset();
    this.brownFurPopulationProperty.reset();
    this.straightEarsPopulationProperty.reset();
    this.floppyEarsPopulationProperty.reset();
    this.shortTeethPopulationProperty.reset();
    this.longTeethPopulationProperty.reset();
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