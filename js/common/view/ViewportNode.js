// Copyright 2019, University of Colorado Boulder

/**
 * ViewportNode is our viewport into the world of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AbioticEnvironments = require( 'NATURAL_SELECTION/common/model/AbioticEnvironments' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Line = require( 'SCENERY/nodes/Line' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  // images
  const arcticBackgroundImage = require( 'image!NATURAL_SELECTION/arcticBackground.png' );
  const equatorBackgroundImage = require( 'image!NATURAL_SELECTION/equatorBackground.png' );

  class ViewportNode extends Node {

    /**
     * @param {EnumerationProperty.<AbioticEnvironments>} environmentProperty
     * @param {number} height
     * @param {number} width
     * @param {Object} [options]
     */
    constructor( environmentProperty, width, height, options ) {

      // Equator background, scaled to fit
      const equatorBackground = new Image( equatorBackgroundImage );
      equatorBackground.setScaleMagnitude( width / equatorBackground.width, height / equatorBackground.height );

      // Arctic background, scaled to fit
      const arcticBackground = new Image( arcticBackgroundImage );
      arcticBackground.setScaleMagnitude( width / arcticBackground.width, height / arcticBackground.height );

      // Horizon line, for debugging. Bunnies cannot go further back than this line.
      const horizonY = 115;
      const horizonLine = new Line( 0, horizonY, width, horizonY, {
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
        stroke: NaturalSelectionColors.WORLD_NODE_STROKE
      } );

      assert && assert( !options.children, 'ViewportNode sets children' );
      options.children = [ worldContents, frameNode ];

      super( options );

      environmentProperty.link( climate => {
        equatorBackground.visible = ( climate === AbioticEnvironments.EQUATOR );
        arcticBackground.visible = ( climate === AbioticEnvironments.ARCTIC );
      } );
    }
  }

  return naturalSelection.register( 'ViewportNode', ViewportNode );
} );