// Copyright 2019-2020, University of Colorado Boulder

/**
 * MutationAlertsNode manages the position and visibility of 'Mutation Coming' alerts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../naturalSelection.js';
import GenePool from '../model/GenePool.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import MutationComingNode from './MutationComingNode.js';

// constants
const X_OFFSET = -5;

class MutationAlertsNode extends Node {

  /**
   * @param {GenePool} genePool
   * @param {AddMutationsPanel} addMutationsPanel
   * @param {Object} [options]
   */
  constructor( genePool, addMutationsPanel, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( addMutationsPanel instanceof AddMutationsPanel, 'invalid addMutationsPanel' );

    options = merge( {}, options );

    // Fur
    const furAlert = new MutationComingNode( {
      cancelButtonListener: () => {
        genePool.furGene.dominantAlleleProperty.value = null;
        genePool.furGene.mutationComingProperty.value = false;
      }
    } );

    // Ears
    const earsAlert = new MutationComingNode( {
      cancelButtonListener: () => {
        genePool.earsGene.dominantAlleleProperty.value = null;
        genePool.earsGene.mutationComingProperty.value = false;
      }
    } );

    // Teeth
    const teethAlert = new MutationComingNode( {
      cancelButtonListener: () => {
        genePool.teethGene.dominantAlleleProperty.value = null;
        genePool.teethGene.mutationComingProperty.value = false;
      }
    } );

    assert && assert( !options.children, 'MutationAlertsNode sets children' );
    options.children = [ furAlert, earsAlert, teethAlert ];

    super( options );

    // Position the alerts to the left of their associated rows.
    // Rows in the Add Mutations panel can be hidden via PhET-iO.
    // If that happens while an alert is visible, adjust the positions of the alerts.
    // unlink is not necessary.
    addMutationsPanel.boundsProperty.link( () => {

      // Fur
      let globalPoint = addMutationsPanel.getFurLeftCenter().addXY( X_OFFSET, 0 );
      furAlert.rightCenter = furAlert.globalToParentPoint( globalPoint );

      // Ears
      globalPoint = addMutationsPanel.getEarsLeftCenter().addXY( X_OFFSET, 0 );
      earsAlert.rightCenter = earsAlert.globalToParentPoint( globalPoint );

      // Teeth
      globalPoint = addMutationsPanel.getTeethLeftCenter().addXY( X_OFFSET, 0 );
      teethAlert.rightCenter = teethAlert.globalToParentPoint( globalPoint );
    } );

    // When a mutation is coming, make its associated alert visible. unlinks are not necessary.
    genePool.furGene.mutationComingProperty.link( mutationComing => {
      furAlert.visible = mutationComing;
    } );
    genePool.earsGene.mutationComingProperty.link( mutationComing => {
      earsAlert.visible = mutationComing;
    } );
    genePool.teethGene.mutationComingProperty.link( mutationComing => {
      teethAlert.visible = mutationComing;
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'MutationAlertsNode', MutationAlertsNode );
export default MutationAlertsNode;