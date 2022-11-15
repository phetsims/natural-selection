// Copyright 2019-2022, University of Colorado Boulder

/**
 * ProportionsModel is the sub-model of the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCounts from './BunnyCounts.js';
import ProportionsCounts from './ProportionsCounts.js';

type SelfOptions = EmptySelfOptions;

type ProportionsModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class ProportionsModel extends PhetioObject {

  private readonly clockGenerationProperty: TReadOnlyProperty<number>;
  public readonly valuesVisibleProperty: Property<boolean>;

  // Named proportionsGenerationProperty to distinguish it from the other 'generation' Properties in this sim.
  // See https://github.com/phetsims/natural-selection/issues/187
  public readonly proportionsGenerationProperty: NumberProperty;

  // whether the Proportions graph is displaying the current generation. dispose is not necessary.
  public readonly isDisplayingCurrentGenerationProperty: TReadOnlyProperty<boolean>;

  // counts for 'Start of Generation'
  public readonly startCountsProperty: Property<BunnyCounts>;

  // counts for 'End of Generation'
  public readonly endCountsProperty: Property<BunnyCounts>;

  // Whether the model has data to display
  public readonly hasDataProperty: TReadOnlyProperty<boolean>;

  // visibility of the column for each gene in the graph
  public readonly furVisibleProperty: Property<boolean>;
  public readonly earsVisibleProperty: Property<boolean>;
  public readonly teethVisibleProperty: Property<boolean>;

  private readonly currentStartCountsProperty: Property<BunnyCounts | null>;

  private readonly previousCounts: ObservableArray<ProportionsCounts>;

  /**
   * @param liveBunnyCountsProperty - counts of live bunnies, used for dynamic 'Currently' data
   * @param clockGenerationProperty - the generation number of the generation clock
   * @param isPlayingProperty
   * @param providedOptions
   */
  public constructor( liveBunnyCountsProperty: Property<BunnyCounts>,
                      clockGenerationProperty: TReadOnlyProperty<number>,
                      isPlayingProperty: Property<boolean>,
                      providedOptions: ProportionsModelOptions ) {

    const options = optionize<ProportionsModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false, // to prevent serialization, because we don't have an IO Type
      phetioDocumentation: 'model elements that are specific to the Proportions feature'
    }, providedOptions );

    super( options );

    this.clockGenerationProperty = clockGenerationProperty;

    this.valuesVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'valuesVisibleProperty' ),
      phetioDocumentation: 'determines whether values are visible on the bars in the Proportions graph'
    } );

    this.proportionsGenerationProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, 0 ), // dynamically adjusted by calling setValueAndRange
      tandem: options.tandem.createTandem( 'proportionsGenerationProperty' ),
      phetioDocumentation: 'the generation whose data is displayed by the Proportions graph (integer)',
      phetioReadOnly: true // range is dynamic
    } );

    this.isDisplayingCurrentGenerationProperty = new DerivedProperty(
      [ this.proportionsGenerationProperty, clockGenerationProperty ],
      ( proportionsGeneration, clockGeneration ) => ( proportionsGeneration === clockGeneration ), {
        tandem: Tandem.OPT_OUT
      } );

    this.startCountsProperty = new Property( BunnyCounts.withZero(), {
      valueType: BunnyCounts,
      tandem: Tandem.OPT_OUT
    } );

    this.endCountsProperty = new Property( BunnyCounts.withZero(), {
      valueType: BunnyCounts,
      tandem: Tandem.OPT_OUT
    } );

    // 'Start' counts for the current generation. This is null until the sim enters SimulationMode.ACTIVE.
    // While in SimulationMode.ACTIVE it will always have a value.
    const currentStartCountsProperty = new Property<BunnyCounts | null>( null, {
      tandem: options.tandem.createTandem( 'currentStartCountsProperty' ),
      phetioValueType: NullableIO( BunnyCounts.BunnyCountsIO ),
      phetioDocumentation: 'Counts at the start of the current generation'
    } );

    const previousCounts = createObservableArray<ProportionsCounts>( {
      tandem: options.tandem.createTandem( 'previousCounts' ),
      phetioType: createObservableArray.ObservableArrayIO( ProportionsCounts.ProportionsCountsIO ),
      phetioDocumentation: 'Start and End counts for previous generations, indexed by generation number'
    } );

    this.hasDataProperty = new DerivedProperty(
      [ currentStartCountsProperty ], currentStartCounts => !!currentStartCounts, {
        tandem: Tandem.OPT_OUT
      } );

    // Pause the sim when a generation other than the current generation is being viewed. unlink is not necessary.
    this.proportionsGenerationProperty.link( proportionsGeneration => {
      if ( proportionsGeneration !== clockGenerationProperty.value ) {
        isPlayingProperty.value = false;
      }
    } );

    // visibility of the column for each gene in the graph
    this.furVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'furVisibleProperty' )
    } );
    this.earsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'earsVisibleProperty' )
    } );
    this.teethVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'teethVisibleProperty' )
    } );

    // When the sim starts playing or the current generation changes, show the current generation immediately.
    // unmultilink is not necessary.
    Multilink.multilink(
      [ isPlayingProperty, clockGenerationProperty ],
      ( isPlaying, clockGeneration ) => {
        if ( isPlaying ) {
          this.proportionsGenerationProperty.setValueAndRange( clockGeneration, new Range( 0, clockGeneration ) );
        }
      } );

    const updateEndCounts = () => {
      this.endCountsProperty.value = liveBunnyCountsProperty.value;
    };

    // Determine what data to display. unmultilink is not necessary.
    Multilink.multilink(
      [ this.proportionsGenerationProperty, currentStartCountsProperty ],
      ( proportionsGeneration, currentStartCounts ) => {

        if ( liveBunnyCountsProperty.hasListener( updateEndCounts ) ) {
          liveBunnyCountsProperty.unlink( updateEndCounts );
        }

        if ( currentStartCounts ) {

          // We have data. Decide whether to display data for the current generation or a previous generation.
          if ( proportionsGeneration === clockGenerationProperty.value ) {

            // Show static counts for the start of the current generation.
            this.startCountsProperty.value = currentStartCounts;

            // Show dynamic counts for the 'Currently' state of the current generation. unlink is handled above.
            liveBunnyCountsProperty.link( updateEndCounts );
          }
          else {

            // Show static counts for a previous generation.
            const counts = previousCounts[ proportionsGeneration ];
            assert && assert( counts.generation === proportionsGeneration, 'unexpected generation' );
            this.startCountsProperty.value = counts.startCounts;
            this.endCountsProperty.value = counts.endCounts;
          }
        }
        else {

          // There is no data, so reset the counts
          this.startCountsProperty.reset();
          this.endCountsProperty.reset();
        }
      } );

    // Create a Studio link
    this.addLinkedElement( liveBunnyCountsProperty, {
      tandem: options.tandem.createTandem( 'currentCountsProperty' )
    } );

    this.currentStartCountsProperty = currentStartCountsProperty;
    this.previousCounts = previousCounts;
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    this.proportionsGenerationProperty.resetValueAndRange(); // because we're using setValueAndRange
    this.startCountsProperty.reset();
    this.endCountsProperty.reset();
    this.currentStartCountsProperty.reset();
    this.previousCounts.length = 0; // use this approach because it's an ObservableArrayDef
    this.furVisibleProperty.reset();
    this.earsVisibleProperty.reset();
    this.teethVisibleProperty.reset();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Records start counts for the current generation.
   */
  public recordStartCounts( clockGeneration: number, startCounts: BunnyCounts ): void {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( clockGeneration ), 'invalid clockGeneration' );
    assert && assert( clockGeneration === this.clockGenerationProperty.value, `${clockGeneration} is not the current generation` );

    this.currentStartCountsProperty.value = startCounts;
  }

  /**
   * Records end counts for the previous generation, using what was formerly the current generation start data.
   */
  public recordEndCounts( generation: number, endCounts: BunnyCounts ): void {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( generation ), 'invalid generation' );
    assert && assert( generation === this.clockGenerationProperty.value - 1, `${generation} is not the previous generation` );
    assert && assert( this.previousCounts.length === generation,
      `unexpected generation=${generation}, expected ${this.previousCounts.length}` );

    const startCounts = this.currentStartCountsProperty.value!;
    assert && assert( startCounts !== null );
    this.previousCounts.push( new ProportionsCounts( generation, startCounts, endCounts ) );
  }
}

naturalSelection.register( 'ProportionsModel', ProportionsModel );