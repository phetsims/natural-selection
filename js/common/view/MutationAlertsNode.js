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
     * @param {AddMutationPanel} addMutationPanel
     * @param {Object} [options]
     */
    constructor( addMutationPanel, options ) {

      options = merge( {}, options );

      // Fur
      const furAlert = new MutationComingNode( {
        rightCenter: addMutationPanel.getFurLeftCenter().addXY( X_OFFSET, 0 ),
        visible: false,
        cancelButtonListener: () => {
          addMutationPanel.resetFur();
          furAlert.visible = false;
        }
      } );

      // Ears
      const earsAlert = new MutationComingNode( {
        rightCenter: addMutationPanel.getEarsLeftCenter().addXY( X_OFFSET, 0 ),
        visible: false,
        cancelButtonListener: () => {
          addMutationPanel.resetEars();
          earsAlert.visible = false;
        }
      } );

      // Teeth
      const teethAlert = new MutationComingNode( {
        rightCenter: addMutationPanel.getTeethLeftCenter().addXY( X_OFFSET, 0 ),
        visible: false,
        cancelButtonListener: () => {
          addMutationPanel.resetTeeth();
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

      addMutationPanel.furMutationEmitter.addListener( () => {
        furAlert.visible = true;
      } );

      addMutationPanel.earsMutationEmitter.addListener( () => {
        earsAlert.visible = true;
      } );

      addMutationPanel.teethMutationEmitter.addListener( () => {
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