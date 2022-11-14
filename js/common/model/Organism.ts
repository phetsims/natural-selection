// Copyright 2020-2022, University of Colorado Boulder

/**
 * Organism is the base class for all living things that appear in the environment.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import XDirection from './XDirection.js';

// constants
const DEFAULT_POSITION = new Vector3( 0, 0, 1 ); // z=0 is illegal, results in divide-by-zero in modelViewTransform

type SelfOptions = {
  position?: Vector3; // initial position
  xDirection?: XDirection; // initial direction of motion along the x-axis
};

export type OrganismOptions = SelfOptions &
  PickOptional<PhetioObjectOptions, 'tandem' | 'phetioType' | 'phetioDynamicElement'>;

export default class Organism extends PhetioObject {

  public readonly modelViewTransform: EnvironmentModelViewTransform;
  public readonly positionProperty: Property<Vector3>;
  public readonly xDirectionProperty: EnumerationProperty<XDirection>;
  private readonly disposeOrganism: () => void;

  public constructor( modelViewTransform: EnvironmentModelViewTransform, providedOptions?: OrganismOptions ) {

    const options = optionize<OrganismOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: DEFAULT_POSITION,
      xDirection: XDirection.RIGHT,

      // PhetioObjectOptions
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    super( options );

    this.modelViewTransform = modelViewTransform;

    this.positionProperty = new Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioValueType: Vector3.Vector3IO,
      phetioHighFrequency: true,
      phetioReadOnly: true,
      phetioDocumentation: 'position in the 3D model coordinate frame'
    } );

    this.xDirectionProperty = new EnumerationProperty( options.xDirection, {
      tandem: options.tandem.createTandem( 'xDirectionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'direction that the organism is facing along the x axis'
    } );

    this.disposeOrganism = () => {
      this.positionProperty.dispose();
      this.xDirectionProperty.dispose();
    };
  }

  public reset(): void {
    this.positionProperty.reset();
    this.xDirectionProperty.reset();
  }

  public override dispose(): void {
    this.disposeOrganism();
    super.dispose();
  }

  /**
   * Gets the minimum x coordinate for an organism's position.
   */
  protected getMinimumX(): number {
    return this.modelViewTransform.getMinimumX( this.positionProperty.value.z );
  }

  /**
   * Gets the maximum x coordinate for an organism's position.
   */
  protected getMaximumX(): number {
    return this.modelViewTransform.getMaximumX( this.positionProperty.value.z );
  }

  /**
   * Gets the minimum z coordinate for an organism's position.
   */
  protected getMinimumZ(): number {
    return this.modelViewTransform.getMinimumZ() + EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }

  /**
   * Gets the maximum z coordinate for an organism's position.
   */
  protected getMaximumZ(): number {
    return this.modelViewTransform.getMaximumZ() - EnvironmentModelViewTransform.Z_MARGIN_MODEL;
  }
}

naturalSelection.register( 'Organism', Organism );