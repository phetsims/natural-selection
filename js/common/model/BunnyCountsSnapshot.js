// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCountsSnapshot is a snapshot of the NumberProperty values from BunnyCounts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import required from '../../../../phet-core/js/required.js';
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
}

naturalSelection.register( 'BunnyCountsSnapshot', BunnyCountsSnapshot );
export default BunnyCountsSnapshot;