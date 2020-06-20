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
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';
import BunnyCountsIO from './BunnyCountsIO.js';
import PopulationModel from './PopulationModel.js';

class DataProbe extends PhetioObject {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {
    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false // to prevent serialization, because we don't have an IO type
    }, options );

    super( options );

    // @private
    this.populationModel = populationModel;

    // @public
    this.offsetProperty = new Vector2Property( Vector2.ZERO, {
      tandem: options.tandem.createTandem( 'offsetProperty' ),
      phetioDocumentation: 'offset of the data from the left edge of the graph'
    } );

    // @public
    this.generationProperty = new DerivedProperty(
      [ populationModel.xRangeProperty, this.offsetProperty ],
      ( xRange, offset ) => xRange.min + offset.x, {
        tandem: options.tandem.createTandem( 'generationProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'the generation (x-axis) value where the data probe is positioned'
      } );

    // @public Set BunnyCounts based on position of the data probe. dispose is not necessary.
    this.countsProperty = new DerivedProperty( [ this.generationProperty, populationModel.generationsProperty ],
      ( generation, generations ) => this.getCounts( generation, generations ), {
        tandem: options.tandem.createTandem( 'countsProperty' ),
        phetioType: DerivedPropertyIO( NullableIO( BunnyCountsIO ) ),
        phetioDocumentation: 'counts displayed by the data probe'
      } );

    // @public visibility of the probe
    this.visibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
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
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  //TODO generation and generations is confusing!
  /**
   * Gets the bunny counts for a specific generation value.
   * @param {number} generation
   * @param {number} generations - current value of the generation clock
   * @returns {BunnyCounts|null}
   * @private
   */
  getCounts( generation, generations ) {
    let counts = null;
    if ( generation <= generations && generations > 0 ) {
      counts = new BunnyCounts( {
        totalCount: this.getCount( generation, this.populationModel.totalPoints ),
        whiteFurCount: this.getCount( generation, this.populationModel.whiteFurPoints ),
        brownFurCount: this.getCount( generation, this.populationModel.brownFurPoints ),
        straightEarsCount: this.getCount( generation, this.populationModel.straightEarsPoints ),
        floppyEarsCount: this.getCount( generation, this.populationModel.floppyEarsPoints ),
        shortTeethCount: this.getCount( generation, this.populationModel.shortTeethPoints ),
        longTeethCount: this.getCount( generation, this.populationModel.longTeethPoints )
      } );
    }
    return counts;
  }

  /**
   * Gets the population count (y value) for a specific generation (x value).
   * @param {number} generation
   * @param {ObservableArray.<Vector2>} points
   * @returns {number}
   * @private
   */
  getCount( generation, points ) {
    let count = 0;
    for ( let i = points.length - 1; i >=0; i-- ) {
      const point = points.get( i );
      if ( generation >= point.x ) {
        count = point.y;
        break;
      }
    }
    return count;
  }
}

naturalSelection.register( 'DataProbe', DataProbe );
export default DataProbe;