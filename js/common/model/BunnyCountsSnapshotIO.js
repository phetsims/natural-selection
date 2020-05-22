// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCountsSnapshotIO is the IO Type for BunnyCountsSnapshot.
 * It delegates most of its implementation to BunnyCountsSnapshot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCountsSnapshot from './BunnyCountsSnapshot.js';

class BunnyCountsSnapshotIO extends ObjectIO {

  /**
   * Serializes a BunnyCountsSnapshot instance.
   * @param {BunnyCountsSnapshot} bunnyCountsSnapshot
   * @returns {Object}
   * @public
   * @override
   */
  static toStateObject( bunnyCountsSnapshot ) {
    validate( bunnyCountsSnapshot, this.validator );
    return bunnyCountsSnapshot.toStateObject();
  }

  /**
   * Deserializes a BunnyCountsSnapshot instance.
   * @param {Object} stateObject
   * @returns {BunnyCountsSnapshot}
   * @public
   * @override
   */
  static fromStateObject( stateObject ) {
    return BunnyCountsSnapshot.fromStateObject( stateObject );
  }
}

BunnyCountsSnapshotIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
BunnyCountsSnapshotIO.validator = { isValidValue: value => value instanceof BunnyCountsSnapshot };
BunnyCountsSnapshotIO.typeName = 'BunnyCountsSnapshotIO';
ObjectIO.validateSubtype( BunnyCountsSnapshotIO );

naturalSelection.register( 'BunnyCountsSnapshotIO', BunnyCountsSnapshotIO );
export default BunnyCountsSnapshotIO;