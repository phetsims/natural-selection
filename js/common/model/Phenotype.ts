// Copyright 2020-2023, University of Colorado Boulder

/**
 * Phenotype describes the appearance of a bunny, the manifestation of its genotype.
 * See the 'Genotype and Phenotype' section of model.md at
 * https://github.com/phetsims/natural-selection/blob/main/doc/model.md#genotype-and-phenotype
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import naturalSelection from '../../naturalSelection.js';
import Allele, { AlleleStateObject } from './Allele.js';
import Genotype from './Genotype.js';

type SelfOptions = EmptySelfOptions;

type PhenotypeOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

type PhenotypeStateObject = {
  furAllele: AlleleStateObject;
  earsAllele: AlleleStateObject;
  teethAllele: AlleleStateObject;
};

export default class Phenotype extends PhetioObject {

  // The alleles that determine the bunny's appearance.
  // They are private because applyState must restore them, but clients should not be able to set them.
  private _furAllele: Allele;
  private _earsAllele: Allele;
  private _teethAllele: Allele;

  public constructor( genotype: Genotype, providedOptions: PhenotypeOptions ) {

    const options = optionize<PhenotypeOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioFeatured: true,
      phetioType: Phenotype.PhenotypeIO,
      phetioDocumentation: 'the appearance of the bunny, the manifestation of its genotype'
    }, providedOptions );

    super( options );

    this._furAllele = genotype.furGenePair.getVisibleAllele();
    this._earsAllele = genotype.earsGenePair.getVisibleAllele();
    this._teethAllele = genotype.teethGenePair.getVisibleAllele();
  }

  public get furAllele(): Allele { return this._furAllele; }

  public get earsAllele(): Allele { return this._earsAllele; }

  public get teethAllele(): Allele { return this._teethAllele; }

  /**
   * Does the phenotype show white fur?
   */
  public hasWhiteFur(): boolean {
    return this.furAllele === Allele.WHITE_FUR;
  }

  /**
   * Does the phenotype show brown fur?
   */
  public hasBrownFur(): boolean {
    return this.furAllele === Allele.BROWN_FUR;
  }

  /**
   * Does the phenotype show straight ears?
   */
  public hasStraightEars(): boolean {
    return this.earsAllele === Allele.STRAIGHT_EARS;
  }

  /**
   * Does the phenotype show floppy ears?
   */
  public hasFloppyEars(): boolean {
    return this.earsAllele === Allele.FLOPPY_EARS;
  }

  /**
   * Does the phenotype show short teeth?
   */
  public hasShortTeeth(): boolean {
    return this.teethAllele === Allele.SHORT_TEETH;
  }

  /**
   * Does the phenotype show long teeth?
   */
  public hasLongTeeth(): boolean {
    return this.teethAllele === Allele.LONG_TEETH;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by PhenotypeIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * PhenotypeIO implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Reference type serialization is appropriate because each Bunny instance creates a Phenotype instance,
   * so applyState will be called after this PhET-iO Element is created by Bunny.
   */
  public static readonly PhenotypeIO = new IOType<Phenotype, PhenotypeStateObject>( 'PhenotypeIO', {
    valueType: Phenotype,
    stateSchema: {
      furAllele: Allele.AlleleIO,
      earsAllele: Allele.AlleleIO,
      teethAllele: Allele.AlleleIO
    }
    // toStateObject: The default works fine here, and handles serializing this._furAllele to stateObject.furAllele, etc.
    // applyStateObject: The default works fine here, and handles deserializing stateObject.furAllele to this._furAllele, etc
  } );
}

naturalSelection.register( 'Phenotype', Phenotype );