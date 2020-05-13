// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsModel is the sub-model used by the Proportion view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
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
      phetioDocumentation: 'model elements that are specific to the Proportions graph'
    }, options );

    super( options );

    // @public
    this.genePool = genePool;
    this.currentGenerationProperty = currentGenerationProperty;

    // @public
    this.valuesVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'valuesVisibleProperty' )
    } );

    // @private Range of generationProperty changes as the number of generations increases. This cannot be a
    // DerivedProperty because we need to use NumberProperty.setValueAndRange to update generationProperty's
    // value and range atomically. See https://github.com/phetsims/axon/issues/289
    this.generationRangeProperty = new Property( new Range( 0, 0 ), {
      // Do not instrument
    } );

    // @public the generation that is displayed by the Proportions graph
    this.generationProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: this.generationRangeProperty,
      tandem: options.tandem.createTandem( 'generationProperty' ),
      phetioStudioControl: false // range is dynamic
    } );

    //TODO phet-io instrumentation
    //TODO these should be derived from other model state
    // @public
    this.startCountProperty = new NumberProperty( 1, {
      numberType: 'Integer'
    } );
    this.endCountProperty = new NumberProperty( 50, {
      numberType: 'Integer'
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
      }
    );
  }

  /**
   * @public
   */
  reset() {
    this.valuesVisibleProperty.reset();
    this.generationProperty.resetValueAndRange(); // because we are using setValueAndRange
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