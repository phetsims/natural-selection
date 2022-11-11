// Copyright 2020-2022, University of Colorado Boulder

/**
 * PedigreeModel is the sub-model for the Pedigree graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import naturalSelection from '../../naturalSelection.js';

type SelfOptions = EmptySelfOptions;

type PedigreeModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PedigreeModel extends PhetioObject {

  // visibility of each gene in the genotype abbreviation that appears in the Pedigree tree
  public readonly furAllelesVisibleProperty: Property<boolean>;
  public readonly earsAllelesVisibleProperty: Property<boolean>;
  public readonly teethAllelesVisibleProperty: Property<boolean>;

  public constructor( providedOptions: PedigreeModelOptions ) {

    const options = optionize<PedigreeModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false, // to prevent serialization, because we don't have an IO Type
      phetioDocumentation: 'model elements that are specific to the Pedigree feature'
    }, providedOptions );

    super( options );

    this.furAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'furAllelesVisibleProperty' )
    } );

    this.earsAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'earsAllelesVisibleProperty' )
    } );

    this.teethAllelesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'teethAllelesVisibleProperty' )
    } );
  }

  public reset(): void {
    this.furAllelesVisibleProperty.reset();
    this.earsAllelesVisibleProperty.reset();
    this.teethAllelesVisibleProperty.reset();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'PedigreeModel', PedigreeModel );