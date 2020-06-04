// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsCounts is a data structure used by the Proportions model. It describes the bunny population at
 * the start and end of a generation. This is static, immutable data.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';
import BunnyCountsIO from './BunnyCountsIO.js';

class ProportionsCounts {

  /**
   * @param {number} generation
   * @param {BunnyCounts} startCounts
   * @param {BunnyCounts} endCounts
   */
  constructor( generation, startCounts, endCounts ) {

    assert && AssertUtils.assertInteger( generation, generation => generation >= 0 );
    assert && assert( startCounts instanceof BunnyCounts, 'invalid startCounts' );
    assert && assert( endCounts instanceof BunnyCounts, 'invalid endCounts' );

    // @public (read-only)
    this.generation = generation;
    this.startCounts = startCounts;
    this.endCounts = endCounts;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by ProportionsCountsIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this ProportionsCounts instance.
   * @returns {Object}
   * @public for use by ProportionsCountsIO only
   */
  toStateObject() {
    return {
      generation: NumberIO.toStateObject( this.generation ),
      startCounts: BunnyCountsIO.toStateObject( this.startCounts ),
      endCounts: BunnyCountsIO.toStateObject( this.endCounts )
    };
  }

  /**
   * Deserializes a ProportionsCounts instance.
   * @param {Object} stateObject - return value from toStateObject
   * @returns {ProportionsCounts}
   * @public for use by ProportionsCountsIO only
   */
  static fromStateObject( stateObject ) {
    return new ProportionsCounts(
      NumberIO.fromStateObject( stateObject.generation ),
      BunnyCountsIO.fromStateObject( stateObject.startCounts ),
      BunnyCountsIO.fromStateObject( stateObject.endCounts )
    );
  }
}

naturalSelection.register( 'ProportionsCounts', ProportionsCounts );
export default ProportionsCounts;