// Copyright 2019-2022, University of Colorado Boulder

/**
 * MutationAlertsNode manages the position and visibility of 'Mutation Coming' alerts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import GenePool from '../model/GenePool.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import MutationComingNode from './MutationComingNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
const X_OFFSET = -5;

type SelfOptions = EmptySelfOptions;

type MutationAlertsNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class MutationAlertsNode extends Node {

  public constructor( genePool: GenePool, addMutationsPanel: AddMutationsPanel, providedOptions: MutationAlertsNodeOptions ) {

    const options = optionize<MutationAlertsNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // Create a MutationComingNode (aka 'alert') for each gene
    const mutationComingNodes = _.map( genePool.genes, gene => new MutationComingNode( gene, {
      tandem: options.tandem.createTandem( `${gene.tandemPrefix}MutationComingNode` )
    } ) );
    assert && assert( !options.children, 'MutationAlertsNode sets children' );
    options.children = mutationComingNodes;

    super( options );

    // When a mutation is coming, make its associated alert visible. unlinks are not necessary.
    mutationComingNodes.forEach( mutationComingNode => {
      mutationComingNode.gene.mutationComingProperty.link( mutationComing => {
        mutationComingNode.visible = mutationComing;
      } );
    } );

    // Alerts point at rows in the Add Mutations panel. Since rows can be dynamically hidden via PhET-iO, manage
    // the logistics of that here. unlink is not necessary.
    addMutationsPanel.boundsProperty.link( () => {
      mutationComingNodes.forEach( mutationComingNode => {

        // Position the alert to the left of its associated rows.
        const row = addMutationsPanel.getRow( mutationComingNode.gene );
        const globalPoint = row.parentToGlobalPoint( new Vector2( row.left, row.centerY ) ).addXY( X_OFFSET, 0 );
        mutationComingNode.rightCenter = mutationComingNode.globalToParentPoint( globalPoint );

        // If the row was made invisible for a gene that has a mutation was coming, cancel the mutation.
        if ( !row.visible && mutationComingNode.gene.mutationComingProperty.value ) {
          mutationComingNode.gene.cancelMutation();
        }
      } );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'MutationAlertsNode', MutationAlertsNode );