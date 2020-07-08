// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsGenerationSpinner is the spinner used to select the generation displayed in the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import merge from '../../../../../phet-core/js/merge.js';
import NumberSpinner from '../../../../../sun/js/NumberSpinner.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

class ProportionsGenerationSpinner extends NumberSpinner {

  /**
   * @param {NumberProperty} generationProperty
   * @param {Object} [options]
   */
  constructor( generationProperty, options ) {

    assert && assert( generationProperty instanceof NumberProperty, 'invalid generationProperty' );
    assert && assert( generationProperty.rangeProperty, 'generationProperty must have rangeProperty' );

    options = merge( {

      // NumberSpinner options
      arrowsPosition: 'leftRight',
      backgroundStroke: null,
      backgroundFill: null,
      xMargin: 0,
      yMargin: 0,
      xSpacing: 10,
      valuePattern: naturalSelectionStrings.generationValue,
      valueAlign: 'center',
      font: NaturalSelectionConstants.PROPORTIONS_GENERATION_CONTROL_FONT,
      backgroundMinWidth: 100, // determined empirically

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( generationProperty, generationProperty.rangeProperty, options );
  }
}

naturalSelection.register( 'ProportionsGenerationSpinner', ProportionsGenerationSpinner );
export default ProportionsGenerationSpinner;