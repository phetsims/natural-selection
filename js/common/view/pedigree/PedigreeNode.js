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
  // const NaturalSelectionQueryParameters = require( 'NATURAL_SELECTION/common/NaturalSelectionQueryParameters' );
  const PedigreeControlPanel = require( 'NATURAL_SELECTION/common/view/pedigree/PedigreeControlPanel' );
  const PedigreeGraphNode = require( 'NATURAL_SELECTION/common/view/pedigree/PedigreeGraphNode' );

  class PedigreeNode extends HBox {

    /**
     * @param {PedigreeModel} pedigreeModel
     * param {Dimension2} size
     * @param {Object} [options]
     */
    constructor( pedigreeModel, size, options ) {

      options = merge( {

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        align: 'center'
      }, options );

      // Divy up the width
      const controlPanelWidth = 0.25 * size.width;
      const graphWidth = size.width - controlPanelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const controlPanel = new PedigreeControlPanel( pedigreeModel, {
        fixedWidth: controlPanelWidth,
        maxHeight: size.height
      } );

      const graphNode = new PedigreeGraphNode( pedigreeModel, {
        graphWidth: graphWidth,
        graphHeight: size.height
      } );

      assert && assert( !options.children, 'PedigreeNode sets children' );
      options.children = [ controlPanel, graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PedigreeNode', PedigreeNode );
} );