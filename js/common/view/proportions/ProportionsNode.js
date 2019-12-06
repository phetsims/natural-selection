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
  const ProportionsGraphNode = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsGraphNode' );
  const ProportionsPanel = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsPanel' );
  const Tandem = require( 'TANDEM/Tandem' );

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
        align: 'center',

        // phet-io
        tandem: Tandem.required
      }, options );

      // Divy up the width
      const panelWidth = 0.2 * size.width;
      const graphWidth = size.width - panelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const panel = new ProportionsPanel( proportionsModel, {
        fixedWidth: panelWidth,
        maxHeight: size.height,
        tandem: options.tandem.createTandem( 'panel' )
      } );

      const graphNode = new ProportionsGraphNode( proportionsModel, {
        graphWidth: graphWidth,
        graphHeight: size.height,
        tandem: options.tandem.createTandem( 'graphNode' )
      } );

      assert && assert( !options.children, 'ProportionsNode sets children' );
      options.children = [ panel, graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'ProportionsNode', ProportionsNode );
} );