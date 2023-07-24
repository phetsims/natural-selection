// Copyright 2020-2023, University of Colorado Boulder

/**
 * Phenotype describes the appearance of a bunny, the manifestation of its genotype.
 * See the 'Genotype and Phenotype' section of model.md at
 * https://github.com/phetsims/natural-selection/blob/master/doc/model.md#genotype-and-phenotype
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
   * Serializes this Phenotype instance. Because Phenotype fields are private and have and require an ES5 getter,
   * they have an underscore prefix. Their names therefore do not match the fields name in stateSchema, and we cannot
   * use the default implementation of toStateObject.
   */
  private toStateObject(): PhenotypeStateObject {
    return {
      furAllele: Allele.AlleleIO.toStateObject( this._furAllele ),
      earsAllele: Allele.AlleleIO.toStateObject( this._earsAllele ),
      teethAllele: Allele.AlleleIO.toStateObject( this._teethAllele )
    };
  }

  /**
   * Restores Phenotype state after instantiation. Because Phenotype fields are private and have and require an ES5 getter,
   * they have an underscore prefix. Their names therefore do not match the fields name in stateSchema, and we cannot
   * use the default implementation of applyState.
   */
  private applyState( stateObject: PhenotypeStateObject ): void {
    this._furAllele = Allele.AlleleIO.fromStateObject( stateObject.furAllele );
    this._earsAllele = Allele.AlleleIO.fromStateObject( stateObject.earsAllele );
    this._teethAllele = Allele.AlleleIO.fromStateObject( stateObject.teethAllele );
  }

  //TODO https://github.com/phetsims/natural-selection/issues/330 should this be 'Data type serialization'?
  /**
   * PhenotypeIO implements 'Dynamic element serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Dynamic element serialization is appropriate because each Bunny instance creates a Phenotype instance,
   * and Bunny instances are dynamically created.
   */
  public static readonly PhenotypeIO = new IOType<Phenotype, PhenotypeStateObject>( 'PhenotypeIO', {
    valueType: Phenotype,
    stateSchema: {
      furAllele: Allele.AlleleIO,
      earsAllele: Allele.AlleleIO,
      teethAllele: Allele.AlleleIO
    },
    toStateObject: phenotype => phenotype.toStateObject(),
    applyState: ( phenotype, stateObject ) => phenotype.applyState( stateObject )
  } );
}

naturalSelection.register( 'Phenotype', Phenotype );