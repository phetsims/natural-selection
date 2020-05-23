// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCountsIO is the IO Type for BunnyCounts.
 * It delegates most of its implementation to BunnyCounts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';

class BunnyCountsIO extends ObjectIO {

  /**
   * Serializes a BunnyCounts instance.
   * @param {BunnyCounts} bunnyCounts
   * @returns {Object}
   * @public
   * @override
   */
  static toStateObject( bunnyCounts ) {
    validate( bunnyCounts, this.validator );
    return bunnyCounts.toStateObject();
  }

  /**
   * Deserializes a BunnyCounts instance.
   * @param {Object} stateObject
   * @returns {BunnyCounts}
   * @public
   * @override
   */
  static fromStateObject( stateObject ) {
    return BunnyCounts.fromStateObject( stateObject );
  }
}

BunnyCountsIO.documentation = 'TODO https://github.com/phetsims/phet-io/issues/1643';
BunnyCountsIO.validator = { isValidValue: value => value instanceof BunnyCounts };
BunnyCountsIO.typeName = 'BunnyCountsIO';
ObjectIO.validateSubtype( BunnyCountsIO );

naturalSelection.register( 'BunnyCountsIO', BunnyCountsIO );
export default BunnyCountsIO;