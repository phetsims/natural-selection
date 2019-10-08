// Copyright 2019, University of Colorado Boulder

/**
 * WorldNode is our viewport in the world of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Climates = require( 'NATURAL_SELECTION/common/model/Climates' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  class WorldNode extends Node {

    /**
     * @param {Enumeration.<Climates>} climateProperty
     * @param {number} height
     * @param {number} width
     * @param {Object} [options]
     */
    constructor( climateProperty, width, height, options ) {

      const skyLineRatio = 0.25;
      const groundHeight = ( 1 - skyLineRatio ) * height;

      // Equator sky
      const equatorSkyGradient = new LinearGradient( 0, 0, 0, height );
      equatorSkyGradient.addColorStop( 0, 'rgb( 174, 224, 234 )' );
      equatorSkyGradient.addColorStop( skyLineRatio, 'rgb( 133, 190, 210 )' );
      const equatorSkyNode = new Rectangle( 0, 0, width, height, {
        fill: equatorSkyGradient
      } );

      // Equator ground
      const equatorGroundGradient = new LinearGradient( 0, height - groundHeight, 0, groundHeight );
      equatorGroundGradient.addColorStop( 0, 'rgb( 140, 105, 65 )' );
      equatorGroundGradient.addColorStop( 1, 'rgb( 195, 148, 98 )' );
      const equatorGroundNode = new Rectangle( 0, height - groundHeight, width, groundHeight, {
        fill: equatorGroundGradient
      } );

      // Arctic sky
      const arcticSkyGradient = new LinearGradient( 0, 0, 0, height );
      arcticSkyGradient.addColorStop( 0, 'rgb( 144, 185, 195 )' );
      arcticSkyGradient.addColorStop( 0.3, 'rgb( 102, 150, 175 )' );
      const arcticSkyNode = new Rectangle( 0, 0, width, height, {
        fill: arcticSkyGradient
      } );

      // Arctic ground
      const arcticGroundGradient = new LinearGradient( 0, height - groundHeight, 0, groundHeight );
      arcticGroundGradient.addColorStop( 0, 'rgb( 192, 215, 226 )' );
      arcticGroundGradient.addColorStop( 1, 'rgb( 238, 249, 254 )' );
      const arcticGroundNode = new Rectangle( 0, height - groundHeight, width, groundHeight, {
        fill: arcticGroundGradient
      } );

      // Everything in the world, clipped to the viewport
      const worldContents = new Node( {
        children: [ equatorSkyNode, equatorGroundNode, arcticSkyNode, arcticGroundNode ],
        clipArea: Shape.rect( 0, 0, width, height )
      } );

      // Frame around the viewport
      const frameNode = new Rectangle( 0, 0, width, height, {
        stroke: NaturalSelectionColors.WORLD_NODE_STROKE
      } );

      assert && assert( !options.children, 'WorldNode sets children' );
      options.children = [ worldContents, frameNode ];

      super( options );

      climateProperty.link( climate => {

        equatorSkyNode.visible = ( climate === Climates.EQUATOR );
        equatorGroundNode.visible = ( climate === Climates.EQUATOR );

        arcticSkyNode.visible = ( climate === Climates.ARCTIC );
        arcticGroundNode.visible = ( climate === Climates.ARCTIC );
      } );
    }
  }

  return naturalSelection.register( 'WorldNode', WorldNode );
} );