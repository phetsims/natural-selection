// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionSprite is the base class for a model element that will be integrated into the environment scene.
 * It has a 3D position and a direction along the x axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import Vector3IO from '../../../../dot/js/Vector3IO.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import SpriteDirection from './SpriteDirection.js';

// constants
const DEFAULT_POSITION = new Vector3( 0, 0, 1 ); // z=0 is illegal, results in divide-by-zero

class NaturalSelectionSprite extends PhetioObject {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {
      position: DEFAULT_POSITION, // initial position
      direction: SpriteDirection.RIGHT, // initial direction of motion

      // phet-io
      tandem: Tandem.OPTIONAL
    }, options );

    super( options );

    // @public (read-only)
    this.modelViewTransform = modelViewTransform;

    // @public position in 3D space
    this.positionProperty = new Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector3IO ),
      phetioReadOnly: true,
      phetioDocumentation: 'position in the 3D model coordinate frame'
    } );

    // @public direction that the sprite is facing along the x axis
    this.directionProperty = new EnumerationProperty( SpriteDirection, options.direction, {
      tandem: options.tandem.createTandem( 'directionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'direction that the sprite is facing'
    } );

    // @private
    this.disposeNaturalSelectionSprite = () => {
      this.positionProperty.dispose();
      this.directionProperty.dispose();
    };
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.directionProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeNaturalSelectionSprite();
    super.dispose();
  }

  /**
   * Gets the minimum x coordinate for a sprite's position.
   * @returns {number}
   * @private
   */
  getMinimumX() {
    return this.modelViewTransform.getMinimumX( this.positionProperty.value.z ) +
           EnvironmentModelViewTransform.X_MARGIN_MODEL;
  }

  /**
   * Gets the maximum x coordinate for a sprite's position.
   * @returns {number}
   * @private
   */
  getMaximumX() {
    return this.modelViewTransform.getMaximumX( this.positionProperty.value.z ) -
           EnvironmentModelViewTransform.X_MARGIN_MODEL;
  }

  /**
   * Gets the minimum z coordinate for a sprite's position.
   * @returns {number}
   * @private
   */
  getMinimumZ() {
    return this.modelViewTransform.getMinimumZ() + EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }

  /**
   * Gets the maximum z coordinate for a sprite's position.
   * @returns {number}
   * @private
   */
  getMaximumZ() {
    return this.modelViewTransform.getMaximumZ() - EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }
}

naturalSelection.register( 'NaturalSelectionSprite', NaturalSelectionSprite );
export default NaturalSelectionSprite;