// Copyright 2019, University of Colorado Boulder

/**
 * PopulationNode is the parent for all parts of the 'Population' view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const PopulationGraphNode = require( 'NATURAL_SELECTION/common/view/population/PopulationGraphNode' );
  const PopulationPanel = require( 'NATURAL_SELECTION/common/view/population/PopulationPanel' );
  const Tandem = require( 'TANDEM/Tandem' );

  class PopulationNode extends HBox {

    /**
     * @param {PopulationModel} populationModel
     * @param {Dimension2} size - dimensions of the rectangle available for this Node and its children
     * @param {Object} [options]
     */
    constructor( populationModel, size, options ) {

      options = merge( {

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        align: 'top',

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // Divy up the width
      const panelWidth = 0.25 * size.width;
      const graphWidth = size.width - panelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const panel = new PopulationPanel( populationModel, {
        fixedWidth: panelWidth,
        maxHeight: size.height,
        tandem: options.tandem.createTandem( 'panel' )
      } );

      const graphNode = new PopulationGraphNode( populationModel, {
        graphWidth: graphWidth,
        graphHeight: size.height,
        tandem: options.tandem.createTandem( 'graphNode' )
      } );

      assert && assert( !options.children, 'PopulationNode sets children' );
      options.children = [ panel, graphNode ];

      super( options );

      // @private
      this.graphNode = graphNode;
    }

    /**
     * @public
     */
    reset() {
      this.graphNode.reset();
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