// Copyright 2020-2022, University of Colorado Boulder

/**
 * ProportionsGenerationSpinner is the spinner used to select the generation displayed by the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../../sun/js/NumberSpinner.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

type SelfOptions = EmptySelfOptions;

type ProportionsGenerationSpinnerOptions = SelfOptions & PickRequired<NumberSpinnerOptions, 'tandem'>;

export default class ProportionsGenerationSpinner extends NumberSpinner {

  public constructor( proportionsGenerationProperty: NumberProperty, providedOptions: ProportionsGenerationSpinnerOptions ) {

    const options = optionize<ProportionsGenerationSpinnerOptions, SelfOptions, NumberSpinnerOptions>()( {

      // NumberSpinnerOptions
      xSpacing: 10,
      arrowsPosition: 'leftRight',
      touchAreaXDilation: 20,
      touchAreaYDilation: 10,
      mouseAreaXDilation: 10,
      mouseAreaYDilation: 5,
      numberDisplayOptions: {
        valuePattern: NaturalSelectionStrings.generationValueStringProperty,
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
      }
    }, providedOptions );

    super( proportionsGenerationProperty, proportionsGenerationProperty.rangeProperty, options );
  }
}

naturalSelection.register( 'ProportionsGenerationSpinner', ProportionsGenerationSpinner );