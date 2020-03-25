// Copyright 2020, University of Colorado Boulder

/**
 * Sprite is the base class for a model element that will be integrated into the environment scene.
 * It has a 3D position and a direction along the x axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import Vector3IO from '../../../../dot/js/Vector3IO.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import SpriteIO from './SpriteIO.js';

class Sprite extends PhetioObject {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {
      position: Vector3.ZERO, // initial position
      xDirection: 1, // initial direction along the x axis, 1=right, -1=left

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
      phetioType: PropertyIO( Vector3IO )
    } );

    // @public direction along the x axis, 1=right, -1=left
    // This is also used as a scale multiplier, to reflect the sprite's image about the y axis so that
    // the sprite looks like it's headed in the correct direction.  All artwork must therefore be drawn
    // in an orientation where the sprite is moving to the right.
    //TODO I don't like this
    this.xDirectionProperty = new NumberProperty( options.xDirection, {
      isValidValue: value => ( value === 1 || value === -1 ),
      tandem: options.tandem.createTandem( 'xDirectionProperty' )
    } );

    // @private
    this.disposeSprite = () => {
      this.positionProperty.dispose();
      this.xDirectionProperty.dispose();
    };
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.xDirectionProperty.reset();
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
  isMovingLeft() {
    return ( this.xDirectionProperty.value === -1 );
  }

  /**
   * Is the sprite moving towards the right?
   * @returns {boolean}
   * @public
   */
  isMovingRight() {
    return ( this.xDirectionProperty.value === 1 );
  }

  /**
   * Change the x direction of motion.
   * @public
   */
  reverseXDirection() {
    this.xDirectionProperty.value *= -1;
  }
}

naturalSelection.register( 'Sprite', Sprite );
export default Sprite;