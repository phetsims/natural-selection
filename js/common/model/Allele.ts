// Copyright 2020-2025, University of Colorado Boulder

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

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
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

type SelfOptions = {
  nameProperty: TReadOnlyProperty<string>; // name of the allele
  image: HTMLImageElement; // image used to represent the allele in the UI
  tandemNamePrefix: string; // prefix used for tandem names for the allele, like 'whiteFur' for 'whiteFurCheckbox'
};

type AlleleOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export type AlleleStateObject = ReferenceIOState; // because AlleleIO is a subtype of ReferenceIO

export default class Allele extends PhetioObject {

  public readonly nameProperty: TReadOnlyProperty<string>;
  public readonly image: HTMLImageElement;
  public readonly tandemNamePrefix: string;

  /**
   * The constructor is private because only the static instances are used.
   */
  private constructor( providedOptions: AlleleOptions ) {

    const options = optionize<AlleleOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: Allele.AlleleIO,
      phetioState: false
    }, providedOptions );

    assert && assert( options.tandem.name.startsWith( options.tandemNamePrefix ),
      `tandem name ${options.tandem.name} must start with ${options.tandemNamePrefix}` );

    super( options );

    this.nameProperty = options.nameProperty;
    this.image = options.image;
    this.tandemNamePrefix = options.tandemNamePrefix;
  }

  /**
   * AlleleIO implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Reference type serialization is appropriate because all Allele instances are created at startup.
   * Any occurrence of Allele in PhET-iO state is a reference to one of these static instances, hence the private
   * constructor. Note that AlleleIO must be defined before instantiating static instances below.
   */
  public static readonly AlleleIO = new IOType<Allele, AlleleStateObject>( 'AlleleIO', {
    valueType: Allele,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );

  // Static instances

  public static readonly WHITE_FUR = new Allele( {
    nameProperty: NaturalSelectionStrings.whiteFurStringProperty,
    image: whiteFur_png,
    tandemNamePrefix: 'whiteFur',
    tandem: ALLELES_TANDEM.createTandem( 'whiteFurAllele' )
  } );

  public static readonly BROWN_FUR = new Allele( {
    nameProperty: NaturalSelectionStrings.brownFurStringProperty,
    image: brownFur_png,
    tandemNamePrefix: 'brownFur',
    tandem: ALLELES_TANDEM.createTandem( 'brownFurAllele' )
  } );

  public static readonly FLOPPY_EARS = new Allele( {
    nameProperty: NaturalSelectionStrings.floppyEarsStringProperty,
    image: floppyEars_png,
    tandemNamePrefix: 'floppyEars',
    tandem: ALLELES_TANDEM.createTandem( 'floppyEarsAllele' )
  } );

  public static readonly STRAIGHT_EARS = new Allele( {
    nameProperty: NaturalSelectionStrings.straightEarsStringProperty,
    image: straightEars_png,
    tandemNamePrefix: 'straightEars',
    tandem: ALLELES_TANDEM.createTandem( 'straightEarsAllele' )
  } );

  public static readonly SHORT_TEETH = new Allele( {
    nameProperty: NaturalSelectionStrings.shortTeethStringProperty,
    image: shortTeeth_png,
    tandemNamePrefix: 'shortTeeth',
    tandem: ALLELES_TANDEM.createTandem( 'shortTeethAllele' )
  } );

  public static readonly LONG_TEETH = new Allele( {
    nameProperty: NaturalSelectionStrings.longTeethStringProperty,
    image: longTeeth_png,
    tandemNamePrefix: 'longTeeth',
    tandem: ALLELES_TANDEM.createTandem( 'longTeethAllele' )
  } );
}

naturalSelection.register( 'Allele', Allele );