// Copyright 2020, University of Colorado Boulder

/**
 * Organism is the base class for all living things that appear in the environment.
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
import XDirection from './XDirection.js';

// constants
const DEFAULT_POSITION = new Vector3( 0, 0, 1 ); // z=0 is illegal, results in divide-by-zero

class Organism extends PhetioObject {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {
      position: DEFAULT_POSITION, // initial position
      direction: XDirection.RIGHT, // initial direction of motion

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

    // @public direction that the organism is facing along the x axis
    this.xDirectionProperty = new EnumerationProperty( XDirection, options.direction, {
      tandem: options.tandem.createTandem( 'xDirectionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'direction that the organism is facing'
    } );

    // @private
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
   * @private
   */
  getMinimumX() {
    return this.modelViewTransform.getMinimumX( this.positionProperty.value.z ) +
           EnvironmentModelViewTransform.X_MARGIN_MODEL;
  }

  /**
   * Gets the maximum x coordinate for an organism's position.
   * @returns {number}
   * @private
   */
  getMaximumX() {
    return this.modelViewTransform.getMaximumX( this.positionProperty.value.z ) -
           EnvironmentModelViewTransform.X_MARGIN_MODEL;
  }

  /**
   * Gets the minimum z coordinate for an organism's position.
   * @returns {number}
   * @private
   */
  getMinimumZ() {
    return this.modelViewTransform.getMinimumZ() + EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }

  /**
   * Gets the maximum z coordinate for an organism's position.
   * @returns {number}
   * @private
   */
  getMaximumZ() {
    return this.modelViewTransform.getMaximumZ() - EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }
}

naturalSelection.register( 'Organism', Organism );
export default Organism;