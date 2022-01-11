// Copyright 2020-2021, University of Colorado Boulder

/**
 * Organism is the base class for all living things that appear in the environment.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import XDirection from './XDirection.js';

// constants
const DEFAULT_POSITION = new Vector3( 0, 0, 1 ); // z=0 is illegal, results in divide-by-zero in modelViewTransform

class Organism extends PhetioObject {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {
      position: DEFAULT_POSITION, // initial position
      xDirection: XDirection.RIGHT, // initial direction of motion along the x axis

      // phet-io
      tandem: Tandem.OPTIONAL
    }, options );

    super( options );

    // @public (read-only) {EnvironmentModelViewTransform}
    this.modelViewTransform = modelViewTransform;

    // @public {Property.<Vector3>}
    this.positionProperty = new Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioType: Property.PropertyIO( Vector3.Vector3IO ),
      phetioHighFrequency: true,
      phetioReadOnly: true,
      phetioDocumentation: 'position in the 3D model coordinate frame'
    } );

    // @public {Property.<XDirection>}
    this.xDirectionProperty = new EnumerationDeprecatedProperty( XDirection, options.xDirection, {
      tandem: options.tandem.createTandem( 'xDirectionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'direction that the organism is facing along the x axis'
    } );

    // @private {function}
    this.disposeOrganism = () => {
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
    this.disposeOrganism();
    super.dispose();
  }

  /**
   * Gets the minimum x coordinate for an organism's position.
   * @returns {number}
   * @protected
   */
  getMinimumX() {
    return this.modelViewTransform.getMinimumX( this.positionProperty.value.z );
  }

  /**
   * Gets the maximum x coordinate for an organism's position.
   * @returns {number}
   * @protected
   */
  getMaximumX() {
    return this.modelViewTransform.getMaximumX( this.positionProperty.value.z );
  }

  /**
   * Gets the minimum z coordinate for an organism's position.
   * @returns {number}
   * @protected
   */
  getMinimumZ() {
    return this.modelViewTransform.getMinimumZ() + EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }

  /**
   * Gets the maximum z coordinate for an organism's position.
   * @returns {number}
   * @protected
   */
  getMaximumZ() {
    return this.modelViewTransform.getMaximumZ() - EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }
}

naturalSelection.register( 'Organism', Organism );
export default Organism;