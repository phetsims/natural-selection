// Copyright 2019-2020, University of Colorado Boulder

//TODO should probably have a positionProperty that changes as graph scrolls and user drags
/**
 * DataProbe is the model for the data probe on the Population graph. It shows population (y) values at a specific
 * generation (x) value on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Utils = require( 'DOT/Utils' );

  class DataProbe {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public visibility of the probe
      this.visibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'visibleProperty' )
      } );

      // @public the generation (x) value
      this.generationProperty = new NumberProperty( 0, {
        tandem: tandem.createTandem( 'generationProperty' ),
        phetioStudioControl: false //TODO range is dynamic
      } );

      const populationPropertyOptions = {
        isValidValues: value => ( value === null ) || ( typeof value === 'number' && Utils.isInteger( value ) ),
        phetioType: PropertyIO( NullableIO( NumberIO ) ),
        phetioReadOnly: true
      };

      //TODO bogus values, for demo purposes
      // @public counts displayed by the probe
      this.totalPopulationProperty = new Property( 1000, merge( {
          tandem: tandem.createTandem( 'totalPopulationProperty' )
        }, populationPropertyOptions )
      );
      this.whiteFurPopulationProperty = new Property( 600, merge( {
          tandem: tandem.createTandem( 'whiteFurPopulationProperty' )
        }, populationPropertyOptions )
      );
      this.brownFurPopulationProperty = new Property( 400, merge( {
          tandem: tandem.createTandem( 'brownFurPopulationProperty' )
        }, populationPropertyOptions )
      );
      this.straightEarsPopulationProperty = new Property( 988, merge( {
          tandem: tandem.createTandem( 'straightEarsPopulationProperty' )
        }, populationPropertyOptions )
      );
      this.floppyEarsPopulationProperty = new Property( 12, merge( {
          tandem: tandem.createTandem( 'floppyEarsPopulationProperty' )
        }, populationPropertyOptions )
      );
      this.shortTeethPopulationProperty = new Property( 1000, merge( {
          tandem: tandem.createTandem( 'shortTeethPopulationProperty' )
        }, populationPropertyOptions )
      );
      this.longTeethPopulationProperty = new Property( 0, merge( {
          tandem: tandem.createTandem( 'longTeethPopulationProperty' )
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

  return naturalSelection.register( 'DataProbe', DataProbe );
} );