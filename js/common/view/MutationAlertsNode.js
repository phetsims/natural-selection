// Copyright 2019, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const MutationComingNode = require( 'NATURAL_SELECTION/common/view/MutationComingNode' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const X_OFFSET = -5;

  class MutationAlertsNode extends Node {

    /**
     * @param {AddMutationsPanel} addMutationsPanel
     * @param {Object} [options]
     */
    constructor( addMutationsPanel, options ) {

      options = merge( {}, options );

      // Fur
      const furAlert = new MutationComingNode( {
        rightCenter: addMutationsPanel.getFurLeftCenter().addXY( X_OFFSET, 0 ),
        visible: false,
        cancelButtonListener: () => {
          addMutationsPanel.resetFur();
          furAlert.visible = false;
        }
      } );

      // Ears
      const earsAlert = new MutationComingNode( {
        rightCenter: addMutationsPanel.getEarsLeftCenter().addXY( X_OFFSET, 0 ),
        visible: false,
        cancelButtonListener: () => {
          addMutationsPanel.resetEars();
          earsAlert.visible = false;
        }
      } );

      // Teeth
      const teethAlert = new MutationComingNode( {
        rightCenter: addMutationsPanel.getTeethLeftCenter().addXY( X_OFFSET, 0 ),
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
        furAlert.visible = true;
      } );

      addMutationsPanel.earsMutationEmitter.addListener( () => {
        earsAlert.visible = true;
      } );

      addMutationsPanel.teethMutationEmitter.addListener( () => {
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
  }

  return naturalSelection.register( 'MutationAlertsNode', MutationAlertsNode );
} );