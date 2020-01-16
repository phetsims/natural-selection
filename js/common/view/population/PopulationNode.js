// Copyright 2019, University of Colorado Boulder

/**
 * PopulationNode is the parent for all parts of the 'Population' view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PopulationGraphNode = require( 'NATURAL_SELECTION/common/view/population/PopulationGraphNode' );
  const PopulationPanel = require( 'NATURAL_SELECTION/common/view/population/PopulationPanel' );
  const Tandem = require( 'TANDEM/Tandem' );

  class PopulationNode extends Node {

    /**
     * @param {PopulationModel} populationModel
     * @param {Dimension2} size - dimensions of the rectangle available for this Node and its children
     * @param {Object} [options]
     */
    constructor( populationModel, size, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // Divy up the width
      const panelWidth = 0.25 * size.width;
      const graphWidth = size.width - panelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const populationPanel = new PopulationPanel( populationModel, {
        fixedWidth: panelWidth,
        maxHeight: size.height,
        tandem: options.tandem.createTandem( 'populationPanel' )
      } );

      const populationGraphNode = new PopulationGraphNode( populationModel, {
        graphWidth: graphWidth,
        graphHeight: size.height,
        y: populationPanel.top,
        left: populationPanel.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        tandem: options.tandem.createTandem( 'populationGraphNode' )
      } );

      assert && assert( !options.children, 'PopulationNode sets children' );
      options.children = [ populationPanel, populationGraphNode ];

      super( options );

      // @private
      this.populationGraphNode = populationGraphNode;

      // Create a link to the model that this Node displays
      this.addLinkedElement( populationModel, {
        tandem: options.tandem.createTandem( 'populationModel' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.populationGraphNode.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'PopulationNode does not support dispose' );
    }
  }

  return naturalSelection.register( 'PopulationNode', PopulationNode );
} );