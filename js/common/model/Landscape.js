// Copyright 2020, University of Colorado Boulder

//TODO draw a picture of the model space, for the next person

/**
 * Model-view transform for the 'environment', the place where bunnies, wolves, food, etc. appear.
 * The ground is a trapezoid that rises with constant slope as distance from the 'camera' increases.
 * zNearModel and zFarModel define the from an back of the trapedoid, and methods are generally well-behaved
 * only between zNearModel and zFarModel.
 *
 * Model origin and axes:
 * x=0 is in the middle, negative left, positive right
 * y=0 is at the horizon, negative down, positive up
 * z=0 is at the camera, positive into the screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector3 = require( 'DOT/Vector3' );

  class Landscape {

    constructor() {

      // @public (read-only) size of the 2D view
      this.viewSize = new Dimension2( 770, 310 ); // same size as background images

      // @public (read-only) horizon distance from the top of the view, determined empirically from background PNG files
      this.yHorizonView = 95;
      
      // @private rise of the ground from zNearModel to zFarModel
      this.riseModel = 100;

      // @private z coordinate of the bottom-front of the ground
      this.zNearModel = 150;

      // @private z coordinate of the horizon from the "camera"
      this.zFarModel = 300;
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
      return zModel * this.viewSize.width * 0.5 / this.getFactor();
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
      return ( this.viewSize.height - this.yHorizonView ) * this.zNearModel / this.riseModel;
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
      return zModel * ( xView - this.viewSize.width / 2 ) / this.getFactor();
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
     * Given a 3D model position, project it into 2D view coordinates.
     * @param {Vector3 } position
     * @returns {Vector2}
     * @public
     */
    modelToViewPosition( position ) {
      const xView = ( this.viewSize.width / 2 ) + ( position.x / position.z ) * this.getFactor();
      const yView = this.yHorizonView - ( position.y / position.z ) * this.getFactor();
      return new Vector2( xView, yView );
    }

    //TODO I don't understand this, what is a 'view distance'? Is it an x distance?
    //TODO rename
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

    /**
     * Gets the view scaling factor that corresponds to model z position.
     * @param {number} zModel
     * @returns {number}
     */
    getViewScale( zModel ) {
      assert && assert( zModel > 0, `invalid zModel: ${zModel}` );
      return this.zNearModel * 0.25 / zModel;
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'Landscape does not support dispose' );
    }
  }

  return naturalSelection.register( 'Landscape', Landscape );
} );
