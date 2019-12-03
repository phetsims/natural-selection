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
     * @param {Dimension2} size - dimensions of the rectangle available for this Node and its children
     * @param {Object} [options]
     */
    constructor( proportionsModel, size, options ) {

      options = merge( {

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        align: 'center'
      }, options );

      // Divy up the width
      const controlPanelWidth = 0.2 * size.width;
      const graphWidth = size.width - controlPanelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const controlPanel = new ProportionsControlPanel( proportionsModel, {
        fixedWidth: controlPanelWidth,
        maxHeight: size.height
      } );

      const graphNode = new ProportionsGraphNode( proportionsModel, {
        graphWidth: graphWidth,
        graphHeight: size.height
      } );

      assert && assert( !options.children, 'ProportionsNode sets children' );
      options.children = [ controlPanel, graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'ProportionsNode', ProportionsNode );
} );