// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCounts is a data structure that contains the counts that describe the phenotypes of a collection of bunnies.
 * There is a count for each allele, and a total count. The data structure is immutable, atomic, and describes the
 * population at a point in time. These are the Start Counts and End Counts that are shown in the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import required from '../../../../phet-core/js/required.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';

import Bunny from './Bunny.js';

class BunnyCounts {

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

    this.validateInstance();
  }

  /**
   * Adds a bunny's contribution to the counts.
   * @param {Bunny} bunny
   * @returns {BunnyCounts}
   * @public
   */
  plus( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    return this.updateCounts( bunny, 1 );
  }

  /**
   * Subtracts a bunny's contribution from the counts.
   * @param {Bunny} bunny
   * @returns {BunnyCounts}
   * @public
   */
  minus( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    return this.updateCounts( bunny, -1 );
  }

  /**
   * Adjusts the counts based on a bunny's phenotype.
   * @param {Bunny} bunny
   * @param {number} delta
   * @returns {BunnyCounts}
   * @private
   */
  updateCounts( bunny, delta ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( delta === 1 || delta === -1, 'invalid delta' );

    return new BunnyCounts( {
      totalCount: this.totalCount + delta,
      whiteFurCount: this.whiteFurCount + ( bunny.phenotype.hasWhiteFur() ? delta : 0 ),
      brownFurCount: this.brownFurCount + ( bunny.phenotype.hasBrownFur() ? delta : 0 ),
      straightEarsCount: this.straightEarsCount + ( bunny.phenotype.hasStraightEars() ? delta : 0 ),
      floppyEarsCount: this.floppyEarsCount + ( bunny.phenotype.hasFloppyEars() ? delta : 0 ),
      shortTeethCount: this.shortTeethCount + ( bunny.phenotype.hasShortTeeth() ? delta : 0 ),
      longTeethCount: this.longTeethCount + ( bunny.phenotype.hasLongTeeth() ? delta : 0 )
    } );
  }

  /**
   * Gets a string representation of this BunnyCounts. For debugging only. Do not rely on format!
   * @returns {string}
   * @public
   */
  toString() {
    return JSON.stringify( this, null, 2 );
  }

  /**
   * Gets a BunnyCounts instance with all counts initialized to zero.
   * @returns {BunnyCounts}
   * @public
   */
  static withZero() {
    return new BunnyCounts( {
      totalCount: 0,
      whiteFurCount: 0,
      brownFurCount: 0,
      straightEarsCount: 0,
      floppyEarsCount: 0,
      shortTeethCount: 0,
      longTeethCount: 0
    } );
  }

  /**
   * Performs validation of this instance.
   * @private
   */
  validateInstance() {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.totalCount ), 'invalid totalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.whiteFurCount ), 'invalid whiteFurCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.brownFurCount ), 'invalid brownFurCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.straightEarsCount ), 'invalid straightEarsCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.floppyEarsCount ), 'invalid floppyEarsCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.shortTeethCount ), 'invalid shortTeethCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( this.longTeethCount ), 'invalid longTeethCount' );

    assert && assert( this.whiteFurCount + this.brownFurCount === this.totalCount,
      'fur counts are out of sync' );
    assert && assert( this.straightEarsCount + this.floppyEarsCount === this.totalCount,
      'ears counts are out of sync' );
    assert && assert( this.shortTeethCount + this.longTeethCount === this.totalCount,
      'teeth counts are out of sync' );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by BunnyCountsIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this BunnyCounts instance.
   * @returns {Object}
   * @public
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
   * Deserializes a BunnyCounts instance.
   * @param {Object} stateObject - return value from toStateObject
   * @returns {BunnyCounts}
   * @public
   */
  static fromStateObject( stateObject ) {
    return new BunnyCounts( {
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

/**
 * BunnyCountsIO handles PhET-iO serialization of BunnyCounts. It does so by delegating to BunnyCounts.
 * The methods that BunnyCountsIO implements are typical of 'Data type serialization', as described in
 * the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 * @public
 */
BunnyCounts.BunnyCountsIO = new IOType( 'BunnyCountsIO', {
  valueType: BunnyCounts,
  toStateObject: bunnyCounts => bunnyCounts.toStateObject(),
  fromStateObject: BunnyCounts.fromStateObject
} );

naturalSelection.register( 'BunnyCounts', BunnyCounts );
export default BunnyCounts;