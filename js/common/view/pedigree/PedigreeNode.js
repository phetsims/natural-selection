// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeNode is the parent for all parts of the 'Pedigree' view.
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
  const PedigreeControlPanel = require( 'NATURAL_SELECTION/common/view/pedigree/PedigreeControlPanel' );
  const PedigreeGraphNode = require( 'NATURAL_SELECTION/common/view/pedigree/PedigreeGraphNode' );

  class PedigreeNode extends HBox {

    /**
     * @param {PedigreeModel} pedigreeModel
     * @param {Object} [options]
     */
    constructor( pedigreeModel, options ) {

      options = merge( {

        controlPanelWidth: 100,
        controlPanelHeight: 100,
        graphWidth: 100,
        graphHeight: 100,

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING
      }, options );

      const controlPanel = new PedigreeControlPanel( pedigreeModel, {
        fixedWidth: options.controlPanelWidth,
        maxHeight: options.controlPanelHeight
      } );

      const graphNode = new PedigreeGraphNode( pedigreeModel, {
        graphWidth: options.graphWidth,
        graphHeight: options.graphHeight
      } );

      assert && assert( !options.children, 'PedigreeNode sets children' );
      options.children = [ controlPanel, graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PedigreeNode', PedigreeNode );
} );