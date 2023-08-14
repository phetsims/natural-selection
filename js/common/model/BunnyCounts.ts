// Copyright 2020-2023, University of Colorado Boulder

/**
 * BunnyCounts is a data structure that contains the counts that describe the phenotypes of a collection of bunnies.
 * There is a count for each allele, and a total count. The data structure is immutable, atomic, and describes the
 * population at a point in time. These are the Start Counts and End Counts that are shown in the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';

type SelfOptions = {
  totalCount: number;
  whiteFurCount: number;
  brownFurCount: number;
  straightEarsCount: number;
  floppyEarsCount: number;
  shortTeethCount: number;
  longTeethCount: number;
};

type BunnyCountOptions = SelfOptions;

// State object happens to be identical to SelfOptions
export type BunnyCountsStateObject = SelfOptions;

export default class BunnyCounts {

  public readonly totalCount: number;
  public readonly whiteFurCount: number;
  public readonly brownFurCount: number;
  public readonly straightEarsCount: number;
  public readonly floppyEarsCount: number;
  public readonly shortTeethCount: number;
  public readonly longTeethCount: number;

  public constructor( providedOptions: BunnyCountOptions ) {

    this.totalCount = providedOptions.totalCount;
    this.whiteFurCount = providedOptions.whiteFurCount;
    this.brownFurCount = providedOptions.brownFurCount;
    this.straightEarsCount = providedOptions.straightEarsCount;
    this.floppyEarsCount = providedOptions.floppyEarsCount;
    this.shortTeethCount = providedOptions.shortTeethCount;
    this.longTeethCount = providedOptions.longTeethCount;

    assert && assert( this.whiteFurCount + this.brownFurCount === this.totalCount,
      'fur counts are out of sync' );
    assert && assert( this.straightEarsCount + this.floppyEarsCount === this.totalCount,
      'ears counts are out of sync' );
    assert && assert( this.shortTeethCount + this.longTeethCount === this.totalCount,
      'teeth counts are out of sync' );
  }

  /**
   * Adds a bunny's contribution to the counts.
   */
  public plus( bunny: Bunny ): BunnyCounts {
    return this.updateCounts( bunny, 1 );
  }

  /**
   * Subtracts a bunny's contribution from the counts.
   */
  public minus( bunny: Bunny ): BunnyCounts {
    return this.updateCounts( bunny, -1 );
  }

  /**
   * Adjusts the counts based on a bunny's phenotype.
   */
  private updateCounts( bunny: Bunny, delta: number ): BunnyCounts {
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
   */
  public toString(): string {
    return JSON.stringify( this, null, 2 );
  }

  /**
   * Gets a BunnyCounts instance with all counts initialized to zero.
   */
  public static withZero(): BunnyCounts {
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

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by BunnyCountsIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Deserializes a BunnyCounts instance.
   */
  private static fromStateObject( stateObject: SelfOptions ): BunnyCounts {
    return new BunnyCounts( {
      totalCount: stateObject.totalCount,
      whiteFurCount: stateObject.whiteFurCount,
      brownFurCount: stateObject.brownFurCount,
      straightEarsCount: stateObject.straightEarsCount,
      floppyEarsCount: stateObject.floppyEarsCount,
      shortTeethCount: stateObject.shortTeethCount,
      longTeethCount: stateObject.longTeethCount
    } );
  }

  /**
   * BunnyCountsIO implements 'Data type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Data type serialization is appropriate because BunnyCount itself is not a PhetioObject. Its role is as
   * a data type - similar to number, string, or Vector2. Various fields and Properties have a value of type BunnyCount.
   * Search for BunnyCountsIO to identify them.
   */
  public static readonly BunnyCountsIO = new IOType<BunnyCounts, BunnyCountsStateObject>( 'BunnyCountsIO', {
    valueType: BunnyCounts,
    stateSchema: {
      totalCount: NumberIO,
      whiteFurCount: NumberIO,
      brownFurCount: NumberIO,
      straightEarsCount: NumberIO,
      floppyEarsCount: NumberIO,
      shortTeethCount: NumberIO,
      longTeethCount: NumberIO
    },
    // toStateObject: The default works fine here.
    fromStateObject: stateObject => BunnyCounts.fromStateObject( stateObject )
  } );
}

naturalSelection.register( 'BunnyCounts', BunnyCounts );