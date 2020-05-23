// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsModel is the sub-model used by the Proportions view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import ObservableArrayIO from '../../../../axon/js/ObservableArrayIO.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCounts from './BunnyCounts.js';
import BunnyCountsIO from './BunnyCountsIO.js';
import ProportionsData from './ProportionsData.js';
import ProportionsDataIO from './ProportionsDataIO.js';

class ProportionsModel extends PhetioObject {

  /**
   * @param {Property.<BunnyCounts>} liveBunnyCountsProperty - counts of live bunnies, used for dynamic 'Currently' data
   * @param {Property.<number>} currentGenerationProperty
   * @param {Property.<boolean>} isPlayingProperty
   * @param {EnumerationProperty.<SimulationMode>} simulationModeProperty
   * @param {Object} [options]
   */
  constructor( liveBunnyCountsProperty, currentGenerationProperty, isPlayingProperty, simulationModeProperty, options ) {

    assert && assert( liveBunnyCountsProperty instanceof Property, 'invalid bunnyCounts' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( currentGenerationProperty, 'number' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( isPlayingProperty, 'boolean' );
    assert && assert( simulationModeProperty instanceof EnumerationProperty );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'model elements that are specific to the Proportions feature'
    }, options );

    super( options );

    // @private
    this.currentGenerationProperty = currentGenerationProperty;

    // @public
    this.valuesVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'valuesVisibleProperty' ),
      phetioDocumentation: 'determines whether values are visible on the bars in the Proportions graph'
    } );

    // @public the generation that is displayed by the Proportions graph
    this.generationProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, 0 ), // dynamically adjusted by calling setValueAndRange
      tandem: options.tandem.createTandem( 'generationProperty' ),
      phetioReadOnly: true // range is dynamic
    } );

    // @public whether the Proportions graph is displaying the current generation
    this.isDisplayingCurrentGenerationProperty = new DerivedProperty(
      [ this.generationProperty, currentGenerationProperty ],
      ( generation, currentGeneration ) => ( generation === currentGeneration )
    );

    // @public counts for 'Start of Generation'
    this.startCountsProperty = new Property( BunnyCounts.ZERO.copy(), {
      valueType: BunnyCounts
    } );

    // @public counts for 'End of Generation'
    this.endCountsProperty = new Property( BunnyCounts.ZERO.copy(), {
      valueType: BunnyCounts
    } );

    // 'Start' counts for the current generation. This is null until the sim enters SimulationMode.ACTIVE.
    // While in SimulationMode.ACTIVE it will always have a value.
    const currentStartCountsProperty = new Property( null, {
      tandem: options.tandem.createTandem( 'currentStartCountsProperty' ),
      phetioType: PropertyIO( NullableIO( BunnyCountsIO ) ),
      phetioDocumentation: 'Counts at the start of the current generation'
    } );

    const previousGenerationsData = new ObservableArray( {
      tandem: options.tandem.createTandem( 'previousGenerationsData' ),
      phetioType: ObservableArrayIO( ProportionsDataIO ),
      phetioDocumentation: 'Counts for previous generations, indexed by generation number'
    } );

    // Pause the sim when a generation other than the current generation is being viewed.
    this.generationProperty.link( generation => {
      if ( generation !== currentGenerationProperty.value ) {
        isPlayingProperty.value = false;
      }
    } );

    // When the sim starts playing or the current generation changes, show the current generation immediately.
    Property.multilink(
      [ isPlayingProperty, currentGenerationProperty ],
      ( isPlaying, currentGeneration ) => {
        if ( isPlaying ) {
          this.generationProperty.setValueAndRange( currentGeneration, new Range( 0, currentGeneration ) );
        }
      } );

    const updateEndCounts = () => {
      this.endCountsProperty.value = liveBunnyCountsProperty.value;
    };

    // Determine what data to display
    Property.multilink(
      [ this.generationProperty, currentStartCountsProperty ],
      ( generation, currentStartCounts ) => {

        if ( liveBunnyCountsProperty.hasListener( updateEndCounts ) ) {
          liveBunnyCountsProperty.unlink( updateEndCounts );
        }

        if ( currentStartCounts ) {

          // We have data. Decide whether to display data for the current generation or a previous generation.
          if ( generation === currentGenerationProperty.value ) {

            // Show dynamic data for the current generation.
            this.startCountsProperty.value = currentStartCountsProperty.value;

            // Update endCounts when there's a change to the liveBunnyCountsProperty.
            liveBunnyCountsProperty.link( updateEndCounts );
          }
          else {

            // Show static data for a previous generation.
            const data = previousGenerationsData.get( generation );
            this.startCountsProperty.value = data.startCounts;
            this.endCountsProperty.value = data.endCounts;
          }
        }
        else {

          // There is no data, so reset the counts
          this.startCountsProperty.reset();
          this.endCountsProperty.reset();
        }
      } );

    // @private
    this.currentStartCountsProperty = currentStartCountsProperty;
    this.previousGenerationsData = previousGenerationsData;
  }

  /**
   * @public
   */
  reset() {
    this.valuesVisibleProperty.reset();
    this.generationProperty.resetValueAndRange(); // because we're using setValueAndRange
    this.startCountsProperty.reset();
    this.endCountsProperty.reset();
    this.currentStartCountsProperty.reset();
    this.previousGenerationsData.clear();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsModel does not support dispose' );
  }

  /**
   * Records start counts for the current generation.
   * @param {generation} generation
   * @param {BunnyCounts} bunnyCounts
   */
  recordStartCounts( generation, bunnyCounts ) {
    assert && assert( generation === this.currentGenerationProperty.value, `${generation} is not the current generation` );
    this.currentStartCountsProperty.value = bunnyCounts;
    phet.log && phet.log( `ProportionsModel recorded start counts for generation ${generation}` );
  }

  /**
   * Records end counts for the previous generation, using what was formerly the current generation start data.
   * @param {number} generation
   * @param {BunnyCounts} endCounts
   * @public
   */
  recordEndCounts( generation, endCounts ) {
    assert && assert( generation === this.currentGenerationProperty.value - 1, `${generation} is not the previous generation` );
    assert && assert( this.previousGenerationsData.length === generation, `data already exists for generation ${generation}` );

    const startCounts = this.currentStartCountsProperty.value;
    const data = new ProportionsData( generation, startCounts, endCounts );
    this.previousGenerationsData.push( data );

    this.currentStartCountsProperty.value = null;

    phet.log && phet.log( `ProportionsModel recorded end counts for generation ${generation}` );
  }
}

naturalSelection.register( 'ProportionsModel', ProportionsModel );
export default ProportionsModel;