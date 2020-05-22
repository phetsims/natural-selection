// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCountsSnapshot is a snapshot of the NumberProperty values from BunnyCounts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import required from '../../../../phet-core/js/required.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';

class BunnyCountsSnapshot {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    // @public (read-only) {number}
    this.totalCount = required( config.totalCount );
    this.whiteFurCount = required( config.whiteFurCount );
    this.brownFurCount = required( config.brownFurCount );
    this.straightEarsCount = required( config.straightEarsCount );
    this.floppyEarsCount = required( config.floppyEarsCount );
    this.shortTeethCount = required( config.shortTeethCount );
    this.longTeethCount = required( config.longTeethCount );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by BunnyCountsSnapshotIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes a BunnyCountsSnapshot.
   * @returns {Object}
   * @public for use by BunnyCountsSnapshotIO only
   */
  toStateObject() {
    return {
      totalCount: NumberIO.toStateObject( this.totalCount ),
      whiteFurCount: NumberIO.toStateObject( this.whiteFurCount ),
      brownFurCount: NumberIO.toStateObject( this.brownFurCount ),
      straightEarsCount: NumberIO.toStateObject( this.straightEarsCount ),
      floppyEarsCount: NumberIO.toStateObject( this.floppyEarsCount ),
      shortTeethCount: NumberIO.toStateObject( this.shortTeethCount ),
      longTeethCount: NumberIO.toStateObject( this.longTeethCount )
    };
  }

  /**
   * Deserializes a BunnyCountsSnapshot.
   * @param {Object} stateObject - return value from toStateObject
   * @returns {BunnyCountsSnapshot}
   * @public for use by BunnyCountsSnapshotIO only
   */
  static fromStateObject( stateObject ) {
    return new BunnyCountsSnapshot( {
      totalCount: NumberIO.fromStateObject( stateObject.totalCount ),
      whiteFurCount: NumberIO.fromStateObject( stateObject.whiteFurCount ),
      brownFurCount: NumberIO.fromStateObject( stateObject.brownFurCount ),
      straightEarsCount: NumberIO.fromStateObject( stateObject.straightEarsCount ),
      floppyEarsCount: NumberIO.fromStateObject( stateObject.floppyEarsCount ),
      shortTeethCount: NumberIO.fromStateObject( stateObject.shortTeethCount ),
      longTeethCount: NumberIO.fromStateObject( stateObject.longTeethCount )
    } );
  }
}

naturalSelection.register( 'BunnyCountsSnapshot', BunnyCountsSnapshot );
export default BunnyCountsSnapshot;