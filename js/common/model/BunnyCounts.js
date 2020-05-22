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
import BunnyCountsSnapshot from './BunnyCountsSnapshot.js';

class BunnyCounts {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Shared options
    const numberPropertyOptions = {
      numberType: 'Integer',
      phetioReadOnly: true,
      phetioState: false // because counts will be restored as BunnyGroup is restored
    };

    // @public
    this.totalCountProperty = new NumberProperty( 0, merge( {}, numberPropertyOptions, {
      tandem: options.tandem.createTandem( 'totalCountProperty' ),
      phetioDocumentation: 'the total number of bunnies'
    }  ) );

    // @public
    this.whiteFurCountProperty = new NumberProperty( 0, merge( {}, numberPropertyOptions, {
      tandem: options.tandem.createTandem( 'whiteFurCountProperty' ),
      phetioDocumentation: 'the number of bunnies that have white fur'
    } ) );

    // @public
    this.brownFurCountProperty = new NumberProperty( 0, merge( {}, numberPropertyOptions, {
      tandem: options.tandem.createTandem( 'brownFurCountProperty' ),
      phetioDocumentation: 'the number of bunnies that have brown fur'
    } ) );

    // @public
    this.straightEarsCountProperty = new NumberProperty( 0, merge( {}, numberPropertyOptions, {
      tandem: options.tandem.createTandem( 'straightEarsCountProperty' ),
      phetioDocumentation: 'the number of bunnies that have straight ears'
    } ) );

    // @public
    this.floppyEarsCountProperty = new NumberProperty( 0, merge( {}, numberPropertyOptions, {
      tandem: options.tandem.createTandem( 'floppyEarsCountProperty' ),
      phetioDocumentation: 'the number of bunnies that have floppy ears'
    } ) );

    // @public
    this.shortTeethCountProperty = new NumberProperty( 0, merge( {}, numberPropertyOptions, {
      tandem: options.tandem.createTandem( 'shortTeethCountProperty' ),
      phetioDocumentation: 'the number of bunnies that have short teeth'
    } ) );

    // @public
    this.longTeethCountProperty = new NumberProperty( 0, merge( {}, numberPropertyOptions, {
      tandem: options.tandem.createTandem( 'longTeethCountProperty' ),
      phetioDocumentation: 'the number of bunnies that have long teeth'
    } ) );
  }

  /**
   * @public
   */
  reset() {
    this.totalCountProperty.reset();
    this.whiteFurCountProperty.reset();
    this.brownFurCountProperty.reset();
    this.straightEarsCountProperty.reset();
    this.floppyEarsCountProperty.reset();
    this.shortTeethCountProperty.reset();
    this.longTeethCountProperty.reset();
    assert && this.validateCounts();
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

    assert && this.validateCounts();
  }

  /**
   * Validates the counts. The sum of the counts for a gene's alleles should equal the total count.
   * @private
   */
  validateCounts() {
    const totalCount = this.totalCountProperty.value;
    assert && assert( this.whiteFurCountProperty.value + this.brownFurCountProperty.value === totalCount,
      'fur counts are out of sync' );
    assert && assert( this.straightEarsCountProperty.value + this.floppyEarsCountProperty.value === totalCount,
      'ears counts are out of sync' );
    assert && assert( this.shortTeethCountProperty.value + this.longTeethCountProperty.value === totalCount,
      'teeth counts are out of sync' );
  }

  /**
   * Creates a snapshot of the counts.
   * @returns {BunnyCountsSnapshot}
   * @public
   */
  createSnapshot() {
    return new BunnyCountsSnapshot( {
      totalCount: this.totalCountProperty.value,
      whiteFurCount: this.whiteFurCountProperty.value,
      brownFurCount: this.brownFurCountProperty.value,
      straightEarsCount: this.straightEarsCountProperty.value,
      floppyEarsCount: this.floppyEarsCountProperty.value,
      shortTeethCount: this.shortTeethCountProperty.value,
      longTeethCount: this.longTeethCountProperty.value
    } );
  }

  /**
   * Sets all count values to match a specified snapshot.
   * @param {BunnyCountsSnapshot} snapshot
   * @public
   */
  setValues( snapshot ) {
    this.totalCountProperty.value = snapshot.totalCount;
    this.whiteFurCountProperty.value = snapshot.whiteFurCount;
    this.brownFurCountProperty.value = snapshot.brownFurCount;
    this.straightEarsCountProperty.value = snapshot.straightEarsCount;
    this.floppyEarsCountProperty.value = snapshot.floppyEarsCount;
    this.shortTeethCountProperty.value = snapshot.shortTeethCount;
    this.longTeethCountProperty.value = snapshot.longTeethCount;
  }
}

naturalSelection.register( 'BunnyCounts', BunnyCounts );
export default BunnyCounts;