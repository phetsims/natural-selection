// Copyright 2020, University of Colorado Boulder

//TODO scaling aspect of this is unnecessary in JS version
//TODO does not appear to handle perspective, model x & y distance doesn't scale with z depth
//TODO 'ground' calculations don't respect the horizon, things end up floating above the horizon
//TODO model yModel=0 should correspond to bottom of EnvironmentNode, yModel < 0 should fail
//TODO Food positions set in EnvironmentModel and logged in Food don't make sense
//TODO replace this entire class with a custom 3D-2D MVT, or doc how it was ported from Java
//TODO draw a picture of the model space

//TODO where is the model origin?
//TODO   model x=0 appears to be in middle, negative to left, positive to right
//TODO   model y=0 appears to be at the horizon, negative closer to the camera, why isn't it at the camera?
//TODO   is z=0 at the camera?

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
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
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

    //TODO delete this, not needed in JS version
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

      // randomly sample the trapezoid in the z direction
      const z = Math.sqrt( Landscape.NEARPLANE * Landscape.NEARPLANE + phet.joist.random() * ( Landscape.FARPLANE * Landscape.FARPLANE - Landscape.NEARPLANE * Landscape.NEARPLANE ) );

      const x = this.getMaximumX( z ) * ( phet.joist.random() * 2 - 1 );
      const y = this.getGroundY( x, z );

      return new Vector3( x, y, z );
    }

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
    /**
     * Gets the ground height at specified x and z coordinates.
     * @param {number} xModel
     * @param {number} zModel
     * @returns {number} y, in model coordinates
     * @public
     */
    getGroundY( xModel, zModel ) {
      return ( zModel - Landscape.FARPLANE ) * Landscape.VERTICAL_RISE / ( Landscape.FARPLANE - Landscape.NEARPLANE );
    }

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
    //TODO model or view coordinates?
    //TODO this should be a constant
    /**
     * Common scaling factor
     * @returns {number}
     * @public
     */
    getFactor() {
      return ( Landscape.SIZE.height - Landscape.HORIZON ) * Landscape.NEARPLANE / Landscape.VERTICAL_RISE;
    }

    /**
     * Given a view y value, return the model z value where the ground has that y height.
     * @param {number} yView
     * @returns {number} z, in model coordinates
     * @public
     */
    landscapeYToZ( yView ) {
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
      return new Vector2(
        landscapeX * this.landscapeWidth / Landscape.SIZE.width,
        landscapeY * this.landscapeHeight / Landscape.SIZE.height
      );
    }

    //TODO rename to viewToModelDistance
    /**
     * Turns a view distance into a model distance at a particular model z (depth).
     * @param {number} distanceView
     * @param {number} zModel
     * @returns {number} distance, in model coordiantes
     * @public
     */
    landscapeDistanceToModel( distanceView, zModel ) {
      return distanceView * zModel / this.getFactor();
    }

    //TODO this was copied from Java BunnyNode.rescale and Wolf.wolfScale, but was not used for food, see
    // ShrubNode.rescale, TreeNode.rescale
    /**
     * Gets the view scaling factor that corresponds to model z postion.
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

  // Static "landscape" size in view coordinates. Bunny (and other sprite) 3D coordinates are contained within this
  // coordinate system, regardless of the dimensions of the viewing window.
  Landscape.SIZE = NaturalSelectionConstants.ENVIRONMENT_DISPLAY_SIZE;

  // Y coordinate of the horizon, in view coordinates, where the 3D bunny positions would appear if infinitely far away.
  Landscape.HORIZON = NaturalSelectionConstants.ENVIRONMENT_DISPLAY_HORIZON_Y;

  //TODO what coordinate frame? relative to?
  //TODO what happens for z values smaller than this?
  // This is as close as bunnies can get to the "camera". Essentially the bottom and front of the ground
  Landscape.NEARPLANE = 150;

  //TODO what coordinate frame? relative to?
  //TODO what happens for z values larger than this?
  // The z distance of the horizon from the "camera"
  Landscape.FARPLANE = 300;

  //TODO what coordinate frame?
  //TODO does "from the front to the back" mean from NEARPLANE to FARPLANE, from camera to FARPLANE, ...?
  // Total vertical (y) rise of the ground plane from the front to the back.
  Landscape.VERTICAL_RISE = 100;

  return naturalSelection.register( 'Landscape', Landscape );
} );
