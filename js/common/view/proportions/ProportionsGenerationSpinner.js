// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsGenerationSpinner is the spinner used to select the generation displayed by the Proportions graph.
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
   * @param {NumberProperty} proportionsGenerationProperty - the generation displayed by the Proportions graph
   * @param {Object} [options]
   */
  constructor( proportionsGenerationProperty, options ) {

    assert && assert( proportionsGenerationProperty instanceof NumberProperty, 'invalid proportionsGenerationProperty' );
    assert && assert( proportionsGenerationProperty.rangeProperty, 'proportionsGenerationProperty must have rangeProperty' );

    options = merge( {

      // NumberSpinner options
      xSpacing: 10,
      arrowsPosition: 'leftRight',
      touchAreaXDilation: 20,
      touchAreaYDilation: 10,
      mouseAreaXDilation: 10,
      mouseAreaYDilation: 5,
      numberDisplayOptions: {
        valuePattern: naturalSelectionStrings.generationValueProperty,
        align: 'center',
        xMargin: 0,
        yMargin: 0,
        backgroundStroke: null,
        backgroundFill: null,
        minBackgroundWidth: 100, // determined empirically
        textOptions: {
          font: NaturalSelectionConstants.PROPORTIONS_GENERATION_CONTROL_FONT,
          maxWidth: 250 // determined empirically
        }
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( proportionsGenerationProperty, proportionsGenerationProperty.rangeProperty, options );
  }
}

naturalSelection.register( 'ProportionsGenerationSpinner', ProportionsGenerationSpinner );
export default ProportionsGenerationSpinner;