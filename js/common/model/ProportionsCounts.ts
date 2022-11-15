// Copyright 2020-2022, University of Colorado Boulder

/**
 * ProportionsCounts is a data structure used by the Proportions model. It describes the bunny population at
 * the start and end of a generation. This is static, immutable data.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts, { BunnyCountsStateObject } from './BunnyCounts.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';

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
   * Serializes this ProportionsCounts instance.
   */
  private toStateObject(): ProportionsCountsStateObject {
    return {
      generation: this.generation,
      startCounts: BunnyCounts.BunnyCountsIO.toStateObject( this.startCounts ),
      endCounts: BunnyCounts.BunnyCountsIO.toStateObject( this.endCounts )
    };
  }

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
   * ProportionsCountsIO handles PhET-iO serialization of ProportionsCounts.
   * It implements 'Data type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly ProportionsCountsIO = new IOType<ProportionsCounts, ProportionsCountsStateObject>( 'ProportionsCountsIO', {
    valueType: ProportionsCounts,
    stateSchema: {
      generation: NumberIO,
      startCounts: BunnyCounts.BunnyCountsIO,
      endCounts: BunnyCounts.BunnyCountsIO
    },
    toStateObject: proportionCounts => proportionCounts.toStateObject(),
    fromStateObject: stateObject => ProportionsCounts.fromStateObject( stateObject )
  } );
}

naturalSelection.register( 'ProportionsCounts', ProportionsCounts );