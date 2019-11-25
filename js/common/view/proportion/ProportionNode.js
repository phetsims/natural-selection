// Copyright 2019, University of Colorado Boulder

/**
 * ProportionNode is the parent for all parts of the 'Proportion' view.
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
  const ProportionControlPanel = require( 'NATURAL_SELECTION/common/view/proportion/ProportionControlPanel' );
  const ProportionGraphNode = require( 'NATURAL_SELECTION/common/view/proportion/ProportionGraphNode' );

  class ProportionNode extends HBox {

    /**
     * @param {ProportionModel} proportionModel
     * @param {Object} [options]
     */
    constructor( proportionModel, options ) {

      options = merge( {

        controlPanelWidth: 100,
        controlPanelHeight: 100,
        graphWidth: 100,
        graphHeight: 100,

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        align: 'center'
      }, options );

      const controlPanel = new ProportionControlPanel( proportionModel, {
        fixedWidth: options.controlPanelWidth,
        maxHeight: options.controlPanelHeight
      } );

      const graphNode = new ProportionGraphNode( proportionModel, {
        graphWidth: options.graphWidth,
        graphHeight: options.graphHeight
      } );

      assert && assert( !options.children, 'ProportionNode sets children' );
      options.children = [ controlPanel, graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'ProportionNode', ProportionNode );
} );