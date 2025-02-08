// Copyright 2019-2025, University of Colorado Boulder

/**
 * MutationAlertsNode manages the position and visibility of 'Mutation Coming' alerts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../naturalSelection.js';
import GenePool from '../model/GenePool.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import MutationComingNode from './MutationComingNode.js';

const X_OFFSET = -5;

type SelfOptions = EmptySelfOptions;

type MutationAlertsNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class MutationAlertsNode extends Node {

  public constructor( genePool: GenePool, addMutationsPanel: AddMutationsPanel, providedOptions: MutationAlertsNodeOptions ) {

    const options = optionize<MutationAlertsNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      phetioVisiblePropertyInstrumented: false,
      isDisposable: false
    }, providedOptions );

    // Create a MutationComingNode (aka 'alert') for each gene
    const mutationComingNodes = _.map( genePool.genes, gene => new MutationComingNode( gene, {
      visibleProperty: gene.mutationComingProperty, // When a mutation is coming, make its associated alert visible.
      tandem: options.tandem.createTandem( `${gene.tandemNamePrefix}MutationComingNode` )
    } ) );
    options.children = mutationComingNodes;

    super( options );

    // Alerts point at rows in the Add Mutations panel. Since rows can be dynamically hidden via PhET-iO, dynamically
    // position each alert to the left of its associated row.
    mutationComingNodes.forEach( mutationComingNode => {
      const row = addMutationsPanel.getRow( mutationComingNode.gene );
      Multilink.multilink(
        [ row.visibleProperty, addMutationsPanel.boundsProperty ],
        ( rowVisible, addMutationsPanelBounds ) => {

          // To the left of its associated row
          const globalPoint = row.parentToGlobalPoint( new Vector2( row.left, row.centerY ) ).addXY( X_OFFSET, 0 );
          mutationComingNode.rightCenter = mutationComingNode.globalToParentPoint( globalPoint );

          // If the row was made invisible for a gene that has a mutation coming, cancel the mutation.
          if ( !rowVisible && mutationComingNode.gene.mutationComingProperty.value ) {
            mutationComingNode.gene.cancelMutation();
          }
        } );
    } );
  }
}

naturalSelection.register( 'MutationAlertsNode', MutationAlertsNode );