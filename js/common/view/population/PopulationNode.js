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
  const PopulationControlPanel = require( 'NATURAL_SELECTION/common/view/population/PopulationControlPanel' );
  const PopulationGraphNode = require( 'NATURAL_SELECTION/common/view/population/PopulationGraphNode' );

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
        align: 'top'
      }, options );

      // Divy up the width
      const controlPanelWidth = 0.25 * size.width;
      const graphWidth = size.width - controlPanelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const controlPanel = new PopulationControlPanel( populationModel, {
        fixedWidth: controlPanelWidth,
        maxHeight: size.height
      } );

      const graphNode = new PopulationGraphNode( populationModel, {
        graphWidth: graphWidth,
        graphHeight: size.height
      } );

      assert && assert( !options.children, 'PopulationNode sets children' );
      options.children = [ controlPanel, graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationNode', PopulationNode );
} );