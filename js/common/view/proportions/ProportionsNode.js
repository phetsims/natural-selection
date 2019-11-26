// Copyright 2019, University of Colorado Boulder

/**
 * ProportionsNode is the parent for all parts of the Proportions view.
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
  const ProportionsControlPanel = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsControlPanel' );
  const ProportionsGraphNode = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsGraphNode' );

  class ProportionsNode extends HBox {

    /**
     * @param {ProportionsModel} proportionsModel
     * @param {Object} [options]
     */
    constructor( proportionsModel, options ) {

      options = merge( {

        controlPanelWidth: 100,
        controlPanelHeight: 100,
        graphWidth: 100,
        graphHeight: 100,

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        align: 'center'
      }, options );

      const controlPanel = new ProportionsControlPanel( proportionsModel, {
        fixedWidth: options.controlPanelWidth,
        maxHeight: options.controlPanelHeight
      } );

      const graphNode = new ProportionsGraphNode( proportionsModel, {
        graphWidth: options.graphWidth,
        graphHeight: options.graphHeight
      } );

      assert && assert( !options.children, 'ProportionsNode sets children' );
      options.children = [ controlPanel, graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'ProportionsNode', ProportionsNode );
} );