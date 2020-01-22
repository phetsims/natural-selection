// Copyright 2020, University of Colorado Boulder

//TODO scaling aspect of this is unnecessary in JS version
//TODO draw a picture of the model space, for the next person
//TODO methods that refer to 'ground' are not well-behaved for z < NEARPLANE and z > FARPLANE

//TODO where is the model origin?
//TODO   x=0 is in the middle, negative left, positive right
//TODO   y=0 is at the horizon, negative down, positive up
//TODO   z=0 is at the camera, positive into the screen

//TODO (0, -RISE, NEARPLANE) = (0,-100,150) is at bottom center of viewport, xMax = ~179
//TODO (0, 0, FARPLANE) = (0, 0, 300) is at center of horizon, xMax = ~358
//TODO (0, 158, 538) is at top-center of viewport, xMax = ~642

/**
 * Represents both a landscape itself (ground plane), but also the coordinates and transformations from this 3D
 * system to and from view coordinates. View coordinates are scaled so that the "screen" coordinates are independent
 * of how the view is resized.
 *
 * The actual ground is a plane, angled so that it looks like it is a hillside whose elevation increases from
 * foreground to background.
 *
 * @author Jonathan Olson - Java version
 * @author Chris Malley (PixelZoom, Inc.) - JavaScript version
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector3 = require( 'DOT/Vector3' );

  class Landscape {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {

        //TODO
        landscapeWidth: Landscape.SIZE.width,
        landscapeHeight: Landscape.SIZE.height
      }, options );

      // @public {number}
      this.landscapeWidth = options.landscapeWidth;
      this.landscapeHeight = options.landscapeHeight;
    }

    //TODO delete this since we're not resizing the viewport
    /**
     * Sets the dimensions of the landscape.
     * @param {number} landscapeWidth
     * @param {number} landscapeHeight
     * @public
     */
    setSize( landscapeWidth, landscapeHeight ) {
      this.landscapeWidth = landscapeWidth;
      this.landscapeHeight = landscapeHeight;
    }

    //TODO model or view coordinates?
    /**
     * Returns a random position on the ground. Since the ground display is similar to a trapezoid, we sample it as such.
     * @returns {Vector3} random 3D ground position
     * @public
     */
    getRandomGroundPosition() {

      //TODO what is this computation? why isn't this just random z between NEARPLANE and FARPLANE?
      // randomly sample the trapezoid in the z direction
      const z = Math.sqrt( Landscape.NEARPLANE * Landscape.NEARPLANE +
                           phet.joist.random.nextDouble() * ( Landscape.FARPLANE * Landscape.FARPLANE - Landscape.NEARPLANE * Landscape.NEARPLANE ) );

      const x = this.getMaximumX( z ) * ( phet.joist.random.nextDouble() * 2 - 1 );
      const y = this.getGroundY( x, z );

      return new Vector3( x, y, z );
    }

    //TODO this only returns a ground position if z is between NEARPLANE and FARPLANE
    /**
     * Gets the ground position at specified x and z coordinates.
     * @param {number} xModel
     * @param {number} zModel
     * @returns {Vector3} ground position, in model coordinates
     * @public
     */
    getGroundPoint( xModel, zModel ) {
      return new Vector3( xModel, this.getGroundY( xModel, zModel ), zModel );
    }

    //TODO xModel is unused
    //TODO for z > FARPLANE, this behaves as if ground continues past horizon and gives a position in the sky
    //TODO for z < NEARPLANE, this behaves as if the ground continues between NEARPLANE and camera
    //TODO so is the ground a trapedoid or a plane?
    /**
     * Gets the ground height at specified x and z coordinates.
     * @param {number} xModel
     * @param {number} zModel
     * @returns {number} y, in model coordinates
     * @public
     */
    getGroundY( xModel, zModel ) {

      //TODO what is this computation?
      return ( zModel - Landscape.FARPLANE ) * Landscape.VERTICAL_RISE / ( Landscape.FARPLANE - Landscape.NEARPLANE );
    }

    //TODO getMaximumX( 0 ) returns 0. So is the ground really a trapedoid?
    //TODO this is not well-behaved for z > FARPLANE
    /**
     * Gets the maximum x value for a particular depth. This varies on depth, since the bunnies are (in 3D)
     * laid out on a trapezoidal field.
     * @param zModel
     * @returns {number} maximum x, in model coordinates
     * @public
     */
    getMaximumX( zModel ) {
      return zModel * Landscape.SIZE.width * 0.5 / this.getFactor();
    }

    /**
     * Gets the minimum x value for a particular depth. Since x=0 is in the center, xMin === -xMax.
     * @param zModel
     * @returns {number} minimum x, in model coordinates
     * @public
     */
    getMinimumX( zModel ) {
      return -this.getMaximumX( zModel );
    }

    //TODO what is this?
    //TODO this should be a constant
    /**
     * Common scaling factor
     * @returns {number}
     * @public
     */
    getFactor() {
      return ( Landscape.SIZE.height - Landscape.HORIZON ) * Landscape.NEARPLANE / Landscape.VERTICAL_RISE;
    }

    //TODO this is not well-behaved for yView < HORIZON
    //TODO this is not well-behaved for yView > SIZE.height, approaches 0 but never gets there
    /**
     * Given a view y value, return the model z value where the ground has that y height.
     * @param {number} yView
     * @returns {number} z, in model coordinates
     * @public
     */
    landscapeYToZ( yView ) {

      //TODO what is this computation?
      return ( Landscape.NEARPLANE * Landscape.FARPLANE * ( Landscape.HORIZON - Landscape.SIZE.height ) ) /
             ( Landscape.FARPLANE * ( Landscape.HORIZON - yView ) + Landscape.NEARPLANE * ( yView - Landscape.SIZE.height ) );
    }

    /**
     * Given a view x value and a model z value, return the model x value.
     * @param {number} xView
     * @param {number} zModel
     * @returns {number} x, in model coordinates
     * @public
     */
    landscapeXZToX( xView, zModel ) {
      return zModel * ( xView - Landscape.SIZE.width / 2 ) / this.getFactor();
    }

    //TODO rename to viewToModelPosition
    //TODO not well-behaved for y < HORIZON, returns positions up in the sky
    //TODO not well-behaved for y > SIZE.height, z approaches 0 but never gets there
    /**
     * Given view coordinates (x,y), return the ground position in model coordinates.
     * @param {number} xView
     * @param {number} yView
     * @returns {Vector3} ground position, in model coordinates
     * @public
     */
    landscapeToModel( xView, yView ) {
      const zModel = this.landscapeYToZ( yView );
      const xModel = this.landscapeXZToX( xView, zModel );
      const yModel = this.getGroundY( xModel, zModel );
      return new Vector3( xModel, yModel, zModel );
    }

    //TODO rename to modelToViewPosition
    /**
     * Given a 3D model position, project it into 2D view coordinates.
     * @param {Vector3 } position
     * @returns {Vector2}
     * @public
     */
    spriteToScreen( position ) {
      const landscapeX = ( Landscape.SIZE.width / 2 ) + ( position.x / position.z ) * this.getFactor();
      const landscapeY = Landscape.HORIZON - ( position.y / position.z ) * this.getFactor();

      //TODO scaling here can be deleted, since we're not resizing the viewport
      return new Vector2(
        landscapeX * this.landscapeWidth / Landscape.SIZE.width,
        landscapeY * this.landscapeHeight / Landscape.SIZE.height
      );
    }

    //TODO I don't understand this, what is a 'view distance'? Is it an x distance?
    //TODO rename to viewToModelDistance
    /**
     * Turns a view distance into a model distance at a particular model z (depth).
     * @param {number} distanceView
     * @param {number} zModel
     * @returns {number} distance, in model coordinates
     * @public
     */
    landscapeDistanceToModel( distanceView, zModel ) {
      return distanceView * zModel / this.getFactor();
    }

    //TODO this was copied from Java BunnyNode.rescale and Wolf.wolfScale, but was not used for food, see ShrubNode.rescale, TreeNode.rescale
    //TODO factor out 0.25, which is the scale at NEARPLANE
    //TODO Infinity at zModel = 0 ??
    /**
     * Gets the view scaling factor that corresponds to model z position.
     * @param {number} zModel
     * @returns {number}
     */
    getViewScale( zModel ) {
      return Landscape.NEARPLANE * 0.25 / zModel;
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'Landscape does not support dispose' );
    }
  }

  //TODO can delete 'regardless of the dimensions of the viewing window' since we won't be resizing the viewport
  // Static "landscape" size in view coordinates. Bunny (and other sprite) 3D coordinates are contained within this
  // coordinate system, regardless of the dimensions of the viewing window.
  Landscape.SIZE = new Dimension2( 770, 310 ); // same size as background images

  //TODO 'if infinitely far away' is not handled correctly. And z > FAR_PLANE will put the bunny in the sky.
  // Y coordinate of the horizon, in view coordinates, where the 3D bunny positions would appear if infinitely far away.
  // Determined empirically from background PNG files.
  Landscape.HORIZON = 95;

  //TODO what happens for z values smaller than this?
  // The z distance of the bottom and front of the ground, in model coordinates.
  // This is as close as bunnies can get to the "camera".
  Landscape.NEARPLANE = 150;

  //TODO what happens for z values larger than this?
  // The z distance of the horizon from the "camera", in model coordinates.
  Landscape.FARPLANE = 300;

  // Total vertical (y) rise of the ground plane from NEARPLANE to FARPLANE, in model coordinates.
  Landscape.VERTICAL_RISE = 100;

  return naturalSelection.register( 'Landscape', Landscape );
} );
