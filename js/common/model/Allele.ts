// Copyright 2020-2022, University of Colorado Boulder

/**
 * Allele is a variant form of a gene.  In this sim, the language used to name an allele (a gene variant) and
 * a phenotype (expression of that gene) are synonymous. For example, 'White Fur' is used to describe both the
 * allele and the phenotype. Note that gene and allele are often used interchangeably in the literature,
 * but we attempt to use them consistently in this implementation.
 *
 * There is one instance of each Allele, and they are global to the simulation. They are defined herein as
 * static instances, and appear in Studio as children of the element 'naturalSelection.global.model.alleles'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import brownFur_png from '../../../images/brownFur_png.js';
import floppyEars_png from '../../../images/floppyEars_png.js';
import longTeeth_png from '../../../images/longTeeth_png.js';
import shortTeeth_png from '../../../images/shortTeeth_png.js';
import straightEars_png from '../../../images/straightEars_png.js';
import whiteFur_png from '../../../images/whiteFur_png.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';

// tandem for all static instances of Allele
const ALLELES_TANDEM = Tandem.GLOBAL_MODEL.createTandem( 'alleles' );

type SelfOptions = EmptySelfOptions;

type AlleleOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export type AlleleStateObject = ReferenceIOState; // because AlleleIO is a subtype of ReferenceIO

export default class Allele extends PhetioObject {

  public readonly nameProperty: TReadOnlyProperty<string>;
  public readonly image: HTMLImageElement;
  public readonly tandemPrefix: string;

  /**
   * The constructor is private because only the static instances are used.
   *
   * @param nameProperty - name of the allele
   * @param image - image used to represent the allele in the UI
   * @param tandemPrefix - prefix used for tandem names for the allele, like 'whiteFur' for 'whiteFurCheckbox'
   * @param [providedOptions]
   */
  private constructor( nameProperty: TReadOnlyProperty<string>, image: HTMLImageElement,
                      tandemPrefix: string, providedOptions: AlleleOptions ) {

    const options = optionize<AlleleOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioType: Allele.AlleleIO,
      phetioState: false
    }, providedOptions );

    assert && assert( options.tandem.name.startsWith( tandemPrefix ),
      `tandem name ${options.tandem.name} must start with ${tandemPrefix}` );

    super( options );

    this.nameProperty = nameProperty;
    this.image = image;
    this.tandemPrefix = tandemPrefix;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * AlleleIO handles PhET-iO serialization of Allele.
   * It implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   * This must be defined before instantiating static instances.
   */
  public static readonly AlleleIO = new IOType<Allele, AlleleStateObject>( 'AlleleIO', {
    valueType: Allele,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );

  // Static instances

  public static readonly WHITE_FUR = new Allele( NaturalSelectionStrings.whiteFurStringProperty, whiteFur_png, 'whiteFur', {
    tandem: ALLELES_TANDEM.createTandem( 'whiteFurAllele' )
  } );

  public static readonly BROWN_FUR = new Allele( NaturalSelectionStrings.brownFurStringProperty, brownFur_png, 'brownFur', {
    tandem: ALLELES_TANDEM.createTandem( 'brownFurAllele' )
  } );

  public static readonly FLOPPY_EARS = new Allele( NaturalSelectionStrings.floppyEarsStringProperty, floppyEars_png, 'floppyEars', {
    tandem: ALLELES_TANDEM.createTandem( 'floppyEarsAllele' )
  } );

  public static readonly STRAIGHT_EARS = new Allele( NaturalSelectionStrings.straightEarsStringProperty, straightEars_png, 'straightEars', {
    tandem: ALLELES_TANDEM.createTandem( 'straightEarsAllele' )
  } );

  public static readonly SHORT_TEETH = new Allele( NaturalSelectionStrings.shortTeethStringProperty, shortTeeth_png, 'shortTeeth', {
    tandem: ALLELES_TANDEM.createTandem( 'shortTeethAllele' )
  } );

  public static readonly LONG_TEETH = new Allele( NaturalSelectionStrings.longTeethStringProperty, longTeeth_png, 'longTeeth', {
    tandem: ALLELES_TANDEM.createTandem( 'longTeethAllele' )
  } );
}

naturalSelection.register( 'Allele', Allele );