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
     * Creates a Property that controls the visibility of all UI components related to a gene.
     * @param {Gene} gene
     * @param {boolean} visible
     * @returns {BooleanProperty}
     */
    function createGeneVisibleProperty( gene, visible ) {

      const property = new BooleanProperty( visible, {
        tandem: options.tandem.createTandem( `${gene.tandemPrefix}VisibleProperty` ),
        phetioDocumentation: `sets the visibility of all user-interface components related to ${gene.name} for this screen`
      } );

      // Set the visibility of UI components related to the gene. unlink is not necessary.
      property.link( visible => {
        addMutationsPanel.setGeneVisible( gene, visible );
        populationNode.setGeneVisible( gene, visible );
        proportionsNode.setGeneVisible( gene, visible );
        pedigreeNode.setGeneVisible( gene, visible );
      } );

      //REVIEW: Used to use the returned Property?
      return property;
    }

    // These Properties are used by PhET-iO only, to configure the UI in Studio. They exist for the lifetime of the sim.
    // They won't be GC'ed because they are registered with PhET-iO, so we don't need a reference to them here.
    createGeneVisibleProperty( genePool.furGene, options.furVisible );
    createGeneVisibleProperty( genePool.earsGene, options.earsVisible );
    createGeneVisibleProperty( genePool.teethGene, options.teethVisible );
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