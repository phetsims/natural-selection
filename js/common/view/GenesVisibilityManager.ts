// Copyright 2020-2022, University of Colorado Boulder

/**
 * GenesVisibilityManager manages the visibility of UI components that are related to specific genes.
 * This is a PhET-iO only feature, available in Studio. Via a set of Properties, all UI components related to
 * a gene can be shown/hidden, allowing the PhET-iO client to quickly configure the sim.
 * See https://github.com/phetsims/natural-selection/issues/70
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty, { BooleanPropertyOptions } from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import naturalSelection from '../../naturalSelection.js';
import Gene from '../model/Gene.js';
import GenePool from '../model/GenePool.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import PedigreeNode from './pedigree/PedigreeNode.js';
import PopulationNode from './population/PopulationNode.js';
import ProportionsNode from './proportions/ProportionsNode.js';

type SelfOptions = {

  // whether the user-interface for these features is visible
  furVisible?: boolean;
  earsVisible?: boolean;
  teethVisible?: boolean;
};

type GenesVisibilityManagerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GenesVisibilityManager {

  // Properties used to configure the UI. For use in Studio only, and exist for the lifetime of the sim.
  private readonly furVisibleProperty: Property<boolean>;
  private readonly earsVisibleProperty: Property<boolean>;
  private readonly teethVisibleProperty: Property<boolean>;

  public constructor( genePool: GenePool, addMutationsPanel: AddMutationsPanel, populationNode: PopulationNode,
                      proportionsNode: ProportionsNode, pedigreeNode: PedigreeNode,
                      providedOptions: GenesVisibilityManagerOptions ) {

    const options = optionize<GenesVisibilityManagerOptions, SelfOptions>()( {

      // SelfOptions
      furVisible: true,
      earsVisible: true,
      teethVisible: true
    }, providedOptions );

    /**
     * Creates a Property that controls the visibility of all UI components related to a gene.
     */
    function createGeneVisibleProperty(
      gene: Gene, visible: boolean,
      options: PickRequired<BooleanPropertyOptions, 'tandem' | 'phetioDocumentation'> ): Property<boolean> {

      const property = new BooleanProperty( visible, options );

      // Set the visibility of UI components related to the gene. unlink is not necessary.
      property.link( visible => {
        addMutationsPanel.setGeneVisible( gene, visible );
        populationNode.setGeneVisible( gene, visible );
        proportionsNode.setGeneVisible( gene, visible );
        pedigreeNode.setGeneVisible( gene, visible );
      } );

      return property;
    }

    const template = 'sets the visibility of all user-interface components related to {{name}} for this screen';

    this.furVisibleProperty = createGeneVisibleProperty( genePool.furGene, options.furVisible, {
      tandem: options.tandem.createTandem( 'furVisibleProperty' ),
      phetioDocumentation: StringUtils.fillIn( template, { name: 'Fur' } )
    } );

    this.earsVisibleProperty = createGeneVisibleProperty( genePool.earsGene, options.earsVisible, {
      tandem: options.tandem.createTandem( 'earsVisibleProperty' ),
      phetioDocumentation: StringUtils.fillIn( template, { name: 'Ears' } )
    } );

    this.teethVisibleProperty = createGeneVisibleProperty( genePool.teethGene, options.teethVisible, {
      tandem: options.tandem.createTandem( 'teethVisibleProperty' ),
      phetioDocumentation: StringUtils.fillIn( template, { name: 'Teeth' } )
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

naturalSelection.register( 'GenesVisibilityManager', GenesVisibilityManager );