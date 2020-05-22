// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsData is the data structure that describes the bunny population at the start and end of a generation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCountsSnapshot from './BunnyCountsSnapshot.js';
import BunnyCountsSnapshotIO from './BunnyCountsSnapshotIO.js';

class ProportionsData {

  /**
   * @param {number} generation
   * @param {BunnyCountsSnapshot} startSnapshot
   * @param {BunnyCountsSnapshot} endSnapshot
   */
  constructor( generation, startSnapshot, endSnapshot ) {

    assert && assert( typeof generation === 'number' && Utils.isInteger( generation ) && generation >= 0, 'invalid generation' );
    assert && assert( startSnapshot instanceof BunnyCountsSnapshot, 'invalid startSnapshot' );
    assert && assert( endSnapshot instanceof BunnyCountsSnapshot, 'invalid endSnapshot' );

    // @public (read-only)
    this.generation = generation;
    this.startSnapshot = startSnapshot;
    this.endSnapshot = endSnapshot;
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
      startSnapshot: BunnyCountsSnapshotIO.toStateObject( this.startSnapshot ),
      endSnapshot: BunnyCountsSnapshotIO.toStateObject( this.endSnapshot )
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
      BunnyCountsSnapshotIO.fromStateObject( stateObject.startSnapshot ),
      BunnyCountsSnapshotIO.fromStateObject( stateObject.endSnapshot )
    );
  }
}

naturalSelection.register( 'ProportionsData', ProportionsData );
export default ProportionsData;