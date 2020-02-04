// Copyright 2020, University of Colorado Boulder

/**
 * Sprite is the base class for a model element that will be integrated into the environment scene.
 * It has a 3D position and a direction along the x axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnvironmentModelViewTransform = require( 'NATURAL_SELECTION/common/model/EnvironmentModelViewTransform' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Vector3 = require( 'DOT/Vector3' );

  class Sprite  {

    /**
     * @param {EnvironmentModelViewTransform} modelViewTransform
     * @param {Object} [options]
     */
    constructor( modelViewTransform, options ) {
      assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

      options = merge( {
        position: Vector3.ZERO, // initial position
        xDirection: 1 // initial direction along the x axis, 1=right, -1=left
      }, options );

      // @public (read-only)
      this.modelViewTransform = modelViewTransform;

      // @public position in 3D space
      this.positionProperty = new Property( options.position, {
        valueType: Vector3
      } );

      // @public direction along the x axis, 1=right, -1=left
      // This is also used as a scale multiplier, to reflect the sprite's image about the y axis so that
      // the sprite looks like it's headed in the correct direction.  All artwork must therefore be drawn
      // in an orientation where the sprite is moving to the right.
      //TODO I don't like this
      this.xDirectionProperty = new NumberProperty( options.xDirection, {
        isValidValue: value => ( value === 1 || value === -1 )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.positionProperty.reset();
      this.xDirectionProperty.reset();
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

  return naturalSelection.register( 'Sprite', Sprite );
} );