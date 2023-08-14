// Copyright 2020-2023, University of Colorado Boulder

/**
 * Wolf is the model of an individual wolf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Organism from './Organism.js';
import XDirection from './XDirection.js';

// determined empirically, to keep wolves inside bounds of the environment
const X_MARGIN = 35;

// Speed of a wolf, in pixels/second. A value is randomly chosen from this range for each wolf.
const WOLF_SPEED_RANGE = new Range( 125, 200 );

type WolfStateObject = {
  _speed: number;
};

export default class Wolf extends Organism {

  private _speed: number;
  public readonly disposedEmitter: Emitter; // fires when the Wolf has been disposed

  public constructor( modelViewTransform: EnvironmentModelViewTransform, tandem: Tandem ) {

    super( modelViewTransform, {

      // OrganismOptions
      position: modelViewTransform.getRandomGroundPosition( X_MARGIN ),
      xDirection: XDirection.getRandom(),
      tandem: tandem,
      phetioType: Wolf.WolfIO,
      phetioDynamicElement: true
    } );

    this._speed = dotRandom.nextDoubleInRange( WOLF_SPEED_RANGE );

    this.disposedEmitter = new Emitter();
  }

  public get speed(): number { return this._speed; }

  public override dispose(): void {
    assert && assert( !this.isDisposed, 'wolf is already disposed' );
    super.dispose();
    this.disposedEmitter.emit();
    this.disposedEmitter.dispose();
  }

  /**
   * Moves the Wolf around. A wolf will continue to move in its current direction until it gets to the edge of
   * the screen. Then it reverses direction.
   * @param dt - time step, in seconds
   */
  public move( dt: number ): void {

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

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by WolfIO to save and restore PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * WolfIO implements 'Dynamic element serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Dynamic element serialization is appropriate because Wolf instances are created dynamically each time the 'Wolves'
   * checkbox is checked in the 'Environmental Factors' panel. See the listener for isHuntingProperty in WolfCollection.
   */
  public static readonly WolfIO = new IOType<Wolf, WolfStateObject>( 'WolfIO', {
    valueType: Wolf,
    stateSchema: {

      // Fields that begin with '_' will not be shown in Studio.
      _speed: NumberIO
    }
    // toStateObject default works fine here.
    // stateObjectToCreateElementArguments: Not needed because WolfGroup.createElement takes no arguments.
    // applyState default works fine here, assigning stateObject._speed to this._speed.
  } );
}

naturalSelection.register( 'Wolf', Wolf );