// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsNode is the parent for all parts of the Proportions view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const ProportionsGraphNode = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsGraphNode' );
  const ProportionsModel = require( 'NATURAL_SELECTION/common/model/ProportionsModel' );
  const ProportionsPanel = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsPanel' );
  const Tandem = require( 'TANDEM/Tandem' );

  class ProportionsNode extends HBox {

    /**
     * @param {ProportionsModel} proportionsModel
     * @param {Dimension2} size - dimensions of the rectangle available for this Node and its children
     * @param {Object} [options]
     */
    constructor( proportionsModel, size, options ) {

      assert && assert( proportionsModel instanceof ProportionsModel, 'invalid proportionsModel' );
      assert && assert( size instanceof Dimension2, 'invalid size' );

      options = merge( {

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        align: 'center',

        // phet-io
        tandem: Tandem.REQUIRED,
        phetioDocumentation: 'the Proportions graph and its control panel'
      }, options );

      // Divy up the width
      const panelWidth = 0.2 * size.width;
      const graphWidth = size.width - panelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const proportionsPanel = new ProportionsPanel( proportionsModel, {
        fixedWidth: panelWidth,
        maxHeight: size.height,
        tandem: options.tandem.createTandem( 'proportionsPanel' )
      } );

      const proportionsGraphNode = new ProportionsGraphNode( proportionsModel, {
        graphWidth: graphWidth,
        graphHeight: size.height,
        tandem: options.tandem.createTandem( 'proportionsGraphNode' )
      } );

      assert && assert( !options.children, 'ProportionsNode sets children' );
      options.children = [ proportionsPanel, proportionsGraphNode ];

      super( options );

      // Create a link to the model that this Node displays
      this.addLinkedElement( proportionsModel, {
        tandem: options.tandem.createTandem( 'proportionsModel' )
      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'ProportionsNode does not support dispose' );
    }
  }

  return naturalSelection.register( 'ProportionsNode', ProportionsNode );
} );