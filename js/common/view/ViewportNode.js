// Copyright 2019, University of Colorado Boulder

/**
 * ViewportNode is our viewport into the world of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnvironmentNode = require( 'NATURAL_SELECTION/common/view/EnvironmentNode' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  class ViewportNode extends Node {

    /**
     * @param {EnumerationProperty.<Environments>} environmentProperty
     * @param {Object} [options]
     */
    constructor( environmentProperty, options ) {

      options = merge( {
        viewportSize: NaturalSelectionConstants.VIEWPORT_NODE_SIZE,
        viewportHorizonY: NaturalSelectionConstants.VIEWPORT_HORIZON_Y
      }, options );

      const environmentNode = new EnvironmentNode( environmentProperty, options.viewportSize, options.viewportHorizonY );

      // Everything in the world, clipped to the viewport
      const worldContents = new Node( {
        children: [ environmentNode ],
        clipArea: Shape.rect( 0, 0, options.viewportSize.width, options.viewportSize.height )
      } );

      // Frame around the viewport
      const frameNode = new Rectangle( 0, 0, options.viewportSize.width, options.viewportSize.height, {
        stroke: NaturalSelectionColors.PANEL_STROKE
      } );

      assert && assert( !options.children, 'ViewportNode sets children' );
      options.children = [ worldContents, frameNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'ViewportNode', ViewportNode );
} );