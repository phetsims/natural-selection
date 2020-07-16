// Copyright 2020, University of Colorado Boulder

/**
 * Wolf is the model of an individual wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Organism from './Organism.js';
import WolfIO from './WolfIO.js';
import XDirection from './XDirection.js';

class Wolf extends Organism {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // Default to random position and x direction
      position: modelViewTransform.getRandomGroundPosition(),
      xDirection: XDirection.getRandom(),

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: WolfIO,
      phetioDynamicElement: true
    }, options );

    super( modelViewTransform, options );

    // @private
    this.speed = phet.joist.random.nextDoubleInRange( NaturalSelectionQueryParameters.wolfSpeed );

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
   * Moves the Wolf around.
   * @param {number} dt - time step, in seconds
   * @public
   */
  move( dt ) {

    //TODO I don't understand the use of cos, sin, and swap -- same as Bunny.getHopDelta
    const angle = phet.joist.random.nextDoubleBetween( 0, 2 * Math.PI );
    const a = dt * this.speed * Math.cos( angle );
    const b = dt * this.speed * Math.sin( angle );
    const swap = ( Math.abs( a ) < Math.abs( b ) );

    let z = this.positionProperty.value.z;

    const dx = Math.abs( swap ? b : a ) * XDirection.toSign( this.xDirectionProperty.value );
    let x = this.positionProperty.value.x + dx;

    // Reverse x direction if motion would exceed x boundaries
    if ( x <= this.getMinimumX() || x >= this.getMaximumX() ) {
      x = this.positionProperty.value.x - dx;
      this.xDirectionProperty.value = XDirection.opposite( this.xDirectionProperty.value );

      // Change z when x direction changes.
      // Reverse z direction if motion would exceed z boundaries
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
      private: {
        speed: NumberIO.toStateObject( this.speed )
      }
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
   * @param {Object} stateObject - return value of toStateObject
   * @public for use by WolfIO only
   */
  applyState( stateObject ) {
    required( stateObject );
    this.speed = required( NumberIO.fromStateObject( stateObject.private.speed ) );
    this.validateInstance();
  }

  /**
   * Performs validation of this instance. This should be called at the end of construction and deserialization.
   * @private
   */
  validateInstance() {
    assert && assert( NaturalSelectionUtils.isPositive( this.speed ), 'invalid speed' );
  }
}

naturalSelection.register( 'Wolf', Wolf );
export default Wolf;