// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsData is the data structure that describes the bunny population at the start and end of a generation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';

class ProportionsData {

  /**
   * @param {number} generation
   * @param {BunnyCountsSnapshot} startSnapshot
   * @param {BunnyCountsSnapshot} endSnapshot
   */
  constructor( generation, startSnapshot, endSnapshot ) {

    // @public (read-only)
    this.generation = generation;
    this.startSnapshot = startSnapshot;
    this.endSnapshot = endSnapshot;
  }
}

naturalSelection.register( 'ProportionsData', ProportionsData );
export default ProportionsData;