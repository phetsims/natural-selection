// Copyright 2020-2022, University of Colorado Boulder

/**
 * EnvironmentModelViewTransform is the model-view transform for the 'environment', the place where bunnies, wolves,
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
 * Here are some diagrams (not to scale) that illustrate the model (3D) and view (2D) spaces:
 *
 * Model, viewed from the top:
 *
 *       xMin (-xMax)         xMax
 *          \                  /
 *        ___\________________/_______ z = zFarModel (horizon)
 *            \    ground    /
 *             \ trapezoid  /
 *              \          /
 *        _______\________/___________ z = zNearModel (bottom of view)
 *                \      /
 *                 \    /
 *                  \  /
 *        ___________\/_______________ z = 0 (camera)
 *                  x=0
 *
 * Model, viewed from the side:
 *
 *         camera
 *          z=0    zNearModel  zFarModel
 *           |         |        |
 *        ___|_________|________|_____  y = 0 (horizon)
 *           |         |       /|
 *           |         |      / |
 *           |         |     /  |
 *           |         |    /   |
 *           |         |   /    |
 *           |         |  /     |
 *           |         | /      |
 *        ___|_________|/_______|_____ y = -riseModel (bottom of view)
 *           |         |        |
 *
 * View, 2D projection:
 *
 *      (0,0)
 *        o----------------------------------------------------+
 *        |                                                    |
 *        |                  (0, 0, zFarModel )                |
 *        |-------------------------o--------------------------o (viewSize.width, yHorizonView )
 *        |                                                    |
 *        |                                                    |
 *        |                                                    |
 *        |                                                    |
 *        |                                                    |
 *        |             (0, -riseModel, zNearModel )           |
 *        +-------------------------o--------------------------o
 *                                              (viewSize.width, viewSize.height)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jonathan Olson (Landscape.java, from which parts of this were adapted)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import naturalSelection from '../../naturalSelection.js';

// scale at zNearModel
const NEAR_SCALE = 1;
assert && assert( NEAR_SCALE > 0 && NEAR_SCALE <= 1, `invalid NEAR_SCALE: ${NEAR_SCALE}` );

export default class EnvironmentModelViewTransform {

  // size of the 2D view, same size as background PNG files
  public readonly viewSize: Dimension2;

  // horizon distance from the top of the view, determined empirically from background PNG files
  public readonly yHorizonView: number;

  // z coordinate of the ground at the bottom-front of the view, nearest ground point to the camera
  private readonly zNearModel: number;

  // z coordinate of the ground at the horizon, furthest ground point from the camera
  private readonly zFarModel: number;

  // rise of the ground from zNearModel to zFarModel
  private readonly riseModel: number;

  // common scaling factor used to convert x and y between model and view
  // Multiply for model-to-view, divide for view-to-model.
  private readonly xyScaleFactor: number;

  // z margin for getRandomGroundPosition, in model coordinates. This keeps bunnies well within the ground trapezoid,
  // and avoids floating-point errors that would have them end up just outside the ground trapezoid.
  public static readonly Z_MARGIN_MODEL = 1;

  public constructor() {

    this.viewSize = new Dimension2( 770, 310 );
    this.yHorizonView = 95;
    this.zNearModel = 150;
    this.zFarModel = 300;
    this.riseModel = 100;

    // Ported from Landscape.getFactor in the Java version.
    this.xyScaleFactor = this.zNearModel * ( this.viewSize.height - this.yHorizonView ) / this.riseModel;
  }

  public dispose(): void {
    assert && assert( false, 'EnvironmentModelViewTransform does not support dispose' );
  }

  /**
   * Returns a random position on the ground, in model coordinates.
   * @param xMargin - margin from the left and right edges of the view bounds
   */
  public getRandomGroundPosition( xMargin: number ): Vector3 {

    // Choose a random z coordinate on the ground trapezoid.
    const zModel = dotRandom.nextDoubleBetween(
      this.zNearModel + EnvironmentModelViewTransform.Z_MARGIN_MODEL,
      this.zFarModel - EnvironmentModelViewTransform.Z_MARGIN_MODEL
    );

    // Choose a random x coordinate at the z coordinate.
    const xMinModel = this.getMinimumX( zModel ) + xMargin;
    const xMaxModel = this.getMaximumX( zModel ) - xMargin;
    const xModel = dotRandom.nextDoubleBetween( xMinModel, xMaxModel );

    // Get the ground y coordinate at the z coordinate.
    const yModel = this.getGroundY( zModel );

    const position = new Vector3( xModel, yModel, zModel );
    assert && assert( this.isGroundPosition( position ), `unexpected position: ${position}` );

    return position;
  }

  /**
   * Gets the ground position at specified x and z coordinates, in model coordinates.
   */
  public getGroundPosition( xModel: number, zModel: number ): Vector3 {
    assert && assert( zModel >= this.zNearModel && zModel <= this.zFarModel, `invalid zModel: ${zModel}` );
    return new Vector3( xModel, this.getGroundY( zModel ), zModel );
  }

  /**
   * Gets the ground y at the specified z coordinate, in model coordinates.
   * Adapted from Landscape.getGroundY in the Java version.
   */
  public getGroundY( zModel: number ): number {
    assert && assert( zModel >= this.zNearModel && zModel <= this.zFarModel, `invalid zModel: ${zModel}` );

    // The slope is constant between near and far planes, so compute the scale accordingly.
    // Flip the sign because the rise is from near to far, and y = 0 is at the far plane, so all ground positions
    // will have y <= 0.
    const scale = -( this.zFarModel - zModel ) / ( this.zFarModel - this.zNearModel );

    return scale * this.riseModel;
  }

  /**
   * Gets the maximum x value (in model coordinates) for a particular depth.
   * This varies based on depth, since the ground is a trapezoid.
   * Ported from Landscape.getMaximumX in the Java version.
   */
  public getMaximumX( zModel: number ): number {
    assert && assert( zModel > 0, `invalid zModel: ${zModel}` );
    return zModel * this.viewSize.width * 0.5 / this.xyScaleFactor;
  }

  /**
   * Gets the minimum x value (in model coordinates) for a particular depth. Since x=0 is in the center, xMin === -xMax.
   */
  public getMinimumX( zModel: number ): number {
    return -this.getMaximumX( zModel );
  }

  /**
   * Gets the minimum z model coordinate for the ground trapezoid.
   */
  public getMinimumZ(): number {
    return this.zNearModel;
  }

  /**
   * Gets the maximum z model coordinate for the ground trapezoid.
   */
  public getMaximumZ(): number {
    return this.zFarModel;
  }

  /**
   * Gets the view scaling factor that corresponds to model z position.
   */
  public getViewScale( zModel: number ): number {
    assert && assert( zModel > 0, `invalid zModel: ${zModel}` );
    return NEAR_SCALE * this.zNearModel / zModel;
  }

  /**
   * Given a 3D model position, project it into 2D view coordinates and return x.
   * Extracted from Landscape.spriteToScreen in the Java version.
   */
  public modelToViewX( position: Vector3 ): number {
    assert && assert( position.z !== 0, 'z cannot be zero' );
    return ( this.viewSize.width / 2 ) + ( position.x / position.z ) * this.xyScaleFactor;
  }

  /**
   * Given a 3D model position, project it into 2D view coordinates and return y.
   * Extracted from Landscape.spriteToScreen in the Java version.
   */
  public modelToViewY( position: Vector3 ): number {
    assert && assert( position.z !== 0, 'z cannot be zero' );
    return this.yHorizonView - ( position.y / position.z ) * this.xyScaleFactor;
  }

  /**
   * Given a view y value, return the model z value where the ground has that y height.
   * Ported from Landscape.landscapeYToZ in the Java version.
   */
  public viewToModelZ( yView: number ): number {
    assert && assert( yView >= this.yHorizonView && yView <= this.viewSize.height, `invalid yView: ${yView}` );
    return ( this.zNearModel * this.zFarModel * ( this.yHorizonView - this.viewSize.height ) ) /
           ( this.zFarModel * ( this.yHorizonView - yView ) + this.zNearModel * ( yView - this.viewSize.height ) );
  }

  /**
   * Given a view x value and a model z value, return the model x value.
   * Ported from Landscape.landscapeXmodelZToX in the Java version.
   */
  public viewToModelX( xView: number, zModel: number ): number {
    return zModel * ( xView - this.viewSize.width / 2 ) / this.xyScaleFactor;
  }

  /**
   * Given view coordinates (x,y), return the ground position in model coordinates.
   */
  public viewToModelGroundPosition( xView: number, yView: number ): Vector3 {
    assert && assert( xView >= 0 && xView <= this.viewSize.width, `invalid xView: ${xView}` );
    assert && assert( yView >= this.yHorizonView && yView <= this.viewSize.height, `invalid yView: ${yView}` );

    const zModel = this.viewToModelZ( yView );
    const xModel = this.viewToModelX( xView, zModel );
    const yModel = this.getGroundY( zModel );
    return new Vector3( xModel, yModel, zModel );
  }

  /**
   * Turns a view distance (x or y) into a model distance at a specified model z.
   * Ported from Landscape.landscapeDistanceToModel in the Java version.
   */
  public viewToModelDistance( distanceView: number, zModel: number ): number {
    return distanceView * zModel / this.xyScaleFactor;
  }

  /**
   * Determines whether the specified position is on the ground trapezoid.
   */
  public isGroundPosition( position: Vector3 ): boolean {

    // check z first, because the validity of x and y depend on z
    return ( this.isGroundZ( position ) && this.isGroundX( position ) && this.isGroundY( position ) );
  }

  /**
   * Determines whether the specified position has its x coordinate on the ground trapezoid.
   */
  private isGroundX( position: Vector3 ): boolean {
    return ( position.x >= this.getMinimumX( position.z ) && position.x <= this.getMaximumX( position.z ) );
  }

  /**
   * Determines whether the specified position has its y coordinate on the ground trapezoid.
   */
  private isGroundY( position: Vector3 ): boolean {
    return ( position.y === this.getGroundY( position.z ) );
  }

  /**
   * Determines whether the specified position has its z coordinate on the ground trapezoid.
   */
  private isGroundZ( position: Vector3 ): boolean {
    return ( position.z >= this.zNearModel && position.z <= this.zFarModel );
  }
}

naturalSelection.register( 'EnvironmentModelViewTransform', EnvironmentModelViewTransform );