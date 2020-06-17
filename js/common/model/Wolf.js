// Copyright 2020, University of Colorado Boulder

/**
 * Wolf is the model of an individual wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Range from '../../../../dot/js/Range.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import NaturalSelectionSprite from './NaturalSelectionSprite.js';
import SpriteDirection from './SpriteDirection.js';
import WolfIO from './WolfIO.js';

// const
const SPEED_RANGE = new Range( 2.75, 3.25 ); //TODO rename and document

class Wolf extends NaturalSelectionSprite {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: WolfIO,
      phetioDynamicElement: true
    }, options );

    // Default to random position and direction
    options.position = options.position || modelViewTransform.getRandomGroundPosition();
    options.direction = options.direction || SpriteDirection.getRandom();

    super( modelViewTransform, options );

    // @private
    this.speed = NaturalSelectionUtils.nextInRange( SPEED_RANGE );

    // @public fires when the Wolf has been disposed. dispose is required.
    this.disposedEmitter = new Emitter();

    // @private
    this.disposeWolf = () => {
      //TODO
    };

    this.validateInstance();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeWolf();
    super.dispose();
    this.disposedEmitter.emit();
    this.disposedEmitter.dispose();
    this.disposedEmitter = null; // in case we try to call dispose twice
  }

  /**
   * Moves the Wolf around.
   * @public
   */
  move() {

    //TODO I don't understand the use of cos, sin, and swap -- same as Bunny.getHopDelta
    const angle = phet.joist.random.nextDoubleBetween( 0, 2 * Math.PI );
    const a = this.speed * Math.cos( angle );
    const b = this.speed * Math.sin( angle );
    const swap = ( Math.abs( a ) < Math.abs( b ) );

    let z = this.positionProperty.value.z;

    const dx = Math.abs( swap ? b : a ) * SpriteDirection.toSign( this.directionProperty.value );
    let x = this.positionProperty.value.x + dx;

    // Reverse direction if motion would exceed x boundaries
    if ( x <= this.getMinimumX() || x >= this.getMaximumX() ) {
      x = this.positionProperty.value.x - dx;
      this.directionProperty.value = SpriteDirection.opposite( this.directionProperty.value );

      // Change z when direction changes.
      // Reverse direction if motion would exceed z boundaries
      const dz = ( swap ? a : b );
      z = this.positionProperty.value.z + dz;
      if ( z <= this.getMinimumZ() || z >= this.getMaximumZ() ) {
        z = this.positionProperty.value.z - dz;
      }
    }

    // wolves never leave the ground
    const y = this.modelViewTransform.getGroundY( z );

    this.positionProperty.value = new Vector3( x, y, z );
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by WolfIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Returns the serialized information needed by WolfIO.toStateObject.
   * @returns {Object}
   * @public for use by WolfIO only
   */
  toStateObject() {
    return {
      //TODO
    };
  }

  /**
   * Deserializes the state needed by WolfIO.stateToArgsForConstructor and WolfIO.applyState.
   * @param {Object} stateObject - return value from toStateObject
   * @returns {Object}
   * @public for use by WolfIO only
   */
  static fromStateObject( stateObject ) {
    return {
      //TODO
    };
  }

  /**
   * Creates the args that WolfGroup uses to create a Wolf instance.
   * @param state
   * @returns {Object[]}
   * @public for use by WolfIO only
   */
  static stateToArgsForConstructor( state ) {

    // stateToArgsForConstructor is called only for dynamic elements that are part of a group.
    // So we are not restoring anything through options, because that would not support static elements.
    // Everything will be restored via applyState.
    return [ {} ];  // explicit options arg to Wolf constructor
  }

  /**
   * Restores private state for PhET-iO. This is called by WolfIO.applyState after a Wolf has been instantiated
   * during deserialization.
   * @param {Object} state - return value of fromStateObject
   * @public for use by WolfIO only
   */
  applyState( state ) {
    required( state );
    //TODO
    this.validateInstance();
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    //TODO
  }
}

naturalSelection.register( 'Wolf', Wolf );
export default Wolf;