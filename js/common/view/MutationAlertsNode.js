// Copyright 2019-2020, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../naturalSelection.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import MutationComingNode from './MutationComingNode.js';

// constants
const X_OFFSET = -5;

class MutationAlertsNode extends Node {

  /**
   * @param {AddMutationsPanel} addMutationsPanel
   * @param {Object} [options]
   */
  constructor( addMutationsPanel, options ) {

    assert && assert( addMutationsPanel instanceof AddMutationsPanel, 'invalid addMutationsPanel' );

    options = merge( {}, options );

    // Fur
    const furAlert = new MutationComingNode( {
      visible: false,
      cancelButtonListener: () => {
        addMutationsPanel.resetFur();
        furAlert.visible = false;
      }
    } );

    // Ears
    const earsAlert = new MutationComingNode( {
      visible: false,
      cancelButtonListener: () => {
        addMutationsPanel.resetEars();
        earsAlert.visible = false;
      }
    } );

    // Teeth
    const teethAlert = new MutationComingNode( {
      visible: false,
      cancelButtonListener: () => {
        addMutationsPanel.resetTeeth();
        teethAlert.visible = false;
      }
    } );

    assert && assert( !options.children, 'MutationAlertsNode sets children' );
    options.children = [ furAlert, earsAlert, teethAlert ];

    super( options );

    // @private
    this.furAlert = furAlert;
    this.earsAlert = earsAlert;
    this.teethAlert = teethAlert;

    addMutationsPanel.furMutationEmitter.addListener( () => {
      const globalPoint = addMutationsPanel.getFurLeftCenter().addXY( X_OFFSET, 0 );
      furAlert.rightCenter = furAlert.globalToParentPoint( globalPoint );
      furAlert.visible = true;
    } );

    addMutationsPanel.earsMutationEmitter.addListener( () => {
      const globalPoint = addMutationsPanel.getEarsLeftCenter().addXY( X_OFFSET, 0 );
      earsAlert.rightCenter = earsAlert.globalToParentPoint( globalPoint );
      earsAlert.visible = true;
    } );

    addMutationsPanel.teethMutationEmitter.addListener( () => {
      const globalPoint = addMutationsPanel.getTeethLeftCenter().addXY( X_OFFSET, 0 );
      teethAlert.rightCenter = teethAlert.globalToParentPoint( globalPoint );
      teethAlert.visible = true;
    } );
  }

  /**
   * @public
   */
  reset() {
    this.furAlert.visible = false;
    this.earsAlert.visible = false;
    this.teethAlert.visible = false;
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