// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCounts contains the various counts that describe the collection of living bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import naturalSelection from '../../naturalSelection.js';

import Bunny from './Bunny.js';

class BunnyCounts {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @public (read-only)
    this.totalCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'totalCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies'
    } );

    // @public (read-only)
    this.brownFurCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'brownFurCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies that have brown fur'
    } );

    // @public (read-only)
    this.whiteFurCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'whiteFurCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies that have white fur'
    } );

    // @public (read-only)
    this.straightEarsCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'straightEarsCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies that have straight ears'
    } );

    // @public (read-only)
    this.floppyEarsCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'floppyEarsCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies that have floppy ears'
    } );

    // @public (read-only)
    this.shortTeethCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'shortTeethCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies that have short teeth'
    } );

    // @public (read-only)
    this.longTeethCountProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'longTeethCountProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies that have long teeth'
    } );
  }

  /**
   * Adjusts the counts for a specified bunny.
   * @param {Bunny} bunny
   * @public
   */
  updateCounts( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    // total count
    this.totalCountProperty.value++;

    // fur counts
    if ( bunny.phenotype.hasWhiteFur() ) {
      this.whiteFurCountProperty.value++;
    }
    else {
      this.brownFurCountProperty.value++;
    }

    // ears counts
    if ( bunny.phenotype.hasStraightEars() ) {
      this.straightEarsCountProperty.value++;
    }
    else {
      this.floppyEarsCountProperty.value++;
    }

    // teeth counts
    if ( bunny.phenotype.hasShortTeeth() ) {
      this.shortTeethCountProperty.value++;
    }
    else {
      this.longTeethCountProperty.value++;
    }
  }
}

naturalSelection.register( 'BunnyCounts', BunnyCounts );
export default BunnyCounts;