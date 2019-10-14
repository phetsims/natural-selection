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
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  class ViewportNode extends Node {

    /**
     * @param {EnumerationProperty.<AbioticEnvironments>} environmentProperty
     * @param {number} height
     * @param {number} width
     * @param {Object} [options]
     */
    constructor( environmentProperty, width, height, options ) {

      const skyPercentage = 0.25; // what percentage of the viewport is sky
      
      const groundHeight = ( 1 - skyPercentage ) * height;

      // Equator sky
      const equatorSkyGradient = new LinearGradient( 0, 0, 0, height );
      equatorSkyGradient.addColorStop( 0, 'rgb( 174, 224, 234 )' );
      equatorSkyGradient.addColorStop( skyPercentage, 'rgb( 133, 190, 210 )' );
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

      // Equator sky & ground
      const equatorNode = new Node( { children: [ equatorSkyNode, equatorGroundNode ] } );

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

      // Arctic sky & ground
      const arcticNode = new Node( { children: [ arcticSkyNode, arcticGroundNode ] } );

      // Everything in the world, clipped to the viewport
      const worldContents = new Node( {
        children: [ equatorNode, arcticNode ],
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
        equatorNode.visible = ( climate === AbioticEnvironments.EQUATOR );
        arcticNode.visible = ( climate === AbioticEnvironments.ARCTIC );
      } );
    }
  }

  return naturalSelection.register( 'ViewportNode', ViewportNode );
} );