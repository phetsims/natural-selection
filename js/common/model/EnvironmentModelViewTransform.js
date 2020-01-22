// Copyright 2020, University of Colorado Boulder

/**
 * EnvironmentModelViewTransform is the model-view transform for the 'environment', the space where bunnies, wolves,
 * food, etc. appear. The model is 3D, the view is 2D, so this deals with the 2D projection of a 3D space.
 *
 * The ground is a trapezoid that rises with constant slope as distance from the 'camera' increases.
 * zNearModel and zFarModel define the front and back of the trapezoid, and methods related to the ground
 * are well-behaved only for z between zNearModel and zFarModel.
 *
 * Model origin and axes:
 * x = 0 is in the middle, positive right
 * y = 0 is at the horizon, positive up
 * z = 0 is at the camera, positive into the screen
 *
 * View origin and axes are typical scenery:
 * x = 0 at upper-left, positive right
 * y = 0 at upper-left, positive down
 *
 * Here are some diagrams (not to scale) that illustrate the 3D model space:
 *
 * Top view:
 *
 *  xMin                 xMax
 *    \                  /
 *  ___\________________/_______ z = zFarModel (horizon)
 *      \    ground    /
 *       \ trapezoid  /
 *        \          /
 *  _______\________/___________ z = zNearModel (bottom of view)
 *          \      /
 *           \    /
 *            \  /
 *  ___________\/_______________ z = 0 (camera)
 *            x=0
 *
 * Side view:
 *
 *     camera
 *      z=0    zNearModel  zFarModel
 *       |         |        |
 *    ___|_________|________|_____  y = 0 (horizon)
 *       |         |       /|
 *       |         |      / |
 *       |         |     /  |
 *       |         |    /   |
 *       |         |   /    |
 *       |         |  /     |
 *       |         | /      |
 *    ___|_________|/_______|_____ y = -riseModel (bottom of view)
 *       |         |        |
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jonathan Olson (Landscape.java, from which this was adapted)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector3 = require( 'DOT/Vector3' );

  // constants
  const NEAR_SCALE = 0.25; // scale at zNearModel

  class EnvironmentModelViewTransform {

    constructor() {

      // @public (read-only) size of the 2D view, same size as background PNG files
      this.viewSize = new Dimension2( 770, 310 );

      // @public (read-only) horizon distance from the top of the view, determined empirically from background PNG files
      this.yHorizonView = 95;

      // @private z coordinate of the ground at the bottom-front of the view, nearest ground point to camera
      this.zNearModel = 150;

      // @private z coordinate of the ground at the horizon, furthest ground point from camera
      this.zFarModel = 300;

      // @private rise of the ground from zNearModel to zFarModel
      this.riseModel = 100;

      //TODO I don't understand this
      // @private
      this.scaleFactor = ( this.viewSize.height - this.yHorizonView ) * this.zNearModel / this.riseModel;
    }

    /**
     * Returns a random position on the ground, in model coordinates.
     * @returns {Vector3}
     * @public
     */
     getRandomGroundPosition() {

      //TODO this might be moving the distribution closer to NEARPLANE, so we have more things closer to camera
      //TODO what is this computation? why isn't this just random z between NEARPLANE and FARPLANE?
      // randomly sample the trapezoid in the z direction
      const z = Math.sqrt( this.zNearModel * this.zNearModel +
                           phet.joist.random.nextDouble() * ( this.zFarModel * this.zFarModel - this.zNearModel * this.zNearModel ) );

      const x = this.getMaximumX( z ) * ( phet.joist.random.nextDouble() * 2 - 1 );
      const y = this.getGroundY( z );

      return new Vector3( x, y, z );
    }

    /**
     * Gets the ground position at specified x and z coordinates.
     * @param {number} xModel
     * @param {number} zModel
     * @returns {Vector3} ground position, in model coordinates
     * @public
     */
    getGroundPosition( xModel, zModel ) {
      assert && assert( zModel >= this.zNearModel && zModel <= this.zFarModel, `invalid zModel: ${zModel}` );
      return new Vector3( xModel, this.getGroundY( zModel ), zModel );
    }

    /**
     * Gets the ground y at the specified z coordinate.
     * @param {number} zModel
     * @returns {number} y, in model coordinates
     * @public
     */
    getGroundY( zModel ) {
      assert && assert( zModel >= this.zNearModel && zModel <= this.zFarModel, `invalid zModel: ${zModel}` );

      //TODO what is this computation?
      return ( zModel - this.zFarModel ) * this.riseModel / ( this.zFarModel - this.zNearModel );
    }

    /**
     * Gets the maximum x value for a particular depth. This varies based on depth, since the ground is a trapezoid.
     * @param zModel
     * @returns {number} maximum x, in model coordinates
     * @public
     */
    getMaximumX( zModel ) {
      assert && assert( zModel >= this.zNearModel && zModel <= this.zFarModel, `invalid zModel: ${zModel}` );
      return zModel * this.viewSize.width * 0.5 / this.scaleFactor;
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

    /**
     * Gets the view scaling factor that corresponds to model z position.
     * @param {number} zModel
     * @returns {number}
     * @public
     */
    getViewScale( zModel ) {
      assert && assert( zModel > 0, `invalid zModel: ${zModel}` );
      return NEAR_SCALE * this.zNearModel / zModel;
    }

    /**
     * Given a 3D model position, project it into 2D view coordinates.
     * @param {Vector3 } position
     * @returns {Vector2}
     * @public
     */
    modelToViewPosition( position ) {
      const xView = ( this.viewSize.width / 2 ) + ( position.x / position.z ) * this.scaleFactor;
      const yView = this.yHorizonView - ( position.y / position.z ) * this.scaleFactor;
      return new Vector2( xView, yView );
    }

    /**
     * Given a view y value, return the model z value where the ground has that y height.
     * @param {number} yView
     * @returns {number} z, in model coordinates
     * @public
     */
    viewToModelZ( yView ) {
      assert && assert( yView >= this.yHorizonView && yView <= this.viewSize.height, `invalid yView: ${yView}` );

      //TODO what is this computation?
      return ( this.zNearModel * this.zFarModel * ( this.yHorizonView - this.viewSize.height ) ) /
             ( this.zFarModel * ( this.yHorizonView - yView ) + this.zNearModel * ( yView - this.viewSize.height ) );
    }

    /**
     * Given a view x value and a model z value, return the model x value.
     * @param {number} xView
     * @param {number} zModel
     * @returns {number} x, in model coordinates
     * @public
     */
    viewToModelX( xView, zModel ) {
      return zModel * ( xView - this.viewSize.width / 2 ) / this.scaleFactor;
    }

    /**
     * Given view coordinates (x,y), return the ground position in model coordinates.
     * @param {number} xView
     * @param {number} yView
     * @returns {Vector3} ground position, in model coordinates
     * @public
     */
    viewToModelGroundPosition( xView, yView ) {
      assert && assert( xView >= 0 && xView <= this.viewSize.width, `invalid xView: ${xView}` );
      assert && assert( yView >= this.yHorizonView && yView <= this.viewSize.height, `invalid yView: ${yView}` );

      const zModel = this.viewToModelZ( yView );
      const xModel = this.viewToModelX( xView, zModel );
      const yModel = this.getGroundY( zModel );
      return new Vector3( xModel, yModel, zModel );
    }

    /**
     * Turns a view distance (x or y) into a model distance at a specified model z.
     * @param {number} distanceView
     * @param {number} zModel
     * @returns {number} distance, in model coordinates
     * @public
     */
    viewToModelDistance( distanceView, zModel ) {
      return distanceView * zModel / this.scaleFactor;
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'EnvironmentModelViewTransform does not support dispose' );
    }
  }

  return naturalSelection.register( 'EnvironmentModelViewTransform', EnvironmentModelViewTransform );
} );
