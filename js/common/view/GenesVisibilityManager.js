// Copyright 2020, University of Colorado Boulder

/**
 * GenesVisibilityManager manages the visibility of UI components that are related to specific genes.
 * This is a PhET-iO only feature, available in Studio. Via a set of Properties, all UI components related to
 * a gene can be shown/hidden, allowing the PhET-iO client to quickly configure the sim.
 * See https://github.com/phetsims/natural-selection/issues/70
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Gene from '../model/Gene.js';
import GenePool from '../model/GenePool.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import PedigreeNode from './pedigree/PedigreeNode.js';
import PopulationNode from './population/PopulationNode.js';
import ProportionsNode from './proportions/ProportionsNode.js';

class GenesVisibilityManager {

  /**
   * @param {GenePool} genePool
   * @param {AddMutationsPanel} addMutationsPanel
   * @param {PopulationNode} populationNode
   * @param {ProportionsNode} proportionsNode
   * @param {PedigreeNode} pedigreeNode
   * @param {Object} [options]
   */
  constructor( genePool, addMutationsPanel, populationNode, proportionsNode, pedigreeNode, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( addMutationsPanel instanceof AddMutationsPanel, 'invalid addMutationsPanel' );
    assert && assert( populationNode instanceof PopulationNode, 'invalid populationNode' );
    assert && assert( proportionsNode instanceof ProportionsNode, 'invalid proportionsNode' );
    assert && assert( pedigreeNode instanceof PedigreeNode, 'invalid pedigreeNode' );

    options = merge( {

      // whether the user-interface for these features is visible
      furVisible: true,
      earsVisible: true,
      teethVisible: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    /**
     * Sets the visibility of all UI components related to a specific gene.
     * @param {Gene} gene
     * @param {boolean} visible
     */
    function setGeneVisible( gene, visible ) {
      assert && assert( gene instanceof Gene, 'invalid gene' );
      assert && assert( typeof visible === 'boolean', 'invalid visible' );

      addMutationsPanel.setGeneVisible( gene, visible );
      populationNode.setGeneVisible( gene, visible );
      proportionsNode.setGeneVisible( gene, visible );
      pedigreeNode.setGeneVisible( gene, visible );
    }

    // Determines whether Fur is visible in the UI.
    const furVisibleProperty = new BooleanProperty( options.furVisible, {
      tandem: options.tandem.createTandem( 'furVisibleProperty' ),
      phetioDocumentation: 'sets the visibility of all user-interface components related to Fur for this screen'
    } );

    // Set visibility of all UI components related to Fur. unlink is not necessary.
    furVisibleProperty.link( visible => setGeneVisible( genePool.furGene, visible ) );

    // Determines whether Ears is visible in the UI.
    const earsVisibleProperty = new BooleanProperty( options.earsVisible, {
      tandem: options.tandem.createTandem( 'earsVisibleProperty' ),
      phetioDocumentation: 'sets the visibility of all user-interface components related to Ears for this screen'
    } );

    // Set visibility of all UI components related to Ears. unlink is not necessary.
    earsVisibleProperty.link( visible => setGeneVisible( genePool.earsGene, visible ) );

    // Determines whether Teeth is visible in the UI.
    const teethVisibleProperty = new BooleanProperty( options.teethVisible, {
      tandem: options.tandem.createTandem( 'teethVisibleProperty' ),
      phetioDocumentation: 'sets the visibility of all user-interface components related to Teeth for this screen'
    } );

    // Set visibility of all UI components related to Teeth. unlink is not necessary.
    teethVisibleProperty.link( visible => setGeneVisible( genePool.teethGene, visible ) );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

naturalSelection.register( 'GenesVisibilityManager', GenesVisibilityManager );
export default GenesVisibilityManager;