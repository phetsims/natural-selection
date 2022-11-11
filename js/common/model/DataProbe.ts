// Copyright 2019-2022, University of Colorado Boulder

/**
 * DataProbe is the model for the data probe on the Population graph. It shows population (y-axis) values at a specific
 * generation (x-axis) value on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';
import PopulationModel from './PopulationModel.js';

type SelfOptions = EmptySelfOptions;

type DataProbeOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class DataProbe extends PhetioObject {

  private readonly populationModel: PopulationModel;

  // the initial offset, as requested in https://github.com/phetsims/natural-selection/issues/173
  // While we only need x (generations) offset, DragListener requires a {Property.<Vector2>}, and y offset will
  // be constrained to 0.
  public readonly offsetProperty: Property<Vector2>;

  // Named dataProbeGenerationProperty to distinguish it from the other 'generation' Properties in this sim.
  // See https://github.com/phetsims/natural-selection/issues/187
  public readonly dataProbeGenerationProperty: TReadOnlyProperty<number>;

  // BunnyCounts at the position of the data probe
  public readonly countsProperty: TReadOnlyProperty<BunnyCounts | null>;

  // visibility of the data probe
  public readonly visibleProperty: Property<boolean>;

  public constructor( populationModel: PopulationModel, providedOptions: DataProbeOptions ) {

    const options = optionize<DataProbeOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false // to prevent serialization, because we don't have an IO Type
    }, providedOptions );

    super( options );

    this.populationModel = populationModel;

    this.offsetProperty = new Vector2Property( new Vector2( 1.5, 0 ), {
      tandem: options.tandem.createTandem( 'offsetProperty' ),
      phetioDocumentation: 'offset of the data probe from the left edge of the graph'
    } );

    this.dataProbeGenerationProperty = new DerivedProperty(
      [ populationModel.xRangeProperty, this.offsetProperty ],
      ( xRange, offset ) => xRange.min + offset.x, {
        tandem: options.tandem.createTandem( 'dataProbeGenerationProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'the generation (x-axis) value where the data probe is positioned (decimal)'
      } );

    this.countsProperty = new DerivedProperty( [ this.dataProbeGenerationProperty, populationModel.timeInGenerationsProperty ],
      ( dataProbeGeneration, timeInGenerations ) => this.getCounts( dataProbeGeneration, timeInGenerations ), {
        tandem: options.tandem.createTandem( 'countsProperty' ),
        phetioValueType: NullableIO( BunnyCounts.BunnyCountsIO ),
        phetioDocumentation: 'counts displayed by the data probe'
      } );

    this.visibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );
  }

  public reset(): void {
    this.offsetProperty.reset();
    this.visibleProperty.reset();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Gets the bunny counts for a specific generation value.
   * @param dataProbeGeneration - current position of the data probe on the x-axis
   * @param timeInGenerations - current time on the generation clock, in generations
   * @returns null if there are no counts at the probe's position
   */
  private getCounts( dataProbeGeneration: number, timeInGenerations: number ): BunnyCounts | null {
    let counts = null;
    if ( dataProbeGeneration <= timeInGenerations && timeInGenerations > 0 ) {
      counts = new BunnyCounts( {
        totalCount: this.getCount( dataProbeGeneration, this.populationModel.totalPoints ),
        whiteFurCount: this.getCount( dataProbeGeneration, this.populationModel.whiteFurPoints ),
        brownFurCount: this.getCount( dataProbeGeneration, this.populationModel.brownFurPoints ),
        straightEarsCount: this.getCount( dataProbeGeneration, this.populationModel.straightEarsPoints ),
        floppyEarsCount: this.getCount( dataProbeGeneration, this.populationModel.floppyEarsPoints ),
        shortTeethCount: this.getCount( dataProbeGeneration, this.populationModel.shortTeethPoints ),
        longTeethCount: this.getCount( dataProbeGeneration, this.populationModel.longTeethPoints )
      } );
    }
    return counts;
  }

  /**
   * Gets the population count (y value) for a specific generation (x value).
   * @param dataProbeGeneration - current position of the data probe on the x-axis
   * @param points - data points, x (generation) and y (population)
   */
  private getCount( dataProbeGeneration: number, points: Vector2[] ): number {
    let count = 0;

    // Optimize for scrolling graph. Start with most recent points and work backwards in time.
    for ( let i = points.length - 1; i >= 0; i-- ) {
      const point = points[ i ];
      if ( dataProbeGeneration >= point.x ) {
        count = point.y;
        break;
      }
    }
    return count;
  }
}

naturalSelection.register( 'DataProbe', DataProbe );