// Copyright 2020, University of Colorado Boulder

/**
 * Wolf is the model of an individual wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Sprite from './Sprite.js';
import SpriteDirection from './SpriteDirection.js';
import WolfIO from './WolfIO.js';

class Wolf extends Sprite {

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

    // @public fires when the Bunny has been disposed
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
    //TODO
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by WolfIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Returns the serialized information needed by WolfIO.toStateObject. Providing this method prevents
   * WolfIO from reaching into Wolf and accessing private fields. Note that instrumented Properties do not
   * need to be handled here, they are automatically restored by PhET-iO.
   * @returns {Object}
   * @public for use by WolfIO only
   */
  toStateObject() {
    return {
      //TODO
    };
  }

  /**
   * Deserializes the state needed by WolfIO.stateToArgsForConstructor and WolfIO.setValue.
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
    // Everything will be restored via setValue.
    return [ {} ];  // explicit options arg to Wolf constructor
  }

  /**
   * Restores private state for PhET-iO. This is called by WolfIO.setValue after a Wolf has been instantiated
   * during deserialization. Providing this method prevents WolfIO from reaching into Wolf and accessing
   * private fields.
   * @param {Object} state - return value of fromStateObject
   * @public for use by WolfIO only
   */
  setValue( state ) {
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