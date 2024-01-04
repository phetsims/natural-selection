// Copyright 2020-2024, University of Colorado Boulder

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
import GenePool from './GenePool.js';

type SelfOptions = EmptySelfOptions;

type PedigreeModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PedigreeModel extends PhetioObject {

  // visibility of each gene in the genotype abbreviation that appears in the Pedigree tree
  public readonly furAllelesVisibleProperty: Property<boolean>;
  public readonly earsAllelesVisibleProperty: Property<boolean>;
  public readonly teethAllelesVisibleProperty: Property<boolean>;

  public constructor( genePool: GenePool, providedOptions: PedigreeModelOptions ) {

    const options = optionize<PedigreeModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false, // to prevent serialization, because we don't have an IOType
      phetioDocumentation: 'model elements that are specific to the Pedigree feature'
    }, providedOptions );

    super( options );

    this.furAllelesVisibleProperty = new BooleanProperty( !!genePool.furGene.dominantAlleleProperty.value, {
      tandem: options.tandem.createTandem( 'furAllelesVisibleProperty' ),
      phetioFeatured: true
    } );

    this.earsAllelesVisibleProperty = new BooleanProperty( !!genePool.earsGene.dominantAlleleProperty.value, {
      tandem: options.tandem.createTandem( 'earsAllelesVisibleProperty' ),
      phetioFeatured: true
    } );

    this.teethAllelesVisibleProperty = new BooleanProperty( !!genePool.teethGene.dominantAlleleProperty.value, {
      tandem: options.tandem.createTandem( 'teethAllelesVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.furAllelesVisibleProperty.reset();
    this.earsAllelesVisibleProperty.reset();
    this.teethAllelesVisibleProperty.reset();
  }
}

naturalSelection.register( 'PedigreeModel', PedigreeModel );