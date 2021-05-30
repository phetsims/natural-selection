// Copyright 2020-2021, University of Colorado Boulder

/**
 * Wolf is the model of an individual wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Organism from './Organism.js';
import XDirection from './XDirection.js';

// constants

// determined empirically, to keep wolves inside bounds of the environment
const X_MARGIN = 35;

// Speed of a wolf, in pixels/second. A value is randomly chosen from this range for each wolf.
const WOLF_SPEED_RANGE = new Range( 125, 200 );

class Wolf extends Organism {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // Default to random position and x direction
      position: modelViewTransform.getRandomGroundPosition( X_MARGIN ),
      xDirection: XDirection.getRandom(),

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Wolf.WolfIO,
      phetioDynamicElement: true
    }, options );

    super( modelViewTransform, options );

    // @private {number}
    this.speed = dotRandom.nextDoubleInRange( WOLF_SPEED_RANGE );

    // @public fires when the Wolf has been disposed. dispose is required.
    this.disposedEmitter = new Emitter();

    this.validateInstance();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( !this.isDisposed, 'wolf is already disposed' );
    super.dispose();
    this.disposedEmitter.emit();
    this.disposedEmitter.dispose();
  }

  /**
   * Moves the Wolf around. A wolf will continue to move in its current direction until it gets to the edge of
   * the screen. Then it reverses direction.
   * @param {number} dt - time step, in seconds
   * @public
   */
  move( dt ) {

    const angle = dotRandom.nextDoubleBetween( 0, 2 * Math.PI );

    // Do some basic trig to compute motion in x and z planes
    const hypotenuse = dt * this.speed;
    const adjacent = hypotenuse * Math.cos( angle ); // cos(theta) = adjacent/hypotenuse
    const opposite = hypotenuse * Math.sin( angle ); // sin(theta) = opposite/hypotenuse

    // We'll use the larger motion for dx, the smaller for dz.
    const oppositeIsLarger = ( Math.abs( opposite ) > Math.abs( adjacent ) );

    let z = this.positionProperty.value.z;

    const dx = Math.abs( oppositeIsLarger ? opposite : adjacent ) * XDirection.toSign( this.xDirectionProperty.value );
    let x = this.positionProperty.value.x + dx;

    // Reverse x direction if motion would exceed x boundaries
    if ( x <= this.getMinimumX() + X_MARGIN || x >= this.getMaximumX() - X_MARGIN ) {
      x = this.positionProperty.value.x - dx;
      this.xDirectionProperty.value = XDirection.opposite( this.xDirectionProperty.value );

      // Change z when x direction changes.
      // Reverse z direction if motion would exceed z boundaries
      const dz = ( oppositeIsLarger ? adjacent : opposite );
      z = this.positionProperty.value.z + dz;
      if ( z <= this.getMinimumZ() || z >= this.getMaximumZ() ) {
        z = this.positionProperty.value.z - dz;
      }
    }

    // wolves never leave the ground
    const y = this.modelViewTransform.getGroundY( z );

    this.positionProperty.value = new Vector3( x, y, z );
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( NaturalSelectionUtils.isPositive( this.speed ), 'invalid speed' );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by WolfIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this Wolf instance.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      private: {
        speed: NumberIO.toStateObject( this.speed )
      }
    };
  }

  /**
   * @public
   * @returns {Object}
   */
  static get STATE_SCHEMA() {
    return {
      private: {
        speed: NumberIO
      }
    };
  }


  /**
   * Creates the args that WolfGroup uses to instantiate a Wolf.
   * @param {*} state
   * @returns {Object[]}
   * @public
   */
  static stateToArgsForConstructor( state ) {

    // stateToArgsForConstructor is called only for dynamic elements that are part of a group.
    // So we are not restoring anything through options, because that would not support static elements.
    // Everything will be restored via applyState.
    return [ {} ];  // explicit options arg to Wolf constructor
  }

  /**
   * Restores Wolf state after instantiation.
   * @param {Object} stateObject - return value of toStateObject
   * @public
   */
  applyState( stateObject ) {
    required( stateObject );
    this.speed = required( NumberIO.fromStateObject( stateObject.private.speed ) );
    this.validateInstance();
  }
}

/**
 * WolfIO handles PhET-iO serialization of Wolf. Because serialization involves accessing private members,
 * it delegates to Wolf. The methods that WolfIO overrides are typical of 'Dynamic element serialization',
 * as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 * @public
 */
Wolf.WolfIO = IOType.fromCoreType( 'WolfIO', Wolf );

naturalSelection.register( 'Wolf', Wolf );
export default Wolf;