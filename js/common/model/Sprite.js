// Copyright 2020, University of Colorado Boulder

/**
 * Sprite is the base class for a model element that will be integrated into the environment scene.
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
import SpriteIO from './SpriteIO.js';

// constants
const DEFAULT_POSITION = new Vector3( 0, 0, 1 ); // z=0 is illegal, results in divide-by-zero

class Sprite extends PhetioObject {

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
      tandem: Tandem.OPTIONAL, // not all Sprites are instrumented
      phetioType: SpriteIO
    }, options );

    super( options );

    // @public (read-only)
    this.modelViewTransform = modelViewTransform;

    // @public position in 3D space
    this.positionProperty = new Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector3IO ),
      phetioReadOnly: true
    } );

    // @public direction that the Sprite is facing along the x axis
    this.directionProperty = new EnumerationProperty( SpriteDirection, options.direction, {
      tandem: options.tandem.createTandem( 'directionProperty' ),
      phetioReadOnly: true
    } );

    // @private
    this.disposeSprite = () => {
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
    super.dispose();
    this.disposeSprite();
  }

  /**
   * Is the sprite moving towards the left?
   * @returns {boolean}
   * @public
   */
  //TODO delete this?
  isMovingLeft() {
    return ( this.directionProperty.value === SpriteDirection.LEFT );
  }

  /**
   * Is the sprite moving towards the right?
   * @returns {boolean}
   * @public
   */
  //TODO delete this?
  isMovingRight() {
    return ( this.directionProperty.value === SpriteDirection.RIGHT );
  }

  /**
   * Change the x direction of motion.
   * @public
   */
  reverseXDirection() {
    this.directionProperty.value =
      ( this.directionProperty.value === SpriteDirection.RIGHT ) ? SpriteDirection.LEFT : SpriteDirection.RIGHT;
  }

  /**
   * Converts x direction to x scale, use to reflect the corresponding Node about the y axis.
   * This assumes that the default direction for all Sprites is SpriteDirection.RIGHT.
   * For example, this means that all bunny PNG files were drawn with the bunny facing right.
   * @param {SpriteDirection} direction
   * @returns {number}
   */
  static directionToScale( direction ) {
    return ( direction === SpriteDirection.RIGHT ) ? 1 : -1;
  }
}

naturalSelection.register( 'Sprite', Sprite );
export default Sprite;