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
     * @param {Object} [options]
     */
    constructor( populationModel, options ) {

      options = merge( {

        controlPanelWidth: 100,
        controlPanelHeight: 100,
        graphWidth: 100,
        graphHeight: 100,

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING
      }, options );

      const controlPanel = new PopulationControlPanel( populationModel, {
        fixedWidth: options.controlPanelWidth,
        maxHeight: options.controlPanelHeight
      } );

      const graphNode = new PopulationGraphNode( populationModel, {
        graphWidth: options.graphWidth,
        graphHeight: options.graphHeight
      } );

      assert && assert( !options.children, 'PopulationNode sets children' );
      options.children = [ controlPanel, graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationNode', PopulationNode );
} );