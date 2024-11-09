// Copyright 2020-2024, University of Colorado Boulder

/**
 * ProportionsCounts is a data structure used by the Proportions model. It describes the bunny population at
 * the start and end of a generation. This is static, immutable data.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCounts, { BunnyCountsStateObject } from './BunnyCounts.js';

type ProportionsCountsStateObject = {
  generation: number;
  startCounts: BunnyCountsStateObject;
  endCounts: BunnyCountsStateObject;
};

export default class ProportionsCounts {

  public readonly generation: number;
  public readonly startCounts: BunnyCounts;
  public readonly endCounts: BunnyCounts;

  public constructor( generation: number, startCounts: BunnyCounts, endCounts: BunnyCounts ) {

    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( generation ), 'invalid generation' );

    this.generation = generation;
    this.startCounts = startCounts;
    this.endCounts = endCounts;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by ProportionsCountsIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Deserializes a ProportionsCounts instance.
   */
  private static fromStateObject( stateObject: ProportionsCountsStateObject ): ProportionsCounts {
    return new ProportionsCounts(
      stateObject.generation,
      BunnyCounts.BunnyCountsIO.fromStateObject( stateObject.startCounts ),
      BunnyCounts.BunnyCountsIO.fromStateObject( stateObject.endCounts )
    );
  }

  /**
   * ProportionsCountsIO implements 'Data type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Data type serialization is appropriate because ProportionsCounts itself is not a PhetioObject. Its role is as
   * a data type - similar to number, string, or Vector2. In ProportionsModel, previousCounts is an ObservableArray
   * whose elements are of type ProportionsCounts.
   */
  public static readonly ProportionsCountsIO = new IOType<ProportionsCounts, ProportionsCountsStateObject>( 'ProportionsCountsIO', {
    valueType: ProportionsCounts,
    stateSchema: {
      generation: NumberIO,
      startCounts: BunnyCounts.BunnyCountsIO,
      endCounts: BunnyCounts.BunnyCountsIO
    },
    // toStateObject: The default works fine here.
    fromStateObject: stateObject => ProportionsCounts.fromStateObject( stateObject )
  } );
}

naturalSelection.register( 'ProportionsCounts', ProportionsCounts );