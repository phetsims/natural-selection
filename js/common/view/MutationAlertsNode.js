// Copyright 2019-2020, University of Colorado Boulder

/**
 * TODO
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
      visible: false,
      cancelButtonListener: () => {
        genePool.furGene.dominantAlleleProperty.value = null;
        genePool.furGene.mutationComingProperty.value = false;
      }
    } );

    // Ears
    const earsAlert = new MutationComingNode( {
      visible: false,
      cancelButtonListener: () => {
        genePool.earsGene.dominantAlleleProperty.value = null;
        genePool.earsGene.mutationComingProperty.value = false;
      }
    } );

    // Teeth
    const teethAlert = new MutationComingNode( {
      visible: false,
      cancelButtonListener: () => {
        genePool.teethGene.dominantAlleleProperty.value = null;
        genePool.teethGene.mutationComingProperty.value = false;
      }
    } );

    assert && assert( !options.children, 'MutationAlertsNode sets children' );
    options.children = [ furAlert, earsAlert, teethAlert ];

    super( options );

    genePool.furGene.mutationComingProperty.link( mutationComing => {
      if ( mutationComing ) {
        const globalPoint = addMutationsPanel.getFurLeftCenter().addXY( X_OFFSET, 0 );
        furAlert.rightCenter = furAlert.globalToParentPoint( globalPoint );
        furAlert.visible = true;
      }
      furAlert.visible = mutationComing;
    } );

    genePool.earsGene.mutationComingProperty.link( mutationComing => {
      if ( mutationComing ) {
        const globalPoint = addMutationsPanel.getEarsLeftCenter().addXY( X_OFFSET, 0 );
        earsAlert.rightCenter = earsAlert.globalToParentPoint( globalPoint );

      }
      earsAlert.visible = mutationComing;
    } );

    genePool.teethGene.mutationComingProperty.link( mutationComing => {
      if ( mutationComing ) {
        const globalPoint = addMutationsPanel.getTeethLeftCenter().addXY( X_OFFSET, 0 );
        teethAlert.rightCenter = teethAlert.globalToParentPoint( globalPoint );
      }
      teethAlert.visible = mutationComing;
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'MutationAlertsNode does not support dispose' );
  }
}

naturalSelection.register( 'MutationAlertsNode', MutationAlertsNode );
export default MutationAlertsNode;