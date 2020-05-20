// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsModel is the sub-model used by the Proportion view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';
import GenePool from './GenePool.js';

class ProportionsModel extends PhetioObject {

  /**
   * @param {GenePool} genePool
   * @param {Property.<number>} currentGenerationProperty
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( genePool, currentGenerationProperty, isPlayingProperty, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( currentGenerationProperty instanceof Property, 'invalid currentGenerationProperty' );
    assert && assert( typeof currentGenerationProperty.value === 'number', 'invalid currentGenerationProperty.value' );
    assert && assert( isPlayingProperty instanceof Property, 'invalid isPlayingProperty' );
    assert && assert( typeof isPlayingProperty.value === 'boolean', 'invalid isPlayingProperty.value' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'model elements that are specific to the Proportions feature'
    }, options );

    super( options );

    // @public
    this.genePool = genePool; //TODO delete if not used by ProportionsModel
    this.currentGenerationProperty = currentGenerationProperty; //TODO delete if not used by ProportionsModel

    // @public
    this.valuesVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'valuesVisibleProperty' ),
      phetioDocumentation: 'determines whether values are visible on the bars in the Proportions graph'
    } );

    // @private Range of generationProperty changes as the number of generations increases. Our first instinct is
    // that this should be a DerivedProperty, derived from currentGenerationProperty. But this cannot be a
    // DerivedProperty because we need to use NumberProperty.setValueAndRange to update generationProperty's
    // value and range atomically, and a DerivedProperty cannot be set directly.
    // See https://github.com/phetsims/axon/issues/289
    this.generationRangeProperty = new Property( new Range( 0, 0 ) );

    // @public the generation that is displayed by the Proportions graph
    this.generationProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: this.generationRangeProperty,
      tandem: options.tandem.createTandem( 'generationProperty' ),
      phetioReadOnly: true // range is dynamic
    } );

    // @public
    this.currentGenerationDataProperty = new Property( null, {
      // tandem: options.tandem.createTandem( 'currentGenerationDataProperty' ), TODO phetioType?
      phetioDocumentation: 'Proportions data for the current generation'
    } );

    // @public
    this.previousGenerationsDataArray = new ObservableArray( {
      // tandem: options.tandem.createTandem( 'previousGenerationsDataArray' ), TODO phetioType?
      phetioDocumentation: 'Proportions data for previous generations, indexed by generation number'
    } );

    // Pause the sim when a generation other than the current generation is being viewed.
    this.generationProperty.link( generation => {
      if ( generation !== currentGenerationProperty.value ) {
        isPlayingProperty.value = false;
      }
    } );

    // @public counts for 'Start of Generation'
    this.startCounts = new BunnyCounts( {
      tandem: options.tandem.createTandem( 'startCounts' )
    } );

    // @public counts for 'End of Generation'
    this.endCounts = new BunnyCounts( {
      tandem: options.tandem.createTandem( 'endCounts' )
    } );

    //TODO add some dummy data, to see bars and percentages
    this.startCounts.totalCountProperty.value = 8;
    this.startCounts.whiteFurCountProperty.value = 4;
    this.startCounts.brownFurCountProperty.value = 4;
    this.startCounts.straightEarsCountProperty.value = 4;
    this.startCounts.floppyEarsCountProperty.value = 4;
    this.startCounts.shortTeethCountProperty.value = 4;
    this.startCounts.longTeethCountProperty.value = 4;
    this.endCounts.totalCountProperty.value = 8;
    this.endCounts.whiteFurCountProperty.value = 2;
    this.endCounts.brownFurCountProperty.value = 6;
    this.endCounts.straightEarsCountProperty.value = 2;
    this.endCounts.floppyEarsCountProperty.value = 6;
    this.endCounts.shortTeethCountProperty.value = 2;
    this.endCounts.longTeethCountProperty.value = 6;

    // When the sim starts playing or the current generation changes, show the current generation immediately.
    Property.multilink(
      [ isPlayingProperty, currentGenerationProperty ],
      ( isPlaying, currentGeneration ) => {
        if ( isPlaying ) {
          this.generationProperty.setValueAndRange( currentGeneration, new Range( 0, currentGeneration ) );
        }
      } );
  }

  /**
   * @public
   */
  reset() {
    this.valuesVisibleProperty.reset();
    this.generationProperty.resetValueAndRange();
    this.currentGenerationDataProperty.reset();
    this.previousGenerationsDataArray.clear();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsModel does not support dispose' );
  }
}

naturalSelection.register( 'ProportionsModel', ProportionsModel );
export default ProportionsModel;