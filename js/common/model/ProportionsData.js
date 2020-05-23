// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsData is the data structure that describes the bunny population at the start and end of a generation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCounts from './BunnyCounts.js';
import BunnyCountsIO from './BunnyCountsIO.js';

class ProportionsData {

  /**
   * @param {number} generation
   * @param {BunnyCounts} startCounts
   * @param {BunnyCounts} endCounts
   */
  constructor( generation, startCounts, endCounts ) {

    assert && NaturalSelectionUtils.assertGeneration( generation );
    assert && assert( startCounts instanceof BunnyCounts, 'invalid startCounts' );
    assert && assert( endCounts instanceof BunnyCounts, 'invalid endCounts' );

    // @public (read-only)
    this.generation = generation;
    this.startCounts = startCounts;
    this.endCounts = endCounts;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by ProportionsDataIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this ProportionsData instance.
   * @returns {Object}
   * @public for use by ProportionsDataIO only
   */
  toStateObject() {
    return {
      generation: NumberIO.toStateObject( this.generation ),
      startCounts: BunnyCountsIO.toStateObject( this.startCounts ),
      endCounts: BunnyCountsIO.toStateObject( this.endCounts )
    };
  }

  /**
   * Deserializes a ProportionsData instance.
   * @param {Object} stateObject - return value from toStateObject
   * @returns {ProportionsData}
   * @public for use by ProportionsDataIO only
   */
  static fromStateObject( stateObject ) {
    return new ProportionsData(
      NumberIO.fromStateObject( stateObject.generation ),
      BunnyCountsIO.fromStateObject( stateObject.startCounts ),
      BunnyCountsIO.fromStateObject( stateObject.endCounts )
    );
  }
}

naturalSelection.register( 'ProportionsData', ProportionsData );
export default ProportionsData;