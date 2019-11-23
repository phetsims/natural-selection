// Copyright 2019, University of Colorado Boulder

/**
 * ViewportNode is our viewport into the world of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Environments = require( 'NATURAL_SELECTION/common/model/Environments' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  // images
  const arcticBackgroundImage = require( 'image!NATURAL_SELECTION/arcticBackground.png' );
  const equatorBackgroundImage = require( 'image!NATURAL_SELECTION/equatorBackground.png' );

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

      const width = options.viewportSize.width;
      const height = options.viewportSize.height;

      // Equator background, scaled to fit
      const equatorBackground = new Image( equatorBackgroundImage );
      equatorBackground.setScaleMagnitude( width / equatorBackground.width, height / equatorBackground.height );

      // Arctic background, scaled to fit
      const arcticBackground = new Image( arcticBackgroundImage );
      arcticBackground.setScaleMagnitude( width / arcticBackground.width, height / arcticBackground.height );

      // Horizon line, for debugging. Bunnies cannot go further from the viewer than this line.
      const horizonLine = new Line( 0, options.viewportHorizonY, width, options.viewportHorizonY, {
        stroke: phet.chipper.queryParameters.dev ? 'red' : null,
        lineWidth: 1
      } );

      // Everything in the world, clipped to the viewport
      const worldContents = new Node( {
        children: [ equatorBackground, arcticBackground, horizonLine ],
        clipArea: Shape.rect( 0, 0, width, height )
      } );

      // Frame around the viewport
      const frameNode = new Rectangle( 0, 0, width, height, {
        stroke: NaturalSelectionColors.VIEWPORT_NODE_STROKE
      } );

      assert && assert( !options.children, 'ViewportNode sets children' );
      options.children = [ worldContents, frameNode ];

      super( options );

      environmentProperty.link( climate => {
        equatorBackground.visible = ( climate === Environments.EQUATOR );
        arcticBackground.visible = ( climate === Environments.ARCTIC );
      } );
    }
  }

  return naturalSelection.register( 'ViewportNode', ViewportNode );
} );