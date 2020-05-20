// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCounts contains the counts that describe the phenotypes of a collection of bunnies.
 * There is a count for each allele, and a total count.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

import Bunny from './Bunny.js';

class BunnyCounts {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.totalCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'totalCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies'
    } );

    // @public
    this.whiteFurCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'whiteFurCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the number of bunnies that have white fur'
    } );

    // @public
    this.brownFurCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'brownFurCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the number of bunnies that have brown fur'
    } );

    // @public
    this.straightEarsCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'straightEarsCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the number of bunnies that have straight ears'
    } );

    // @public
    this.floppyEarsCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'floppyEarsCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the number of bunnies that have floppy ears'
    } );

    // @public
    this.shortTeethCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'shortTeethCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the number of bunnies that have short teeth'
    } );

    // @public
    this.longTeethCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'longTeethCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the number of bunnies that have long teeth'
    } );
  }

  /**
   * Adds a bunny's contribution to the counts.
   * @param {Bunny} bunny
   * @public
   */
  add( bunny ) {
    this.updateCounts( bunny, 1 );
  }

  /**
   * Subtracts a bunny's contribution from the counts.
   * @param {Bunny} bunny
   * @public
   */
  subtract( bunny ) {
    this.updateCounts( bunny, -1 );
  }

  /**
   * Adjusts the counts based on a bunny's phenotype.
   * @param {Bunny} bunny
   * @param {number} delta
   * @private
   */
  updateCounts( bunny, delta ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( delta === 1 || delta === -1, 'invalid delta' );

    // total count
    this.totalCountProperty.value += delta;

    // fur counts
    if ( bunny.phenotype.hasWhiteFur() ) {
      this.whiteFurCountProperty.value += delta;
    }
    else {
      this.brownFurCountProperty.value += delta;
    }

    // ears counts
    if ( bunny.phenotype.hasStraightEars() ) {
      this.straightEarsCountProperty.value += delta;
    }
    else {
      this.floppyEarsCountProperty.value += delta;
    }

    // teeth counts
    if ( bunny.phenotype.hasShortTeeth() ) {
      this.shortTeethCountProperty.value += delta;
    }
    else {
      this.longTeethCountProperty.value += delta;
    }
  }

  /**
   * Creates a snapshot of the counts.
   * @returns {BunnyCountsSnapshot}
   * @public
   *
   * @typedef BunnyCountsSnapshot
   * @properties {number} totalCount
   * @properties {number} whiteFurCount
   * @properties {number} brownFurCount
   * @properties {number} straightEarsCount
   * @properties {number} floppyEarsCount
   * @properties {number} shortTeethCount
   * @properties {number} longTeethCount
   */
  getSnapshot() {
    return {
      totalCount: this.totalCountProperty.value,
      whiteFurCount: this.whiteFurCountProperty.value,
      brownFurCount: this.brownFurCountProperty.value,
      straightEarsCount: this.straightEarsCountProperty.value,
      floppyEarsCount: this.floppyEarsCountProperty.value,
      shortTeethCount: this.shortTeethCountProperty.value,
      longTeethCount: this.longTeethCountProperty.value
    };
  }
}

naturalSelection.register( 'BunnyCounts', BunnyCounts );
export default BunnyCounts;